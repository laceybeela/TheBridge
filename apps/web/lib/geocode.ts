export interface GeoResult {
  displayName: string;
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function geocodeCity(query: string): Promise<GeoResult[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "5",
    addressdetails: "0",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: { "User-Agent": "TheBridge/1.0" },
    }
  );

  if (!res.ok) return [];

  const data: NominatimResult[] = await res.json();

  return data.map((r) => ({
    displayName: r.display_name,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
  }));
}
