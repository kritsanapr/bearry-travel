import { Elysia, t } from 'elysia';

export const webhook = new Elysia({ prefix: '/webhook' }).post(
  '/',
  () => ({
    status: 'ok from webhook',
    timestamp: new Date().toISOString(),
  }),
  {
    detail: {
      tags: ['Webhook'],
      description: 'Webhook endpoint',
      responses: {
        200: {
          description: 'Successful webhook response',
          content: {
            'application/json': {
              schema: t.Object({
                status: t.String(),
                timestamp: t.String(),
              }),
            },
          },
        },
      },
    },
  }
);
