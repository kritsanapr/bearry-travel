import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { logger } from './middleware/logger';
import { appConfig } from './config/app.config';

// Routes
import { webhook } from './routes/webhook';
import { health } from './routes/health';

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

export type App = typeof app;
