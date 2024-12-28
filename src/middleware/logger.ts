import { Elysia } from 'elysia';

export const logger = new Elysia().onRequest(({ request }) => {
  console.log(`${request.method} ${request.url}`);
});
