if (!process.env.CHANNEL_ACCESS_TOKEN) {
  throw new Error(
    'CHANNEL_ACCESS_TOKEN is not defined in environment variables'
  );
}

if (!process.env.CHANNEL_SECRET) {
  throw new Error('CHANNEL_SECRET is not defined in environment variables');
}

if (!process.env.EXCHANGE_RATE_API_KEY) {
  throw new Error('EXCHANGE_RATE_API_KEY is not defined in environment variables');
}

export const appConfig = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
  exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY,
} as const;
