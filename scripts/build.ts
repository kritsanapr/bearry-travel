import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

async function ensureDistDir() {
  if (!existsSync('./dist')) {
    await mkdir('./dist', { recursive: true });
  }
}

ensureDistDir().catch(console.error);
