import { LineEvent, LineWebhookBody } from '../types';
import {
  handleExchangeRate,
  handleRestaurantSearch,
  handleWeatherForecast,
  handleAIQuery,
  handleImageAnalysis,
} from '../handlers';
import { AGENDA } from '../constants';
import { formatAgenda } from '../utils/response';
import { createAgendaFlexMessage } from '../utils/flex-message';
import {
  createQuickReplyDateMessage,
  createQuickReplyMessage,
} from '../utils/quick-reply';

export const webhookController = async (
  events: LineEvent[],
  userId: string,
  lineClient: any,
  loading: (userId: string) => Promise<any>
) => {
  for (const event of events) {
    await loading(userId);
    if (event.type === 'message') {
      if (event.message?.type === 'text') {
        const text = event.message?.text?.toLowerCase() ?? '';

        if (text.match(/(円|¥|jpy|เยน)/i)) {
          await handleExchangeRate(event);
        } else if (
          text.includes('ร้านอาหาร') ||
          text.includes('restaurant') ||
          text.includes('ตำแหน่งปัจจุบัน')
        ) {
          await handleRestaurantSearch(event);
          await lineClient.replyMessage(event.replyToken, {
            type: 'text',
            text: 'กรุณาแชร์ตำแหน่งที่ตั้งของคุณเพื่อค้นหาร้านอาหารใกล้เคียง',
          });
        } else if (text.includes('agenda') || text.includes('แพลนทั้งหมด')) {
          const tripAgenda = AGENDA['Tokyo Trip 2025'];
          await lineClient.replyMessage(event.replyToken, [
            {
              type: 'text',
              text: formatAgenda(tripAgenda),
            },
            createQuickReplyDateMessage(),
          ]);
        } else if (text.includes('แพลนวันที่') || text.includes('แพลนวัน')) {
          const tripAgenda = AGENDA['Tokyo Trip 2025'];

          // Extract date from message (e.g., "แพลนวันที่ 15" or "แพลนวัน 15/01")
          const dateMatch = text.match(/(\d{1,2})(?:\/\d{1,2})?/);

          if (dateMatch) {
            const dayNumber = dateMatch[1];
            const targetDate = `${dayNumber}/01/2025`;

            // Find the specific day's agenda
            const dayAgenda = tripAgenda.find(day =>
              day.date.startsWith(dayNumber.padStart(2, '0'))
            );

            if (dayAgenda) {
              await lineClient.replyMessage(
                event.replyToken,
                createAgendaFlexMessage([dayAgenda]) // Pass as single-day array
              );
            } else {
              await lineClient.replyMessage(event.replyToken, {
                type: 'text',
                text: `ไม่พบแผนการเดินทางสำหรับวันที่ ${targetDate} กรุณาลองใหม่อีกครั้ง`,
              });
            }
          } else {
            await lineClient.replyMessage(event.replyToken, {
              type: 'text',
              text: 'กรุณาระบุวันที่ที่ต้องการดูแผนการเดินทาง เช่น "แพลนวันที่ 15" หรือ "แพลนวัน 15/01"',
            });
          }
        } else if (
          text.includes('weather') ||
          text.includes('forecast') ||
          text.includes('พยากรณ์') ||
          text.includes('อากาศ')
        ) {
          await handleWeatherForecast(event);
        } else if (text.includes('คู่มือ') || text.includes('help')) {
          await lineClient.replyMessage(event.replyToken, {
            type: 'text',
            text:
              `📱 คู่มือการใช้งาน\n\n` +
              `คุณสามารถใช้คําสั่งดังนี้:\n\n` +
              `1️⃣ แปลงค่าเงินเยน\n` +
              `   - พิมพ์จำนวนเงินตามด้วย 円 หรือ JPY\n\n` +
              `2️⃣ ค้นหาร้านอาหารใกล้เคียง\n` +
              `   - แชร์โลเคชั่นของคุณ\n\n` +
              `3️⃣ ถามข้อมูลเกี่ยวกับญี่ปุ่น\n` +
              `   - ถามได้เลย\n\n` +
              `4️⃣ ใช้ Gemini AI\n` +
              `   - พิมพ์ gemini ตามด้วยคำถาม`,
          });
        } else {
          await handleAIQuery(event);
        }
      } else if (event.message?.type === 'image') {
        await handleImageAnalysis(event);
      } else if (event.message?.type === 'location') {
        await handleRestaurantSearch(event);
      } else if (
        event.type === 'message' &&
        event.message?.type === 'sticker'
      ) {
        await lineClient.replyMessage(event.replyToken, {
          type: 'text',
          text: `คุณส่งสติกเกอร์: ${event.message.stickerId}`,
        });
      }
    } else if (event.type === 'follow') {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'สวัสดีค่ะ! ยินดีต้อนรับสู่ Japan Travel Assistant\n\nฉันสามารถช่วยคุณได้ดังนี้:\n1. แปลงค่าเงินเยน (พิมพ์จำนวนเงินตามด้วย 円 หรือ JPY)\n2. ค้นหาร้านอาหารใกล้เคียง (แชร์โลเคชั่นของคุณ)\n3. ถามข้อมูลเกี่ยวกับญี่ปุ่น (ถามได้เลย)\n4. ใช้ Gemini AI (พิมพ์ gemini ตามด้วยคำถาม)',
      });
    } else if (event.type === 'unfollow') {
      console.log('Unfollow event detected');
    } else if (event.type === 'postback') {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: `Postback Data: ${event.postback.data}`,
      });
    } else if (event.type === 'join') {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'สวัสดีทุกคน! ขอบคุณที่เพิ่มบอทเข้ากลุ่ม',
      });
    } else if (event.type === 'leave') {
      console.log('Bot was removed from a group');
    } else {
      console.log(`Unknown event type: ${event.type}`);
    }
  }
};
