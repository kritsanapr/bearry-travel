import { Elysia } from 'elysia';
import { lineClient } from '../config/line.config';
import { createResponse, createErrorResponse } from '../utils/response';
import { LineWebhookBody, LineEvent } from '../types/line-event.interface';

import axios from 'axios';
import { webhookController } from '../controllers/webhookController';

async function loading(userId: string) {
  return axios({
    method: 'post',
    url: 'https://api.line.me/v2/bot/chat/loading/start',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
    },
    data: { chatId: userId, loadingSeconds: 10 },
  });
}

export const webhook = new Elysia().post(
  '/webhook',
  async ({ body }: { body: LineWebhookBody }) => {
    try {
      console.log('Received webhook body:', body.events);

      const events = body.events;
      const userId = body.events[0].source.userId;

      if (!events || !Array.isArray(events)) {
        console.error('Invalid events format:', events);
        return createErrorResponse('Invalid events format', 400);
      }

      await webhookController(events, userId, lineClient, loading);

      return createResponse({ timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Webhook error:', error);
      return createErrorResponse(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  },
  {
    detail: {
      tags: ['Webhook'] as const,
      description: 'LINE Bot Webhook endpoint',
      responses: {
        200: {
          description: 'Successful webhook response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: { type: 'object' },
                },
                required: ['success', 'message', 'data'],
              },
            },
          },
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  code: { type: 'number' },
                },
                required: ['success', 'message', 'code'],
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  code: { type: 'number' },
                },
                required: ['success', 'message', 'code'],
              },
            },
          },
        },
      },
    },
  }
);
