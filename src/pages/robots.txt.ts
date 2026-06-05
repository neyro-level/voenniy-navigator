import type { APIRoute } from 'astro';
import { generateRobotsTxt } from '../lib/geo/robots';

export const GET: APIRoute = () => {
  return new Response(generateRobotsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
