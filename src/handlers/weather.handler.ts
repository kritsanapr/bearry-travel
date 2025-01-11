import { LineEvent } from '../types/line-event.interface';
import { FlexMessage } from '../types/line-flex-message.interface';
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

    const flexMessage: FlexMessage = {
      type: 'flex',
      altText: 'Weather Forecast',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Weather Forecast',
              weight: 'bold',
              size: 'xl',
              align: 'center',
              color: '#1DB446',
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              contents: [
                {
                  type: 'text',
                  text: '📍 พยากรณ์อากาศในพื้นที่',
                  size: 'sm',
                  color: '#666666',
                  align: 'center',
                },
                {
                  type: 'text',
                  text: `${userLocation.address || 'Unknown Location'}`,
                  size: 'sm',
                  color: '#666666',
                  align: 'center',
                  wrap: true,
                },
              ],
            },
            {
              type: 'text',
              text: `${forecast.temp}°C`,
              size: '3xl',
              weight: 'bold',
              align: 'center',
              margin: 'lg',
            },
            {
              type: 'text',
              text: forecast.description,
              size: 'md',
              align: 'center',
              color: '#666666',
              wrap: true,
              margin: 'sm',
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: '💨',
                      flex: 1,
                    },
                    {
                      type: 'text',
                      text: `ความเร็วลม: ${forecast.windSpeed} m/s`,
                      flex: 5,
                      color: '#666666',
                    },
                  ],
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: '💧',
                      flex: 1,
                    },
                    {
                      type: 'text',
                      text: `ความชื้น: ${forecast.humidity}%`,
                      flex: 5,
                      color: '#666666',
                    },
                  ],
                },
              ],
            },
            {
              type: 'text',
              text: `อัพเดทล่าสุด: ${new Date().toLocaleString('th-TH')}`,
              size: 'xxs',
              color: '#AAAAAA',
              align: 'center',
              margin: 'lg',
            },
          ],
          paddingAll: '20px',
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
