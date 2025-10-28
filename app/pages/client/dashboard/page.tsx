'use client';
import { useLazyGetUserQuery, useLazyGetAllUserQuery } from '@/app/reducer/user/UserApi';
import { useLikeUserMutation, useDislikeUserMutation } from '@/app/reducer/app/AppApi';
import { useSelector } from 'react-redux';
import { IRootState } from '@/app/config/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '@/app/reducer/user/UserReducer';
import UserDetailModal from './modal/Modal';
import Card from './card/Card';

interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  profile?: string;
}

export default function DashboardPage() {
  const accessToken = useSelector((state: IRootState) => state.User.accessToken);
  const [getUser] = useLazyGetUserQuery();
  const [getAllUser] = useLazyGetAllUserQuery();
  const [likeUser] = useLikeUserMutation();
  const [dislikeUser] = useDislikeUserMutation();

  const dispatch = useDispatch();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    getAllUser()
      .unwrap()
      .then((res) => setUsers(res))
      .catch((err) => console.error(err));

    getUser()
      .unwrap()
      .then((user) => dispatch(setUserProfile(user)))
      .catch((err) => console.error(err));
  }, [accessToken, getUser, getAllUser]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleInterested = async (user: User) => {
    try {
      await likeUser(user.id).unwrap();
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setIsModalOpen(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      console.error('Error liking user:', error);
    }
  };

  const handleNotInterested = async (user: User) => {
    try {
      await dislikeUser(user.id).unwrap();
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setIsModalOpen(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      console.error('Error liking user:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="w-full bg-gray-50">
      <Card
        users={users}
        handleUserClick={handleUserClick}
      />
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onInterested={handleInterested}
        onNotInterested={handleNotInterested}
      />
    </div>
  );
}
