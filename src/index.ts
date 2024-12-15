import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger';
import { health } from "./routes/health";
import { logger } from "./middleware/logger";
import { appConfig } from "./config/app.config";

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Travel Japan Webhook API',
        version: '1.0.0',
        description: 'API documentation for Travel Japan Webhook'
      }
    }
  }))
  .use(logger)
  .use(health)
  .listen(appConfig.port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
