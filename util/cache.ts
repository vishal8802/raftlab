import NodeCache from 'node-cache';
const CACHE_TTL = 120; // in seconds
const cache = new NodeCache({ stdTTL: CACHE_TTL });

export const cacheGet = (key: string) => cache.get(key);
export const cacheSet = (key: string, data: Record<string, any>) =>
  cache.set(key, data);
export const cacheFlush = () => cache.flushAll();
