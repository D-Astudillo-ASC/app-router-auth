import { getRedisInstance } from '@/redis/create-redis-instance';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const { redisKey, redisValue } = await request.json();

    if (!redisKey || !redisValue) {
      return NextResponse.json(
        { error: 'redisKey and redisValue are required' },
        { status: 400 },
      );
    }
    const redis = getRedisInstance();
    await redis.set(redisKey, redisValue);
    return NextResponse.json({
      message: `Successfully set value for key ${redisKey} in Redis.`,
    });
  } catch (error) {
    const err = error as Error;
    console.error(
      `Error occurred while trying to connect to redis instance: ${err.message}`,
    );
  }
};
