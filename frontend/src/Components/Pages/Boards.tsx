import BoardList from "../../Components/Elements/BoardList.tsx";
import { Link } from "react-router-dom";
import Feedback from "../../Components/Elements/Feedback.tsx";
import React from "react";

function Boards() {
  document.title = "Boards - AlgoBoard";

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

                <li aria-current="page" className="text-gray-500">
                  Boards
                </li>
              </ol>
            </nav>
          </div>

          <div className="space-x-2">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://forms.gle/X7PboDVHygyBvTxcA"
            >
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Invite to My Board
              </button>
            </a>

            <a
              target="_blank"
              rel="noreferrer"
              href="https://forms.gle/X7PboDVHygyBvTxcA"
            >
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Join New Board
              </button>
            </a>
          </div>
        </div>

        <BoardList />
      </div>
    </>
  );
}

export default Boards;
