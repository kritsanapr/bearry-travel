import { LineEvent } from '../types/line-event.interface';
import { lineClient } from '../config/line.config';
import { findNearbyRestaurants } from '../services/places.service';

export async function handleRestaurantSearch(event: LineEvent) {
  try {
    const location = event.message?.location;
    if (!location) {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'กรุณาแชร์ตำแหน่งที่ตั้งของคุณเพื่อค้นหาร้านอาหารใกล้เคียง',
      });
      return;
    }

    const restaurants = await findNearbyRestaurants(
      location.latitude,
      location.longitude
    );
    const restaurantList = restaurants
      .map(
        (r, i) =>
          `${i + 1}. ${r.name}\n📍 ${r.address}\n⭐ ${r.rating}\n📏 ${r.distance}`
      )
      .join('\n\n');

    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: `ร้านอาหารใกล้เคียง:\n\n${restaurantList}`,
    });
  } catch (error) {
    console.error('Restaurant search error:', error);
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถค้นหาร้านอาหารได้ในขณะนี้',
    });
  }
}
