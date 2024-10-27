import { NextRequest, NextResponse } from 'next/server';
import { getRedisInstance } from '@/redis/create-redis-instance';

const redis = getRedisInstance();

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: { sessionGUID: string } },
) => {
  try {
    const { sessionGUID } = params;

    if (!sessionGUID) {
      return NextResponse.json(
        { error: 'Bad Request: Session GUID not found in request parameters.' },
        { status: 400 },
      );
    }

    await redis.del(sessionGUID);

    // Respond with success
    return NextResponse.json(
      { message: 'Session deleted successfully.' },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      'Error occurred while trying to delete session from redis:',
      error,
    );
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
