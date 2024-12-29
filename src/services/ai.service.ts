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

// Text-only response using Gemini
export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error with Gemini API:', error);
    throw new Error('Failed to get AI response from Gemini');
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
