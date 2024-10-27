import { NextRequest, NextResponse } from 'next/server';
import { getRedisInstance } from '@/redis/create-redis-instance';

const redis = getRedisInstance();

export const POST = async (request: NextRequest) => {
  try {
    const { sessionGUID, session } = await request.json();
    if (!sessionGUID || !session) {
      return NextResponse.json(
        { error: 'Bad Request: sessionGUID and session are required.' },
        { status: 400 },
      );
    }

    await redis.set(sessionGUID, session, 'EX', 3600);

    // Respond with success
    return NextResponse.json(
      { message: 'Session stored successfully.' },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      'Error occurred while trying to store session in redis:',
      error,
    );
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
