import Redis from 'ioredis';
import { REDIS_URL } from './conf';

declare global {
  var redis: Redis | undefined;
}

let redis: Redis | undefined;

if (!redis) {
  redis = new Redis(REDIS_URL!, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
}

if (process.env.node_env !== 'prod') global.redis = global.redis || redis;

export default redis;
