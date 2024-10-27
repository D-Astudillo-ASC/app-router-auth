import Redis, { RedisOptions } from 'ioredis';
import { getRedisConfiguration } from './configuration';
import { isNumeric } from '@/lib/utils';

let redisInstance: Redis | null = null;

export function getRedisInstance(config = getRedisConfiguration()) {
  if (redisInstance) {
    console.log('redis instance exists!!!!');
    return redisInstance;
  }

  try {
    const options: RedisOptions = {
      host: config.host,
      username: config.username,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times: number) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };

    if (config.port) {
      if (isNumeric(config.port)) {
        options.port = Number(config.port);
      } else {
        throw new Error(
          'Redis Port defined in configuration must be a numeric value.',
        );
      }
    }

    if (config.password) {
      options.password = config.password;
    }

    redisInstance = new Redis(options);

    redisInstance.on('error', (error: unknown) => {
      console.warn('[Redis] Error connecting', error);
    });

    return redisInstance;
  } catch (e) {
    const err = e as Error;
    throw new Error(
      `[Redis] Could not create a Redis instance: ${err.message}`,
    );
  }
}
