import { useState } from 'react';
import { Home, Heart, MessageCircle, User, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IRootState } from '@/app/config/store';
import Image from 'next/image';
import { useLogoutMutation } from '@/app/reducer/user/UserApi';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResponsiveSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userProfile = useSelector((state: IRootState) => state.User.userProfile);
  const [logoutRequest, { isSuccess }] = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      router.replace('/');
    }
  }, [ isSuccess, router ]);

  const menuItems = [
    { icon: Home, label: 'Home', href: '/pages/client/dashboard' },
    { icon: Heart, label: 'Matches', href: '/pages/client/match', badge: 3 },
    { icon: MessageCircle, label: 'Messages', href: '#', badge: 5 },
    { icon: User, label: 'Profile', href: '#' },
  ];

  return (
    <div>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-800" />
        ) : (
          <Menu className="w-6 h-6 text-gray-800" />
        )}
      </button>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 w-64
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Tugma</h1>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors relative group"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <div className="w-18 h-18 rounded-full overflow-hidden relative">
                {userProfile?.profile ? (
                  <Image
                    src={userProfile.profile}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-purple-500 text-white font-bold w-full h-full">
                    {userProfile?.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userProfile?.name}</p>
                <p className="text-xs text-gray-500 truncate">{userProfile?.email}</p>
                <div className='flex flex-start items-center gap-2 mt-2 cursor-pointer' onClick={() => logoutRequest()}>
                  <LogOut className="w-4 h-4 text-gray-800" />
                  <button
                    // onClick={handleLogout}
                    className="text-xs px-2 py-1 text-black rounded border border-none hover:border-red-700 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}