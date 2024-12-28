import { Elysia } from 'elysia';
import { middleware as lineMiddleware, Client } from '@line/bot-sdk';

// Middleware and configure
import { swagger } from '@elysiajs/swagger';
import { logger } from './middleware/logger';
import { appConfig } from './config/app.config';

// Handlers
import { webhook } from './routes/webhook';
import { health } from './routes/health';

const client = new Client({
  channelAccessToken: appConfig.channelAccessToken,
});

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Travel Japan Webhook API',
          version: '1.0.0',
          description: 'API documentation for Travel Japan Webhook',
        },
      },
    })
  )
  .use(logger)
  .get('/', () => 'Hello Elysia')
  .use(health)
  .use(webhook)
  .listen(appConfig.port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
