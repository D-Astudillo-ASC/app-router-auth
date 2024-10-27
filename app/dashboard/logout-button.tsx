'use client';

import { logout } from '@/app/auth/01-auth';
import { LogOutIcon } from '@/components/ui/icons';

interface LogoutButtonProps {
  userId: string;
  sessionGUID: string;
}

export default function LogoutButton({
  userId,
  sessionGUID,
}: Readonly<LogoutButtonProps>) {
  return (
    <button
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900"
      onClick={async () => {
        console.log('clicked on logout button');
        await logout(sessionGUID, userId);
      }}
    >
      <LogOutIcon className="h-4 w-4" />
      Logout
    </button>
  );
}
