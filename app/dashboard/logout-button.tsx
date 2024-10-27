'use client';

import { logout } from '@/app/auth/01-auth';
import { LogOutIcon } from '@/components/ui/icons';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  userId: string;
  sessionGUID: string;
}

export default function LogoutButton({
  userId,
  sessionGUID,
}: Readonly<LogoutButtonProps>) {
  const router = useRouter();
  const handleLogout = async () => {
    const result = await logout(sessionGUID, userId);
    if (result.success) {
      router.push('/login');
    } else {
      console.error('Error occurred during logout:', result.error);
    }
  };

  return (
    <button
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900"
      onClick={handleLogout}
    >
      <LogOutIcon className="h-4 w-4" />
      Logout
    </button>
  );
}
