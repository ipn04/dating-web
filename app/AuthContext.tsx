'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { IRootState } from '@/app/config/store';

export const AuthRedirect = () => {
  const accessToken = useSelector((state: IRootState) => state.User.accessToken);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (accessToken && (pathname === '/' || pathname.startsWith('/pages/auth'))) {
      router.replace('/pages/client/dashboard');
    }
    else if (!accessToken && pathname.startsWith('/pages/client')) {
      router.replace('/');
    }
  }, [accessToken, router, pathname]);

  return null;
};
