import UserList from '../../../Components/Elements/UserList/UserList';
import { Link, useParams } from 'react-router-dom';

import Feedback from '../../../Components/Elements/Feedback/Feedback.js';

export default function Board() {
  const params = useParams();

  document.title = params.boardId + ' - The Board';

  return (
    <>
      <Feedback />
      <div className="bg-[#0D1117] text-white min-h-screen p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                  <Link to="/" className="text-gray-100 hover:text-gray-400">
                    Home
                  </Link>
                  <span className="mx-2">/</span>
                </li>

                <li className="flex items-center">
                  <Link
                    to="/boards"
                    className="text-gray-100 hover:text-gray-400"
                  >
                    Boards
                  </Link>
                  <span className="mx-2">/</span>
                </li>

                <li aria-current="page" className="text-gray-500">
                  {params.boardId}
                </li>
              </ol>
            </nav>
          </div>

          <div className="space-x-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Board: {params.boardId}
            </button>
          </div>
        </div>

        <UserList boardId={params.boardId} />
      </div>
    </>
  );
}
