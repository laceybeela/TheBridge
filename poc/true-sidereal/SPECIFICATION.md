# True Sidereal Calculation Specification

## Overview

This specification defines the calculation pipeline for True Sidereal astrology using the Midpoint Method. The system assigns celestial body positions to one of 13 constellations (the 12 traditional zodiac signs plus Ophiuchus) based on empirically-derived constellation boundaries.

## 1. Input

```typescript
interface BirthData {
  date: string;      // ISO date, e.g., "1990-06-15"
  time: string;      // 24-hour time in UTC, e.g., "14:30"
  latitude: number;  // Observer latitude in decimal degrees
  longitude: number; // Observer longitude in decimal degrees
}
```

The `date` and `time` fields represent the UTC birth time. Timezone conversion from local time is handled upstream (by `lib/actions.ts` in the production app).

## 2. Coordinate Frame

All positions are computed in the **J2000 mean ecliptic (ECL)** frame:
- Origin: Earth's center (geocentric) or observer's surface position (topocentric)
- Reference plane: Earth's orbital plane at J2000.0 epoch
- Reference direction: Vernal equinox of J2000.0
- Epoch: January 1, 2000, 12:00 TT (Terrestrial Time)

## 3. Position Calculation

### 3a. Sun

1. Call `GeoVector(Body.Sun, time, true)` to obtain the geocentric J2000 equatorial (EQJ) position vector with aberration correction.
2. Apply the fixed rotation `Rotation_EQJ_ECL()` to convert from EQJ to J2000 ecliptic (ECL).
3. Extract ecliptic longitude: `atan2(y, x)` converted to degrees, normalized to [0, 360).

Topocentric correction is not applied (solar parallax is negligible at ~0.0024°).

### 3b. Moon

1. Call `GeoVector(Body.Moon, time, true)` for the geocentric EQJ vector.
2. **Topocentric correction:** Subtract the observer's EQJ position vector obtained via `ObserverVector(time, observer, false)` from the geocentric Moon vector.
3. Apply `Rotation_EQJ_ECL()` rotation.
4. Extract ecliptic longitude as above.

Topocentric correction matters for the Moon (parallax up to ~1°).

### 3c. Ascendant (Rising Sign)

1. Compute the ascendant longitude in the true ecliptic of date (ECT) frame using the standard formula:
   ```
   ASC = atan2(-cos(ARMC), sin(ARMC) * cos(ε) + tan(φ) * sin(ε)) + π
   ```
   Where ARMC is the local sidereal time in degrees, ε is the obliquity of the ecliptic, and φ is the observer's latitude.

2. Create a unit vector on the ECT ecliptic plane: `(cos(ASC), sin(ASC), 0)`.

3. Convert to J2000 ecliptic via two rotations:
   - ECT → EQJ: `Rotation_ECT_EQJ(time)` (time-dependent, accounts for precession + nutation)
   - EQJ → ECL: `Rotation_EQJ_ECL()` (fixed)

4. Extract J2000 ecliptic longitude from the rotated vector.

## 4. Constellation Boundary Table

The Midpoint Method boundary table (version 2025.07) defines 13 constellation regions by their J2000 ecliptic longitude start points:

| # | Constellation | Start (°) | Width (°) | End (°) |
|---|---|---|---|---|
| 1 | Aries | 31.2816 | 19.73 | 51.0116 |
| 2 | Taurus | 51.0083 | 36.86 | 87.8683 |
| 3 | Gemini | 87.8655 | 29.45 | 117.3155 |
| 4 | Cancer | 117.3194 | 17.15 | 134.4694 |
| 5 | Leo | 134.4689 | 38.42 | 172.8889 |
| 6 | Virgo | 172.8884 | 49.72 | 222.6084 |
| 7 | Libra | 222.6069 | 18.88 | 241.4869 |
| 8 | Scorpio | 241.4853 | 13.23 | 254.7153 |
| 9 | Ophiuchus | 254.7132 | 12.36 | 267.0732 |
| 10 | Sagittarius | 267.0711 | 33.39 | 300.4611 |
| 11 | Capricorn | 300.4622 | 25.67 | 326.1322 |
| 12 | Aquarius | 326.1312 | 23.16 | 349.2912 |
| 13 | Pisces | 349.2959 | 41.99 | 391.2859 (= 31.2859) |

Total: 360.00°. Pisces wraps across the 0°/360° boundary.

Widths range from 12.36° (Ophiuchus) to 49.72° (Virgo).

## 5. Sign Assignment Algorithm

Given a J2000 ecliptic longitude `lon` (normalized to [0, 360)):

1. Binary search the sorted boundary table to find the last entry whose `startLongitude ≤ lon`.
2. If no entry satisfies this (i.e., `lon < 31.2816`), the sign is Pisces (the table wraps).
3. Compute `degreeInSign = lon - entry.startLongitude`. For Pisces wraparound, add 360 if negative.
4. Flag `nearBoundary = true` if `degreeInSign < 3` or `(entry.width - degreeInSign) < 3`.

## 6. Output

Each placement records:

```typescript
interface TrueSiderealPlacement {
  body: "sun" | "moon" | "rising";
  sign: Constellation;        // One of 13 constellation names
  degreeInSign: number;        // Degrees from constellation start
  totalWidth: number;          // Total width of the constellation
  nearBoundary: boolean;       // Within 3° of a boundary
  eclipticLongitude: number;   // Raw J2000 ecliptic longitude
  system: "true_sidereal";
  method: "midpoint";
  methodVersion: "2025.07";
  coordinateFrame: "J2000_ECL";
}
```

## 7. Worked Example

**Input:** June 15, 1990, 14:30 UTC, Los Angeles (34.0522°N, 118.2437°W)

1. **Sun:**
   - `GeoVector(Sun, time, true)` → EQJ vector
   - Rotate to ECL → longitude ≈ 83.8° (in Taurus: 51.0083 to 87.8655)
   - `degreeInSign ≈ 32.8°`, `totalWidth = 36.86°`
   - `nearBoundary = true` (within 3° of Taurus/Gemini boundary)

2. **Moon:**
   - Geocentric EQJ vector with topocentric correction
   - ECL longitude depends on exact time (Moon moves ~0.5°/hour)

3. **Rising:**
   - ECT ascendant formula → ECT longitude
   - ECT → EQJ → ECL rotation → J2000 ecliptic longitude
   - Lookup in boundary table

## 8. Houses

The Midpoint Method uses Equal House (12 houses of 30° from the Ascendant), which is independent of the 13-sign system. Ophiuchus and Scorpio share the 8th house region. House calculation is not part of this POC.

## 9. Legacy Compatibility

The existing Lahiri sidereal system (`system: "sidereal"`) remains unchanged. True Sidereal is identified by `system: "true_sidereal"`. Both can coexist.
