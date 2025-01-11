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

    console.log(restaurants);

    await lineClient.replyMessage(event.replyToken, {
      type: 'flex',
      altText: 'ร้านอาหารใกล้เคียง',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '🍜 ร้านอาหารใกล้เคียง',
              weight: 'bold',
              size: 'xl',
              align: 'center',
              color: '#27ACB2',
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              spacing: 'sm',
              contents: restaurants.map((restaurant, index) => ({
                type: 'box',
                layout: 'vertical',
                margin: index === 0 ? undefined : 'lg',
                contents: [
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'text',
                        text: `${index + 1}`,
                        size: 'sm',
                        color: '#27ACB2',
                        flex: 1,
                      },
                      {
                        type: 'text',
                        text: restaurant.name,
                        size: 'md',
                        color: '#111111',
                        weight: 'bold',
                        flex: 9,
                        wrap: true,
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'sm',
                    margin: 'sm',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: '📍',
                            flex: 1,
                            size: 'sm',
                          },
                          {
                            type: 'text',
                            text: restaurant.address,
                            size: 'sm',
                            color: '#666666',
                            flex: 9,
                            wrap: true,
                          },
                        ],
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: '⭐',
                            flex: 1,
                            size: 'sm',
                          },
                          {
                            type: 'text',
                            text: `${restaurant.rating}`,
                            size: 'sm',
                            color: '#666666',
                            flex: 9,
                          },
                        ],
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: '📏',
                            flex: 1,
                            size: 'sm',
                          },
                          {
                            type: 'text',
                            text: restaurant.distance,
                            size: 'sm',
                            color: '#666666',
                            flex: 9,
                          },
                        ],
                      },
                    ],
                  },
                ],
              })),
            },
          ],
          paddingAll: '20px',
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
