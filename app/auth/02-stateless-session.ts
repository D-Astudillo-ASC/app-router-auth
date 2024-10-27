import 'server-only';

import type { SessionPayload } from '@/app/auth/definitions';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { v4 as uuid } from 'uuid';

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

const storeSession = async (sessionGUID: string, session: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/redis/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionGUID: sessionGUID, session: session }),
    });

    if (!response.ok) {
      throw new Error('Failed to save session');
    }

    console.log('Session created with GUID:', sessionGUID);
  } catch (error) {
    const err = error as Error;
    console.log(err);
    console.error(
      `Error occurred while trying to save session in Redis: ${err.message}`,
    );
    throw new Error(
      `Error occurred while trying to save session in Redis: ${err.message}`,
    );
  }
};

const deleteSessionFromRedis = async (sessionGUID: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/redis/session/${sessionGUID}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete session from redis.');
    }

    console.log('Session delete with GUID:', sessionGUID);
  } catch (error) {
    const err = error as Error;
    console.log(err);
    console.error(
      `Error occurred while trying to delete session in Redis: ${err.message}`,
    );
    throw new Error(
      `Error occurred while trying to delete session in Redis: ${err.message}`,
    );
  }
};

const deleteSessionGUIDFromRedis = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/redis/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete session GUID from redis.');
    }

    console.log('Session GUID deleted with userId:', userId);
  } catch (error) {
    const err = error as Error;
    console.log(err);
    console.error(
      `Error occurred while trying to delete session GUID in Redis: ${err.message}`,
    );
    throw new Error(
      `Error occurred while trying to delete session GUID in Redis: ${err.message}`,
    );
  }
};

const storeSessionGUID = async (userId: string, sessionGUID: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/redis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ redisKey: userId, redisValue: sessionGUID }),
    });

    if (!response.ok) {
      throw new Error('Failed to store session GUID in redis.');
    }

    console.log('Session delete with GUID:', sessionGUID);
  } catch (error) {
    const err = error as Error;
    console.log(err);
    console.error(
      `Error occurred while trying to delete session in Redis: ${err.message}`,
    );
    throw new Error(
      `Error occurred while trying to delete session in Redis: ${err.message}`,
    );
  }
};

const getSessionGUIDFromRedis = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/redis/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get session GUID from redis.');
    }

    const { value } = await response.json();
    return value as string;
  } catch (error) {
    const err = error as Error;
    console.log(err);
    console.error(
      `Error occurred while trying to get session in Redis: ${err.message}`,
    );
    throw new Error(
      `Error occurred while trying to get session guid in Redis: ${err.message}`,
    );
  }
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(
  userId: string,
  userName: string,
  accessToken: string,
  email: string,
) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({
    userId,
    expiresAt,
    userName,
    accessToken,
    email,
  });

  const sessionGUID = uuid();

  console.log('session created');
  console.log(session);
  await storeSession(sessionGUID, session);
  await storeSessionGUID(userId, sessionGUID);
  console.log('decrypted session');

  console.log(await decrypt(session));

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function verifySession() {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/login');
  }

  console.log('past redirect to login');
  console.log(session);
  const payload = session as SessionPayload;

  const sessionGUID = await getSessionGUIDFromRedis(payload.userId);

  return {
    isAuth: true,
    userId: Number(payload.userId),
    sessionGUID: sessionGUID,
  };
}

export async function updateSession() {
  let session = cookies().get('session')?.value;
  let payload = (await decrypt(session)) as SessionPayload;

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  payload.expiresAt = expires;
  session = await encrypt(payload);

  const sessionGUID = uuid();

  console.log('session created');
  console.log(session);
  await storeSession(sessionGUID, session);
  await storeSessionGUID(payload.userId, sessionGUID);
  // const redis = getRedisInstance();

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession(sessionGUID: string, userId: string) {
  cookies().delete('session');
  await deleteSessionFromRedis(sessionGUID);
  await deleteSessionGUIDFromRedis(userId);
  redirect('/login');
}
