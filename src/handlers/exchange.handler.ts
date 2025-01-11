import { LineEvent } from '../types/line-event.interface';
import { lineClient } from '../config/line.config';
import { getJPYToTHBRate } from '../services/exchange.service';

export async function handleExchangeRate(event: LineEvent) {
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
      type: 'flex',
      altText: `${amount} เยน = ${thbAmount} บาท`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '💹 อัตราแลกเปลี่ยน',
              weight: 'bold',
              size: 'xl',
              align: 'center',
              color: '#27ACB2'
            },
            {
              type: 'box',
              layout: 'horizontal',
              margin: 'lg',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: '¥',
                      size: 'sm',
                      color: '#27ACB2'
                    },
                    {
                      type: 'text',
                      text: `${amount.toLocaleString()}`,
                      size: '3xl',
                      weight: 'bold',
                      color: '#27ACB2'
                    }
                  ]
                },
                {
                  type: 'text',
                  text: '=',
                  size: 'xl',
                  align: 'center',
                  gravity: 'center',
                  color: '#666666'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: '฿',
                      size: 'sm',
                      color: '#1DB446'
                    },
                    {
                      type: 'text',
                      text: `${Number(thbAmount).toLocaleString()}`,
                      size: '3xl',
                      weight: 'bold',
                      color: '#1DB446'
                    }
                  ]
                }
              ]
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'xxl',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: `อัตราแลกเปลี่ยน: 1 เยน = ${rate.rate.toFixed(4)} บาท`,
                  size: 'sm',
                  color: '#666666',
                  align: 'center'
                },
                {
                  type: 'text',
                  text: `อัพเดทล่าสุด: ${new Date(rate.timestamp).toLocaleString('th-TH')}`,
                  size: 'xxs',
                  color: '#AAAAAA',
                  align: 'center'
                }
              ]
            }
          ],
          paddingAll: '20px'
        }
      }
    });
  } catch (error) {
    console.error('Exchange rate error:', error);
    await lineClient.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถดึงข้อมูลอัตราแลกเปลี่ยนได้ในขณะนี้',
    });
  }
}
