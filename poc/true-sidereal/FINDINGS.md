# True Sidereal Calculation: Technical Findings

## 1. Coordinate Frame Analysis

### The Problem

The existing Bridge engine uses `SunPosition(time).elon` and `EclipticGeoMoon(time).lon` from astronomy-engine. These return positions in the **true ecliptic of date (ECT)** frame -- the ecliptic plane oriented at the observation date, accounting for precession and nutation.

The Midpoint Method boundary table uses **J2000 mean ecliptic (ECL)** coordinates -- the ecliptic plane at epoch J2000.0 (January 1, 2000, 12:00 TT).

### Magnitude of Error

The difference between ECT and J2000 ECL grows with time from the J2000 epoch:

| Year | Offset from J2000 | Approx. ECT-ECL difference |
|---|---|---|
| 1950 | -50 years | ~0.70° |
| 1970 | -30 years | ~0.42° |
| 2000 | 0 years | ~0.00° |
| 2024 | +24 years | ~0.34° |
| 2050 | +50 years | ~0.70° |

Near a constellation boundary, even 0.3° can change the sign assignment. Ophiuchus is only 12.36° wide, making it particularly sensitive to frame errors.

### The Existing Lahiri Approach Masks This

In conventional sidereal astrology, the ayanamsa subtraction implicitly compensates for precession. The ayanamsa is defined as a linear function of time that tracks the precession offset. This works because conventional sidereal uses equal 30° signs -- the boundaries shift uniformly with precession.

For True Sidereal with a fixed J2000 boundary table, we need actual J2000 coordinates, not "tropical minus ayanamsa."

### Solution: GeoVector + Rotation Pipeline

The correct approach:
1. `GeoVector(body, time, true)` returns the J2000 equatorial (EQJ) position vector
2. `Rotation_EQJ_ECL()` provides the fixed rotation from EQJ to J2000 ecliptic
3. `RotateVector()` applies the rotation
4. `atan2(y, x)` extracts the ecliptic longitude

This is exact -- no linear approximation of precession, no accumulated error over time.

### Ascendant Frame Conversion

The ascendant formula produces a longitude in the ECT frame (it uses the obliquity-of-date and sidereal time, both of which define the ecliptic-of-date). To convert:

1. Treat the ECT ascendant longitude as a point on the ecliptic-of-date plane (unit vector with z=0)
2. Rotate ECT → EQJ using `Rotation_ECT_EQJ(time)` (time-dependent)
3. Rotate EQJ → ECL using `Rotation_EQJ_ECL()` (fixed)
4. Extract longitude from the resulting vector

This two-step rotation correctly accounts for both precession and nutation.

## 2. Topocentric vs. Geocentric

### Impact by Body

- **Sun:** Solar parallax is ~8.8 arcseconds (0.0024°). Negligible. Geocentric is sufficient.
- **Moon:** Lunar parallax can reach ~1° (3600 arcseconds). This is significant near constellation boundaries.
- **Planets:** Mars parallax can reach ~23 arcseconds. Other planets are even smaller. Negligible for sign assignment.
- **Ascendant:** Already inherently topocentric (uses observer latitude/longitude).

### Implementation

Topocentric Moon correction subtracts the observer's geocentric position vector from the Moon's geocentric position vector:

```
topocentric = geocentric_moon - observer_position
```

`ObserverVector(time, observer, false)` provides the observer's position in J2000 equatorial coordinates.

## 3. Licensing Assessment

### Boundary Data

The Midpoint Method boundary table published by Chimenti (2026) has a CC BY-NC-ND 4.0 license on the paper itself.

However, the boundary values are likely not independently copyrightable:

- **Star positions:** From the Hipparcos-2 catalog, originally published by ESA. Available from NASA as a U.S. government work (public domain). Astronomical facts are discovered, not created (Feist v. Rural, 1991).
- **Midpoint calculation:** A mathematical operation on observed star positions. Mathematical procedures are not copyrightable (Baker v. Selden, 1879).
- **The resulting values:** Products of applying a mathematical formula to public-domain astronomical data.

### Recommended Approach

The POC independently computes boundary values from public-domain Hipparcos-2 star positions. We cite Chimenti for the methodology and credit the approach, but do not copy the paper's prose or creative expression.

## 4. Precision Analysis

### Sources of Uncertainty

1. **Boundary table precision:** Values specified to 4 decimal places (~0.36 arcseconds). More than adequate.
2. **astronomy-engine precision:** Documented accuracy of ~1 arcsecond for planets, ~10 arcseconds for the Moon. Adequate for sign assignment.
3. **Topocentric correction:** Up to ~1° for the Moon. Implemented.
4. **Aberration correction:** `GeoVector` with `aberration=true` accounts for annual aberration (~20 arcseconds). Included.
5. **Coordinate frame rotation:** Exact via rotation matrices. No approximation error.

### Transition Zone

MTZ recommends treating positions within 3° of a boundary as being in a "transition zone." The POC flags these with `nearBoundary: true`. This is a philosophical/interpretive choice, not a precision issue.

## 5. Boundary Table Version

The POC uses the post-July 2025 revision of the Midpoint Method boundary table. The revision primarily affected the Aries, Taurus, Gemini, and Cancer boundaries. The version identifier is `2025.07`.
