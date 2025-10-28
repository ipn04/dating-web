'use client';

import { useSelector } from 'react-redux';
import { IRootState } from '@/app/config/store';
import Card from './card/Card';

export default function MatchPage() {
  const matches = useSelector((state: IRootState) => state.App.matches);
  console.log(matches);

  return (
    <div className="w-full bg-gray-50">
      <Card users={matches} />
    </div>
  );
}