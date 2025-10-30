'use client';

import Navbar from '@/app/shared/Navbar/Navbar';
import HeroSection from '@/app/pages/sections/hero/HeroSection';
import Steps from '@/app/pages/sections/steps/Step';
import AboutSection from '@/app/pages/sections/about/AboutSection';
import { usePageTitle } from '@/app/shared/PageTitle/PageTitle';

export default function Home() {
  usePageTitle('Home');

  return (
    <div className="flex font-sans bg-background text-foreground transition-colors duration-300">
      <main className="flex w-full flex-col sm:items-start">
        <Navbar />
        <div className="h-screen w-full flex justify-center">
          <HeroSection />
        </div>
        <div className="h-screen w-full flex justify-center bg-background">
          <AboutSection />
        </div>
        <div className="w-full">
          <Steps />
        </div>
      </main>
    </div>
  );
}
