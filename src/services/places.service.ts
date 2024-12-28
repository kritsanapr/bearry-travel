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
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: '1000', // 1km radius
          type: 'restaurant',
          key: process.env.GOOGLE_MAPS_API_KEY,
          language: 'ja' // Japanese results
        },
      }
    );

    return response.data.results.slice(0, 5).map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'N/A',
      distance: calculateDistance(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng)
    }));
  } catch (error) {
    console.error('Error finding nearby restaurants:', error);
    throw new Error('Failed to find nearby restaurants');
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
