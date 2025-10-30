import Image from 'next/image';
import FilterDropdown from '@/app/components/dropdown/Dropdown';

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
  filters: { minAge: number; maxAge: number; distance: number; };
  setFilters: React.Dispatch<React.SetStateAction<{ minAge: number; maxAge: number; distance: number; }>>;
}

export default function Card({ users, handleUserClick, filters, setFilters }: CardProps) {
  return (
    <div className="p-4 lg:p-6 rounded-xl shadow-md w-full h-full">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold primary-light">Profiles</h1>
      </div>
      <div className='flex flex-col sm:flex-row justify-between lg:items-center mb-6 gap-2'>
        <div className="w-full sm:w-auto">
          <input type="text" placeholder="Search..." className="w-full border border-gray-300 primary-light rounded-lg p-2" />
        </div>
        <div className="w-full sm:w-auto">
          <FilterDropdown filters={filters} setFilters={setFilters} />
        </div>
      </div>
      <div className="container w-full">
        <div className="flex flex-wrap gap-6">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="bg-background rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer w-2xs p-1 flex flex-col"
              >
                <div className="w-full h-76 relative rounded-t-xl overflow-hidden">
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
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg primary-light mb-1">{user.name}</h3>
                    <h3 className="font-bold text-lg primary-light mb-1">{user.age}</h3>
                  </div>
                  <p className="primary-light text-sm my-3 flex-1">
                    {user.bio}
                  </p>
                  <button className="w-full bg-section-background text-primary py-2 px-4 rounded-xl hover:shadow-lg transition-all mt-auto">
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-2xl primary-light mx-auto text-center">No profiles Available.</p>
          )}
        </div>
      </div>
    </div>
  );
}