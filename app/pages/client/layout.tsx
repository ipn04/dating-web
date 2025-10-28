'use client';

import { useEffect } from 'react';
import { useLazyGetUserQuery } from '@/app/reducer/user/UserApi';
import { useLazyGetMatchQuery } from '@/app/reducer/app/AppApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile } from '@/app/reducer/user/UserReducer';
import { IRootState } from '@/app/config/store';
import Sidebar from '@/app/shared/Sidebar/Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const accessToken = useSelector((state: IRootState) => state.User.accessToken);
  const [getUser] = useLazyGetUserQuery();
  const [getMatch] = useLazyGetMatchQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken) {
      getUser()
        .unwrap()
        .then((user) => dispatch(setUserProfile(user)))
        .catch((err) => console.error('Error fetching user:', err));

      getMatch()
        .unwrap()
        .then((matches) => {
          console.log('Fetched matches:', matches);
        })
        .catch((err) => console.error('Error fetching matches:', err));
    }
  }, [accessToken, dispatch, getUser, getMatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 flex min-h-screen p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
