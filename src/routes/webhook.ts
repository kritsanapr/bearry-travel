import { Elysia, t } from 'elysia';
import { lineClient } from '../config/line.config';
import {
  createResponse,
  createErrorResponse,
  formatAgenda,
} from '../utils/response';
import { getJPYToTHBRate } from '../services/exchange.service';
import { findNearbyRestaurants } from '../services/places.service';
import {
  getGeminiResponse,
  getGeminiVisionResponse,
  getOpenAIResponse,
  getOpenAIVisionResponse,
} from '../services/ai.service';
import { AGENDA } from '../constants';

// LINE Webhook Interfaces
import {
  LineWebhookBody,
  LineEvent,
  LineMessage,
} from '../types/line-event.interface';
import axios from 'axios';

// Message Handlers
async function handleExchangeRate(event: LineEvent) {
  try {
    const text = event.message?.text || '';
    const match = text.match(/(\d+)\s*(円|¥|JPY|เยน)/i);

    if (!match) {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'กรุณาระบุจำนวนเงินเยนที่ต้องการแปลง เช่น "1000円" หรือ "1000 JPY หรือ "1000 เยน""',
      });
      return;
    }

    const amount = parseInt(match[1]);
    const rate = await getJPYToTHBRate();
    const thbAmount = (amount * rate.rate).toFixed(2);

    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: `${amount} เยน = ${thbAmount} บาท\n(อัตราแลกเปลี่ยน: 1 เยน = ${rate.rate.toFixed(4)} บาท)\nอัพเดทล่าสุด: ${new Date(rate.timestamp).toLocaleString('th-TH')}`,
    });
  } catch (error) {
    console.error('Exchange rate error:', error);
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถดึงข้อมูลอัตราแลกเปลี่ยนได้ในขณะนี้',
    });
  }
}

async function handleRestaurantSearch(event: LineEvent) {
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

async function loading(userId: string) {
  return axios({
    method: 'post',
    url: 'https://api.line.me/v2/bot/chat/loading/start',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
    },
    data: { chatId: userId, loadingSeconds: 10 },
  });
}

async function handleAIQuery(event: LineEvent) {
  try {
    const text = event.message?.text || '';
    let response: string;

    // Check if message contains "openai" to use OpenAI, otherwise use Gemini
    const useOpenAI = text.toLowerCase().includes('openai');
    const cleanPrompt = text.replace(/(openai|gemini)/gi, '').trim();

    if (useOpenAI) {
      response = await getOpenAIResponse(cleanPrompt);
    } else {
      response = await getGeminiResponse(cleanPrompt);
    }

    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: response,
    });
  } catch (error) {
    console.error('AI query error:', error);
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถประมวลผลคำถามได้ในขณะนี้',
    });
  }
}

async function handleImageAnalysis(event: LineEvent) {
  try {
    if (!event.message?.image) {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'กรุณาส่งรูปภาพที่ต้องการวิเคราะห์',
      });
      return;
    }

    // Get image content from Line
    const content = await lineClient.getMessageContent(event.message.id);
    const chunks: Uint8Array[] = [];

    for await (const chunk of content) {
      chunks.push(new Uint8Array(chunk));
    }

    const imageBuffer = Buffer.concat(chunks);
    const base64Image = imageBuffer.toString('base64');

    // Create a temporary URL for the image (you might want to implement proper image storage)
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    const text = event.message?.text || 'What is in this image?';
    const useOpenAI = text.toLowerCase().includes('openai');
    const cleanPrompt = text.replace(/(openai|gemini)/gi, '').trim();

    let response: string;
    if (useOpenAI) {
      response = await getOpenAIVisionResponse(imageUrl, cleanPrompt);
    } else {
      response = await getGeminiVisionResponse(imageUrl, cleanPrompt);
    }

    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: response,
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถวิเคราะห์รูปภาพได้ในขณะนี้',
    });
  }
}

export const webhook = new Elysia().post(
  '/webhook',
  async ({ body }: { body: LineWebhookBody }) => {
    try {
      console.log('Received webhook body:', body.events);

      const events = body.events;
      const userId = body.events[0].source.userId;

      if (!events || !Array.isArray(events)) {
        console.error('Invalid events format:', events);
        return createErrorResponse('Invalid events format', 400);
      }

      for (const event of events) {
        await loading(userId);
        if (event.type === 'message') {
          if (event.message?.type === 'text') {
            const text = event.message?.text?.toLowerCase() ?? '';

            if (text.match(/(円|¥|jpy|เยน)/i)) {
              await handleExchangeRate(event);
            } else if (
              text.includes('ร้านอาหาร') ||
              text.includes('restaurant')
            ) {
              await lineClient.replyMessage(event.replyToken, {
                type: 'text',
                text: 'กรุณาแชร์ตำแหน่งที่ตั้งของคุณเพื่อค้นหาร้านอาหารใกล้เคียง',
              });
            } else if (text.includes('แพลน') || text.includes('plan')) {
              // Handle planning
              const tripAgenda = AGENDA['Tokyo Trip 2025'];
              await lineClient.replyMessage(event.replyToken, {
                type: 'text',
                text: formatAgenda(tripAgenda),
              });
            } else if (
              text.includes('แพลนวันที่') ||
              text.includes('แพลนวัน')
            ) {
              const tripAgenda = AGENDA['Tokyo Trip 2025'];
              await lineClient.replyMessage(event.replyToken, {
                type: 'text',
                text: formatAgenda(tripAgenda),
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

      return createResponse({ timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Webhook error:', error);
      return createErrorResponse(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  },
  {
    detail: {
      tags: ['Webhook'],
      description: 'LINE Bot Webhook endpoint',
      responses: {
        200: {
          description: 'Successful webhook response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: { type: 'object' },
                },
                required: ['success', 'message', 'data'],
              },
            },
          },
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  code: { type: 'number' },
                },
                required: ['success', 'message', 'code'],
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  code: { type: 'number' },
                },
                required: ['success', 'message', 'code'],
              },
            },
          },
        },
      },
    },
  }
);
