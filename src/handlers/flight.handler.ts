import { LineEvent } from '../types';
import { lineClient } from '../config/line.config';
import { FLIGHTS_NUMBER } from '../constants/flight';
import type { FlightType } from '../constants/flight';

export async function handleFlightInfo(
  event: LineEvent,
  flightType?: FlightType
) {
  try {
    if (!flightType) {
      // Show quick reply buttons for flight types
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: '✈️ กรุณาเลือกเที่ยวบินที่ต้องการทราบข้อมูล',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'message',
                label: '🛫 ขาออก (BKK → NRT)',
                text: 'flight:departure',
              },
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: '🛬 ขาเข้า (NRT → BKK)',
                text: 'flight:arrival',
              },
            },
          ],
        },
      });
      return;
    }

    const flight = FLIGHTS_NUMBER[flightType];
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text:
        `✈️ ข้อมูลเที่ยวบิน ${flightType === 'departure' ? 'ขาออก' : 'ขาเข้า'}\n\n` +
        `🛩️ เที่ยวบิน: ${flight.flightNumber}\n` +
        `🛫 ต้นทาง: ${flight.departure} (${flight.departureTime})\n` +
        `🛬 ปลายทาง: ${flight.arrival} (${flight.arrivalTime})\n` +
        `🏛️ Terminal: ${flight.terminal}`,
    });
  } catch (error) {
    console.error('Flight info error:', error);
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถดึงข้อมูลเที่ยวบินได้ในขณะนี้',
    });
  }
}
