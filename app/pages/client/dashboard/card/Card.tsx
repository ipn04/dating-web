import Image from 'next/image';
interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  profile?: string;
}

interface CardProps {
  users: User[];
  handleUserClick: (user: User) => void;
}

export default function Card({ users, handleUserClick }: CardProps) {
  return (
    <div className="bg-red-50 p-6 rounded-lg shadow-md w-full">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
        <span className="text-gray-600">{users.length} Users</span>
      </div>
      <div className="container w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="w-full h-72 relative">
                {user?.profile ? (
                  <Image
                    src={user.profile}
                    alt="Profile"
                    fill
                    className="object-fit"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-purple-500 text-white font-bold w-full h-full">
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{user.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                    Age {user.age}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}