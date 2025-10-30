import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import MessageModal from '../messageModal/MessageModa';
import { IRootState } from '@/app/config/store';
import { useSelector } from 'react-redux';
import FilterDropdown from '@/app/components/dropdown/Dropdown';
import { useRemoveMatchMutation } from '@/app/reducer/app/AppApi';

interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  profile?: string;
}

interface CardProps {
  match: User[];
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export default function Card({ match }: CardProps) {
  const [ showModalMessages, setShowMessagesModal ] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null);
  const [ removeMatch ] = useRemoveMatchMutation();

  const userId = useSelector((state: IRootState) => state.User.userProfile?.id);

  const handleUnmatch = async (userId: string) => {
    try {
      await removeMatch(userId).unwrap();
    } catch (err) {
      console.error('Failed to remove match', err);
    }
  };

  return (
    <div className="p-4 lg:p-6 rounded-xl shadow-md w-full h-full">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold primary-light">My Matches</h1>
        <div className='flex justify-center items-center gap-3'>
          <button
            onClick={() => setShowMessagesModal(true)}
            className="relative p-2 bg-background text-white rounded-full hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-5 h-5 primary-light" />
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {messages.length}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className='flex flex-col sm:flex-row justify-between lg:items-center mb-6 gap-2'>
        <div className="w-full sm:w-auto">
          <input type="text" placeholder="Search..." className="w-full border primary-light primary-light rounded-lg p-2" />
        </div>
        <div className="w-full sm:w-auto">
          {/* <FilterDropdown /> */}
        </div>
      </div>
      <div className="container w-full">
        <div className="flex flex-wrap gap-6">
          {match.length > 0 ? (
            match.map((match) => (
              <div
                key={match.id}
                className="bg-background rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer w-2xs p-1 flex flex-col"
              >
                <div className="w-full h-76 relative rounded-t-xl overflow-hidden flex-shrink-0">
                  {match.profile ? (
                    <Image
                      src={match.profile}
                      alt="Profile"
                      fill
                      className="object-fit"
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-purple-500 text-white font-bold w-full h-full">
                      {match?.name?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg primary-light mb-1">{match.name}</h3>
                    <h3 className="font-bold text-lg primary-light mb-1">{match.age}</h3>
                  </div>
                  <p className="primary-light text-sm my-3 flex-1">
                    {match.bio}
                  </p>
                  <div className="mt-auto">
                    <button
                      className="w-full bg-section-background text-primary py-2 px-4 rounded-xl hover:shadow-lg transition-all mb-2 cursor-pointer"
                      onClick={() => {
                        setSelectedMatch(match);
                        setShowMessagesModal(true);
                      }}
                    >
                      Send Message
                    </button>
                    <button
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleUnmatch(match.id)}
                    >
                      Remove Match
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-2xl primary-light mx-auto text-center">No matches Available.</p>
          )}
        </div>
      </div>
      <MessageModal
        showMessagesModal={showModalMessages}
        setShowMessagesModal={setShowMessagesModal}
        matches={match}
        currentUserId={userId}
        selectedMatch={selectedMatch}
      />
    </div>
  );
}