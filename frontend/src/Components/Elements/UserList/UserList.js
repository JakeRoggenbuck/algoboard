import { useEffect, useState } from 'react';

const users = [
  {
    name: 'User 1',
    problemsSolved: { easy: 22, medium: 4, hard: 3 },
    score: 30,
  },
  {
    name: 'User 2',
    problemsSolved: { easy: 18, medium: 1, hard: 1 },
    score: 25,
  },
  {
    name: 'User 3',
    problemsSolved: { easy: 6, medium: 2, hard: 0 },
    score: 10,
  },
  { name: 'User 4', problemsSolved: { easy: 3, medium: 1, hard: 0 }, score: 6 },
];

const UserList = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/boards/' + props.boardId);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Could not fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      {users.map((user, index) => (
        <div
          key={index}
          className={`bg-[#161B22] rounded-md p-4 ${index > 0 ? 'mt-4' : ''}`}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {/* You can insert an img tag here or keep it empty */}
              </div>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm">
                  solved: {user.solved.easy} easy, {user.solved.medium} medium,{' '}
                  {user.solved.hard} hard
                </div>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <span className="font-semibold">score: {user.score}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserList;
