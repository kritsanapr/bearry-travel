import { Elysia, t } from 'elysia';

export const health = new Elysia({ prefix: '/health' })
  .get('/', 
    () => ({
      status: 'ok from health',
      timestamp: new Date().toISOString()
    }),
    {
      detail: {
        tags: ['Health'],
        description: 'Health check endpoint',
        responses: {
          200: {
            description: 'Successful health check response',
            content: {
              'application/json': {
                schema: t.Object({
                  status: t.String(),
                  timestamp: t.String()
                })
              }
            }
          }
        }
      }
    }
  );
