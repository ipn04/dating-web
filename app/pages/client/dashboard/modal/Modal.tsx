import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, XCircle, MapPin, Briefcase, GraduationCap } from 'lucide-react';

interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  profile?: string;
}

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onInterested?: (user: User) => void;
  onNotInterested?: (user: User) => void;
}

export default function UserDetailModal({
  user,
  isOpen,
  onClose,
  onInterested,
  onNotInterested,
}: UserDetailModalProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!user) return;

    setExitDirection(direction);

    if (direction === 'right') {
      onInterested?.(user);
    } else {
      onNotInterested?.(user);
    }

    setTimeout(() => {
      onClose();
      setExitDirection(null);
    }, 300);
  };

  const handleClose = () => {
    onClose();
    setExitDirection(null);
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 pointer-events-auto">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          <div className="relative w-full max-w-lg">
            <motion.div
              key={user.id}
              className="w-full cursor-grab active:cursor-grabbing"
              drag="x"
              dragListener={true}
              dragConstraints={{ left: -300, right: 300 }}
              dragElastic={0.5}
              onDragEnd={(event, info) => {
                if (info.offset.x < -100) handleSwipe('left');
                else if (info.offset.x > 100) handleSwipe('right');
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: exitDirection ? 0.8 : 1,
                opacity: exitDirection ? 0 : 1,
                x: exitDirection === 'left' ? -400 : exitDirection === 'right' ? 400 : 0,
                rotate: exitDirection === 'left' ? -30 : exitDirection === 'right' ? 30 : 0,
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative h-96 bg-gradient-to-br from-pink-200 to-purple-200">
                  {user.profile ? (
                    <Image
                      src={user.profile}
                      alt={user.name}
                      fill
                      draggable={false}
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold text-7xl w-full h-full">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {user.name}, {user.age}
                    </h2>
                  </div>

                  {user.bio && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-red-50 transition-colors group"
            >
              <XCircle className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all group"
            >
              <Heart className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="white" />
            </motion.button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}