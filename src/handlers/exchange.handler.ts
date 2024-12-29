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
