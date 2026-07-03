import type { APIRoute } from 'astro';
import { generateLlmsTxt } from '../lib/geo/llms';

export const GET: APIRoute = async () => {
  return new Response(await generateLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
