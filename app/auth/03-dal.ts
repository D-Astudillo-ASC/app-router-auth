// This cannot be called from the client, attempting to do so will trigger a runtime error.

import 'server-only';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { users } from '@/drizzle/schema';
import { verifySession } from '@/app/auth/02-stateless-session';

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  const { userId, sessionGUID } = session;
  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, userId),

      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    const user = data[0];

    return { user, sessionGUID };
  } catch (error) {
    console.error('Failed to fetch user: ', error);
    return null;
  }
});
