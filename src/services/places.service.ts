import axios from 'axios';

interface Place {
  name: string;
  address: string;
  rating: number;
  distance: string;
}

export async function findNearbyRestaurants(
  latitude: number,
  longitude: number
): Promise<Place[]> {
  try {
    // Using Mapbox Places API
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json`,
      {
        params: {
          proximity: `${longitude},${latitude}`, // Note: Mapbox uses longitude,latitude order
          access_token: process.env.MAPBOX_ACCESS_TOKEN,
          limit: 5,
          language: 'ja', // Japanese results
          types: 'poi',
          bbox: getBoundingBox(latitude, longitude, 1), // 1km radius
        },
      }
    );

    return response.data.features.map((place: any) => ({
      name: place.text,
      address: place.place_name,
      rating: 'N/A', // Mapbox doesn't provide ratings
      distance: calculateDistance(
        latitude,
        longitude,
        place.center[1], // Latitude
        place.center[0] // Longitude
      ),
    }));
  } catch (error) {
    console.error('Error finding nearby restaurants:', error);
    throw new Error('Failed to find nearby restaurants');
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance < 1
    ? `${Math.round(distance * 1000)}m`
    : `${distance.toFixed(1)}km`;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getBoundingBox(lat: number, lon: number, radiusKm: number): string {
  const latRadian = deg2rad(lat);
  const degLatKm = 110.574; // km per degree of latitude
  const degLonKm = 111.32 * Math.cos(latRadian); // km per degree of longitude

  const deltaLat = radiusKm / degLatKm;
  const deltaLon = radiusKm / degLonKm;

  // Return as minLon,minLat,maxLon,maxLat
  return `${lon - deltaLon},${lat - deltaLat},${lon + deltaLon},${lat + deltaLat}`;
}
