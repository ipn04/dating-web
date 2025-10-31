import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mount = () => setMounted(true);
    mount();
  }, []);

  const navLinks = [
    { name: 'Home', path: '#hero' },
    { name: 'About', path: '#about' },
    { name: 'How it Works', path: '#steps' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const element = document.querySelector(path);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!mounted) return null;

  return (
    <nav className="container p-3 md:p-6 mx-auto z-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl primary-light font-bold">Tugma</h1>
        <ul className="flex items-center gap-4">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a href={link.path}
                onClick={(e) => handleScroll(e, link.path)}
                className="primary-light mx-1 hidden md:flex cursor-pointer hover:opacity-80 transition-opacity"
              >
                {link.name}
              </a>
            </li>
          ))}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full transition-colors cursor-pointer hover:bg-gray-400"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>

          <div>
            <Link
              href="/pages/auth/login"
              className="text-primary p-2 px-4 bg-section-background rounded-lg font-bold hover:bg-section-border transition-colors"
            >
              Login
            </Link>
          </div>
        </ul>
      </div>
    </nav>
  );
}
