import { LineEvent } from '../types/line-event.interface';
import { lineClient } from '../config/line.config';
import {
  getGeminiResponse,
  getGeminiVisionResponse,
  getOpenAIResponse,
  getOpenAIVisionResponse,
} from '../services/ai.service';

export async function handleAIQuery(event: LineEvent) {
  try {
    const text = event.message?.text || '';
    let response: string;

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

export async function handleImageAnalysis(event: LineEvent) {
  try {
    if (!event.message || event.message.type !== 'image') {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'กรุณาส่งรูปภาพที่ต้องการวิเคราะห์',
      });
      return;
    }

    const content = await lineClient.getMessageContent(event.message.id);
    const chunks: Uint8Array[] = [];

    for await (const chunk of content) {
      chunks.push(new Uint8Array(chunk));
    }

    const imageBuffer = Buffer.concat(chunks);
    const base64Image = imageBuffer.toString('base64');
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
