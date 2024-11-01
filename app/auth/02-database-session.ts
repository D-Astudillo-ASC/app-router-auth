// This cannot be called from the client, attempting to do so will trigger a runtime error.

import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/app/auth/definitions';
import { sessions } from '@/drizzle/schema';
import { db } from '@/drizzle/db';

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

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
    console.error('Failed to decrypt session: ', error);
    return null;
  }
}

export async function createSession(
  id: number,
  userName: string,
  email: string,
  accessToken: string,
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      name: userName,
      email: email,
      accessToken: accessToken,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id });

  const sessionId = data[0].id;

  // 2. Encrypt the session
  const session = await encrypt({
    userId: String(id),
    expiresAt,
    accessToken,
    userName,
    email,
  });

  // 3. Store the session in cookies for optimistic auth checks
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}
