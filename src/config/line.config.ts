import { Client } from '@line/bot-sdk';

if (!process.env.CHANNEL_ACCESS_TOKEN) {
  throw new Error(
    'LINE_CHANNEL_ACCESS_TOKEN is not set in environment variables'
  );
}

if (!process.env.CHANNEL_SECRET) {
  throw new Error('LINE_CHANNEL_SECRET is not set in environment variables');
}

export const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// Initialize LINE client
export const lineClient = new Client(lineConfig);
