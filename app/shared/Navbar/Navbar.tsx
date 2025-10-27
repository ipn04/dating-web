import Link from 'next/link';

export default function Navbar() {
  const navLinks = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'About',
      path: '/about',
    },
  ];

  return (
    <nav className="fixed w-full p-3 px-5 bg-green-400">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Tugma</h1>
        <div className="bg-gray-600 p-3 rounded-lg flex gap-4">
          <ul className="flex gap-4">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.path} className="text-white mx-2">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Link
            href="/pages/auth/signup"
            className="text-white p-2 px-4 bg-green-300 rounded-lg"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
