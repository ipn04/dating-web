import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const profiles = [
    { name: 'Sophia', age: 24, tag: 'Travel', image: '/a.png' },
    { name: 'James', age: 24, tag: 'Drink', image: '/b.png' },
    { name: 'Ella', age: 24, tag: 'Sports', image: '/c.png' },
  ];

  const heights = [480, 440, 390];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % profiles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [profiles.length]);

  return (
    <div className="mx-auto">
      <div className="h-1/2 grid grid-cols-1 md:grid-cols-2 container items-center h-full mx-auto gap-5 overflow-hidden">
        <div className="flex flex-col px-6 md:px-12 text-center md:text-left">
          <h1 className="mb-5 text-header-text text-4xl lg:text-6xl font-bold leading-tight">
              Here&apos;s to dating with confidence.
          </h1>
          <h2 className="text-xl lg:text-2xl mb-5 primary-light">
            Looking for someone who gets you? Let&apos;s write your love story together.
          </h2>
          <div className="flex justify-center md:justify-start">
            <button className="bg-section-background text-primary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-section-border transition-colors">
              <Link href="/pages/auth/login">
                Create Account
              </Link>
            </button>
          </div>
        </div>

        <div className="relative flex items-center w-full h-full hidden md:flex">
          <AnimatePresence>
            {profiles.map((profile, i) => {
              const index = (i - activeIndex + profiles.length) % profiles.length;

              const offsetX = index * 101;
              const scale = 1 - index * 0.05;
              const height = heights[index] || heights[heights.length - 1];

              return (
                <motion.div
                  key={profile.name}
                  initial={{ opacity: 0, x: 200 }}
                  animate={{
                    opacity: 1,
                    x: offsetX,
                    scale,
                    zIndex: profiles.length - index,
                    height,
                  }}
                  exit={{ opacity: 0, x: -200 }}
                  transition={{
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                  }}
                  className="absolute w-92 rounded-2xl overflow-hidden shadow-xl bg-white"
                  style={{ left: '10%', transform: 'translateY(-50%)' }}
                >
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 text-white text-lg font-semibold drop-shadow-lg">
                    {profile.name}, {profile.age}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}