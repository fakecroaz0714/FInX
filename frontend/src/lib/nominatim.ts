/**
 * Nominatim OpenStreetMap Geocoding and Reverse Geocoding API Client
 */

export interface NominatimPlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type: string;
  importance?: number;
  boundingbox?: [string, string, string, string];
  address?: {
    village?: string;
    suburb?: string;
    town?: string;
    city?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Search places by free-text address or query
 */
export async function searchAddress(query: string, limit: number = 5): Promise<NominatimPlace[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query.trim()
  )}&addressdetails=1&limit=${limit}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) {
    throw new Error(`Nominatim geocoding error: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Reverse geocode latitude/longitude coordinates to a readable address
 */
export async function reverseGeocode(lat: number, lon: number): Promise<NominatimPlace | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) {
    throw new Error(`Nominatim reverse geocoding error: ${res.statusText}`);
  }

  return res.json();
}
