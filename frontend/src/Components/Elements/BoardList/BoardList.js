import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const BoardList = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("https://api.algoboard.org/boards/");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error("Could not fetch boards:", error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="bg-[#161B22] p-4 rounded-md">
      {boards.map((board, index) => (
        <Link
          to={`/boards/${board.id}`}
          className="text-gray-100 hover:text-gray-400"
        >
          <div
            key={index}
            className={`flex items-center justify-between py-3 ${index < boards.length - 1 ? "border-b border-[#30363d]" : ""}`}
          >
            <span className="font-medium">{board.name}</span>
            <span className="text-[#8b949e]">
              {board.participants}{" "}
              {board.participants > 1 ? "participants" : "participant"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BoardList;
