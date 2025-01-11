import { LineEvent } from '../types/line-event.interface';
import { lineClient } from '../config/line.config';
import { findNearbyRestaurants } from '../services/places.service';
import {
  getUserLocation,
  updateUserLocation,
} from '../services/location.service';

export async function handleRestaurantSearch(event: LineEvent) {
  try {
    // Handle location message type
    if (event.message?.type === 'location') {
      await updateUserLocation(event.source.userId, {
        latitude: event.message.location?.latitude ?? 0,
        longitude: event.message.location?.longitude ?? 0,
        address: event.message.location?.address || '',
        name: event.message.location?.name || '',
      });
    }

    // Try to get saved location
    const savedLocation = await getUserLocation(event.source.userId);

    // If no location is saved and this is not a location message
    if (!savedLocation && event.message?.type !== 'location') {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'กรุณาแชร์ตำแหน่งที่ตั้งของคุณเพื่อค้นหาร้านอาหารใกล้เคียง',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'location',
                label: '📍 แชร์ตำแหน่งปัจจุบัน',
              },
            },
          ],
        },
      });
      return;
    }

    // Use either the saved location or the new location message
    const location =
      event.message?.type === 'location'
        ? {
            latitude: event.message.location?.latitude ?? 0,
            longitude: event.message.location?.longitude ?? 0,
          }
        : savedLocation;

    const restaurants = await findNearbyRestaurants(
      location.latitude,
      location.longitude
    );

    console.log('Found restaurants:', restaurants);

    if (!restaurants.length) {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ไม่พบร้านอาหารในบริเวณใกล้เคียง',
      });
      return;
    }

    await lineClient.replyMessage(event.replyToken, {
      type: 'flex',
      altText: 'ร้านอาหารใกล้เคียง',
      contents: {
        type: 'bubble',
        body: {
          type: 'box' as const,
          layout: 'vertical' as const,
          contents: [
            {
              type: 'text' as const,
              text: '🍜 ร้านอาหารใกล้เคียง',
              weight: 'bold' as const,
              size: 'xl',
            },
            ...restaurants.map((restaurant) => ({
              type: 'box' as const,
              layout: 'vertical' as const,
              margin: 'lg',
              contents: [
                {
                  type: 'text' as const,
                  text: restaurant.name,
                  weight: 'bold' as const,
                  wrap: true,
                },
                {
                  type: 'text' as const,
                  text: `📍 ${restaurant.address}`,
                  size: 'sm',
                  color: '#666666',
                  wrap: true,
                  margin: 'sm',
                },
                {
                  type: 'text' as const,
                  text: `🚶 ${restaurant.distance}`,
                  size: 'sm',
                  color: '#666666',
                  margin: 'sm',
                },
              ],
            })),
          ],
        },
      },
    });
  } catch (error) {
    console.error('Restaurant search error:', error);
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถค้นหาร้านอาหารได้ในขณะนี้',
    });
  }
}
