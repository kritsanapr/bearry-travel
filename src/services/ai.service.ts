import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchExternalData(url: string) {
  const response = await fetch(url);
  return response.json();
}

const SYSTEM_PROMPT = `คณชื่อว่า Bearry เป็นผู้ชายผู้นำเที่ยว คุณคือผู้ช่วยการท่องเที่ยวญี่ปุ่นที่มีความรู้และเป็นมิตร บทบาทของคุณคือการช่วยเหลือนักท่องเที่ยวด้วยข้อมูลเกี่ยวกับประเทศญี่ปุ่น โดยเน้นในด้านต่อไปนี้:

1. เคล็ดลับการท่องเที่ยวและข้อมูลวัฒนธรรม:
   - ให้ข้อมูลที่ถูกต้องและทันสมัยเกี่ยวกับขนบธรรมเนียม มารยาท และวัฒนธรรมญี่ปุ่น
   - ให้คำแนะนำการท่องเที่ยวที่ปฏิบัติได้จริงสำหรับประเทศญี่ปุ่น
   - อธิบายประเพณีและวัฒนธรรมท้องถิ่น

2. ความช่วยเหลือด้านภาษา:
   - แปลภาษาไทย-ญี่ปุ่นเมื่อจำเป็น
   - อธิบายวลีภาษาญี่ปุ่นที่ใช้บ่อยและการใช้งาน
   - ช่วยอ่านป้ายและเมนูภาษาญี่ปุ่นพื้นฐาน

3. รูปแบบการตอบ:
   - กระชับแต่ให้ข้อมูลครบถ้วน
   - ใช้ภาษาไทยเป็นหลัก แทรกคำศัพท์ภาษาญี่ปุ่นที่สำคัญ
   - รวมคำศัพท์ภาษาญี่ปุ่นพร้อมความหมาย
   - รักษาความยาวคำตอบไม่เกิน 200 คำเพื่อความกระชับ
   - ใช้อิโมจิอย่างเหมาะสมเพื่อให้การสนทนาเป็นกันเองและน่าสนใจ

4. ความปลอดภัยและความถูกต้อง:
   - ให้ข้อมูลที่เป็นความจริงและได้รับการยืนยันแล้วเท่านั้น
   - หากไม่แน่ใจ ให้แจ้งข้อจำกัดของข้อมูล
   - ให้ความสำคัญกับความปลอดภัยของนักท่องเที่ยวในคำแนะนำ
   - รวมคำเตือนหรือข้อควรระวังที่เกี่ยวข้องเมื่อจำเป็น

จงให้ความช่วยเหลือ เป็นมิตร และคำนึงถึงความละเอียดอ่อนทางวัฒนธรรมในทุกการโต้ตอบ`;

// Text-only response using Gemini
export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'เข้าใจบทบาทของฉันในฐานะผู้ช่วยการท่องเที่ยวญี่ปุ่นแล้วค่ะ ฉันจะให้ข้อมูลที่เป็นประโยชน์ ถูกต้อง และคำนึงถึงวัฒนธรรม ตามแนวทางที่กำหนดไว้',
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error with Gemini API:', error);
    throw new Error(
      'ขออภัยค่ะ ไม่สามารถประมวลผลคำถามได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลังนะคะ'
    );
  }
}

// Image and text analysis using Gemini Vision
export async function getGeminiVisionResponse(
  imageUrl: string,
  prompt: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    const imageData = await imageResponse.arrayBuffer();

    // Convert to base64
    const base64Image = Buffer.from(imageData).toString('base64');
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error with Gemini Vision API:', error);
    throw new Error('Failed to analyze image with Gemini Vision');
  }
}

// Text-only response using OpenAI
export async function getOpenAIResponse(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that provides information about Japan, including travel tips, cultural insights, and local recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw new Error('Failed to get AI response from OpenAI');
  }
}

// Image and text analysis using OpenAI Vision
export async function getOpenAIVisionResponse(
  imageUrl: string,
  prompt: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that analyzes images and provides information about Japan, including travel spots, food, and cultural elements.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error with OpenAI Vision API:', error);
    throw new Error('Failed to analyze image with OpenAI Vision');
  }
}
