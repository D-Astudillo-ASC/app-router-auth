import { getRedisInstance } from '@/redis/create-redis-instance';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  _request: NextRequest,
  { params }: { params: { redisKey: string } },
) => {
  const { redisKey } = params;

  // Check if redisKey exists
  if (!redisKey) {
    return NextResponse.json(
      { error: 'redisKey is required' },
      { status: 400 },
    );
  }

  try {
    const redis = getRedisInstance();
    const redisValue = await redis.get(redisKey);
    return NextResponse.json({ value: `${redisValue}` });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({
      error: `Error occurred while attempting to get data from Redis Cache: ${err.message}`,
    });
  }
};

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: { redisKey: string } },
) => {
  const { redisKey } = params;

  // Check if redisKey exists
  if (!redisKey) {
    return NextResponse.json(
      { error: 'redisKey is required' },
      { status: 400 },
    );
  }

  try {
    const redis = getRedisInstance();
    await redis.del(redisKey);
    return NextResponse.json({
      message: `Successfully deleted key ${redisKey} from Redis Cache.`,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({
      error: `Error occurred while attempting to delete key ${redisKey} from Redis Cache: ${err.message}`,
    });
  }
};
