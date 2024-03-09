import { Link } from 'react-router-dom';

const BoardList = () => {
  // Sample data structure for boards
  const boards = [
    { id: 'my-board', name: 'My Board', participants: 20 },
    { id: 'user-1s-board', name: 'User 1’s Board', participants: 4 },
    { id: 'user-2s-board', name: 'User 2’s Board', participants: 24 },
    {
      id: 'competition-1-board',
      name: 'Competition 1 Board',
      participants: 124,
    },
    { id: 'event-1-board', name: 'Event 1 Board', participants: 256 },
  ];

  return (
    <div className="bg-[#161B22] p-4 rounded-md">
      {boards.map((board, index) => (
        <Link
          to={`/boards/${board.id}`}
          className="text-gray-100 hover:text-gray-400"
        >
          <div
            key={index}
            className={`flex items-center justify-between py-3 ${index < boards.length - 1 ? 'border-b border-[#30363d]' : ''}`}
          >
            <span className="font-medium">{board.name}</span>
            <span className="text-[#8b949e]">
              {board.participants} participants
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BoardList;
