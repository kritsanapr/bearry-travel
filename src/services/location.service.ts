import axios from 'axios';

interface UserLocation {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// In-memory cache for user locations (in production, use Redis or a database)
const userLocations: Map<string, UserLocation> = new Map();

export async function getUserLocation(userId: string): Promise<UserLocation> {
  try {
    // Check if we have cached location
    const cachedLocation = userLocations.get(userId);
    if (cachedLocation) {
      return cachedLocation;
    }

    // If no cached location, get user's profile to get their language setting
    const response = await axios.get(
      `https://api.line.me/v2/bot/profile/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    // Use IP Geolocation as fallback (you might want to use a different service in production)
    const geoResponse = await axios.get('http://ip-api.com/json');

    const location: UserLocation = {
      name: 'Current Location',
      address: geoResponse.data.city + ', ' + geoResponse.data.country,
      latitude: geoResponse.data.lat,
      longitude: geoResponse.data.lon,
    };

    // Cache the location
    userLocations.set(userId, location);

    return location;
  } catch (error) {
    console.error('Error getting user location:', error);
    throw new Error('Failed to get user location');
  }
}

export function updateUserLocation(
  userId: string,
  location: UserLocation
): void {
  userLocations.set(userId, location);
}

export function clearUserLocation(userId: string): void {
  userLocations.delete(userId);
}
