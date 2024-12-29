import { LineEvent } from '../types/line-event.interface';
import { lineClient } from '../config/line.config';
import { getWeatherForecast } from '../services/weather.service';
import { getUserLocation } from '../services/location.service';

export async function handleWeatherForecast(event: LineEvent) {
  try {
    const userLocation = await getUserLocation(event.source.userId);
    if (!userLocation) {
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'กรุณาแชร์ตำแหน่งที่ตั้งของคุณเพื่อดูพยากรณ์อากาศ',
      });
      return;
    }

    const forecast = await getWeatherForecast(
      userLocation.latitude,
      userLocation.longitude
    );

    const flexMessage = {
      type: 'flex' as const,
      altText: 'พยากรณ์อากาศ',
      contents: {
        type: 'bubble' as const,
        body: {
          type: 'box' as const,
          layout: 'vertical' as const,
          contents: [
            {
              type: 'text' as const,
              text: 'พยากรณ์อากาศ',
              weight: 'bold' as const,
              size: 'xl' as const,
            },
            {
              type: 'box' as const,
              layout: 'vertical' as const,
              margin: 'lg' as const,
              spacing: 'sm' as const,
              contents: [
                {
                  type: 'box' as const,
                  layout: 'baseline' as const,
                  spacing: 'sm' as const,
                  contents: [
                    {
                      type: 'text' as const,
                      text: '🌡️',
                      size: 'sm' as const,
                      color: '#AAAAAA',
                      flex: 1,
                    },
                    {
                      type: 'text' as const,
                      text: `อุณหภูมิ: ${forecast.temp}°C`,
                      size: 'sm' as const,
                      color: '#666666',
                      flex: 5,
                    },
                  ],
                },
                {
                  type: 'box' as const,
                  layout: 'baseline' as const,
                  spacing: 'sm' as const,
                  contents: [
                    {
                      type: 'text' as const,
                      text: '💨',
                      size: 'sm' as const,
                      color: '#AAAAAA',
                      flex: 1,
                    },
                    {
                      type: 'text' as const,
                      text: `ความเร็วลม: ${forecast.windSpeed} m/s`,
                      size: 'sm' as const,
                      color: '#666666',
                      flex: 5,
                    },
                  ],
                },
                {
                  type: 'box' as const,
                  layout: 'baseline' as const,
                  spacing: 'sm' as const,
                  contents: [
                    {
                      type: 'text' as const,
                      text: '💧',
                      size: 'sm' as const,
                      color: '#AAAAAA',
                      flex: 1,
                    },
                    {
                      type: 'text' as const,
                      text: `ความชื้น: ${forecast.humidity}%`,
                      size: 'sm' as const,
                      color: '#666666',
                      flex: 5,
                    },
                  ],
                },
                {
                  type: 'box' as const,
                  layout: 'baseline' as const,
                  spacing: 'sm' as const,
                  contents: [
                    {
                      type: 'text' as const,
                      text: '🌤️',
                      size: 'sm' as const,
                      color: '#AAAAAA',
                      flex: 1,
                    },
                    {
                      type: 'text' as const,
                      text: `สภาพอากาศ: ${forecast.description}`,
                      size: 'sm' as const,
                      color: '#666666',
                      flex: 5,
                      wrap: true,
                    },
                  ],
                },
              ],
            },
            {
              type: 'box' as const,
              layout: 'vertical' as const,
              margin: 'lg' as const,
              contents: [
                {
                  type: 'text' as const,
                  text: `อัพเดทล่าสุด: ${new Date().toLocaleString('th-TH')}`,
                  size: 'xxs' as const,
                  color: '#AAAAAA',
                },
              ],
            },
          ],
        },
        styles: {
          body: {
            backgroundColor: '#FFFFFF',
          },
        },
      },
    };

    await lineClient.replyMessage(event.replyToken, flexMessage);
  } catch (error) {
    console.error('Weather forecast error:', error);
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถดึงข้อมูลพยากรณ์อากาศได้ในขณะนี้',
    });
  }
}
