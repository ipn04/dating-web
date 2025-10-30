'use client';

import { useSelector } from 'react-redux';
import { IRootState } from '@/app/config/store';
import Card from './card/Card';
import { useEffect } from 'react';
import { requestNotificationPermission } from '@/app/utils/notifications';
import { usePageTitle } from '@/app/shared/PageTitle/PageTitle';

export default function MatchPage() {
  usePageTitle('Match');
  const matches = useSelector((state: IRootState) => state.App.matches);
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="w-full bg-fa rounded-xl">
      <Card match={matches} />
    </div>
  );
}