import React, { useEffect, useState } from "react";
import StatsTable from "./StatsTable.tsx";
import ScoreLine from "./ScoreLine.tsx";
import ScoreHistogram from "./ScoreHistogram.tsx";
import "chartjs-adapter-luxon";

const FEATURES = {
  show_days_input: false,
};

const UserList = (props) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [entries, setEntries] = useState([]);
  const [show_line, set_show_line] = useState(true);
  const [update_time, set_update_time] = useState("");
  const [days_to_graph, set_days_to_graph] = useState(15);

  const change_to_line_view = () => {
    set_show_line(true);
  };

  const change_to_histagran_view = () => {
    set_show_line(false);
  };

  var end_date = new Date();
  const DAY = 24 * 60 * 60 * 1000;
  var start_date = new Date(end_date.getTime() - days_to_graph * DAY);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const formattedStartDate = start_date
          ? new Date(start_date).toISOString()
          : undefined;
        const formattedEndDate = end_date
          ? new Date(end_date).toISOString()
          : undefined;

        const queryParams = new URLSearchParams({
          ...(formattedStartDate && { start_date: formattedStartDate }),
          ...(formattedEndDate && { end_date: formattedEndDate }),
        }).toString();

        const url = `https://api.algoboard.org/entries/${props.boardId}?${queryParams}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEntries(data);

        set_update_time(String(data[data.length - 1][6]).slice(0, -10));
      } catch (error) {
        console.error("Could not fetch entries:", error);
      }
    };

    fetchEntries();

    const fetchUsers = async () => {
      try {
        const formattedStartDate = start_date
          ? new Date(start_date).toISOString()
          : undefined;
        const formattedEndDate = end_date
          ? new Date(end_date).toISOString()
          : undefined;

        const queryParams = new URLSearchParams({
          ...(formattedStartDate && { start_date: formattedStartDate }),
          ...(formattedEndDate && { end_date: formattedEndDate }),
        }).toString();

        const response = await fetch(
          "https://api.algoboard.org/boards/" +
            props.boardId +
            "?" +
            queryParams,
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const diamond = " 💎";
        const rocket = " 🚀";
        const raised_hands = " 🙌";
        const tada = " 🎉";
        const star = " ⭐";
        const star2 = " 🌟";
        const lightning = " ⚡";

        for (let i = 0; i < data.participants.length; i++) {
          if (data.participants[i].score < 1000000) {
            data.participants[i].name += lightning;
          }

          if (data.participants[i].score < 500000) {
            data.participants[i].name += star;
          }

          if (data.participants[i].score < 400000) {
            data.participants[i].name += star2;
          }

          if (data.participants[i].score < 300000) {
            data.participants[i].name += raised_hands;
          }

          if (data.participants[i].score < 200000) {
            data.participants[i].name += tada;
          }

          if (data.participants[i].score < 100000) {
            data.participants[i].name += rocket;
          }

          if (data.participants[i].score < 50000) {
            data.participants[i].name += diamond;
          }
        }

        // Chef Mode Easter Egg
        if (window.location.search === "?chef") {
          for (let i = 0; i < data.participants.length; i++) {
            if (data.participants[i].id === 4) {
              let chef = data.participants[i];

              chef.score = 0;
              chef.solved.easy += chef.solved.easy ** 2;
              chef.solved.medium += chef.solved.medium * 3;
              chef.solved.hard += chef.solved.hard * 2;

              data.participants.splice(i, 1);
              data.participants = [chef].concat(data.participants);
            }
          }
        }

        setUsers(data.participants);

        setStats(data.stats);
      } catch (error) {
        console.error("Could not fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const colors = ["#a3e78e", "#8ed0e7", "#d28ee7", "#f3ea90", "#f390ca"];

  return (
    <>
      {show_line ? (
        <>
          <ScoreLine data={entries} />

          <div className="flex flex-row">
            <button
              onClick={change_to_line_view}
              className="mx-1 my-4 text-md mt-8 bg-blue-800 text-white font-bold py-2 px-4 rounded-lg"
            >
              Show Problems Solved Graph
            </button>
            <button
              onClick={change_to_histagran_view}
              className="mx-1 my-4 text-md mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Show Score Histogram
            </button>

            {FEATURES.show_days_input ? (
              <input
                className="w-32 mx-1 my-4 text-md mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg placeholder-white"
                type="number"
                id="days_count"
                name="days_count"
                defaultValue="8"
                onChange={(e) => console.log(e.target.value)}
              />
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <>
          <ScoreHistogram data={users} />

          <button
            onClick={change_to_line_view}
            className="mx-1 my-4 text-md mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Show Problems Solved Graph
          </button>
          <button
            onClick={change_to_histagran_view}
            className="mx-1 my-4 text-md mt-8 bg-blue-800 text-white font-bold py-2 px-4 rounded-lg"
          >
            Show Score Histogram
          </button>
        </>
      )}

      <p className="mx-2 my-4 text-gray-400">Last updated: {update_time}</p>

      {users.map((user, index) => (
        <div
          key={index}
          className={`bg-[#161B22] rounded-md p-4 ${index > 0 ? "mt-4" : ""}`}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-4">
              <div
                style={{
                  backgroundColor:
                    colors[user.name.charAt(0).toLowerCase().charCodeAt(0) % 5],
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center`}
              >
                {/* You can insert an img tag here or keep it empty */}
                <p class="text-2xl font-extrabold text-[#ffffff]">
                  {user.name.charAt(0).toUpperCase()}
                </p>
              </div>
              <div>
                <div className="font-semibold text-md">{user.name}</div>
                <div className="text-md">
                  solved: {user.solved.easy} easy, {user.solved.medium} medium,{" "}
                  {user.solved.hard} hard, total:{" "}
                  {user.solved.easy + user.solved.medium + user.solved.hard}
                </div>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <span className="font-semibold">
                score:{" "}
                {user.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </div>
          </div>
        </div>
      ))}

      <StatsTable summaryStats={stats} />
    </>
  );
};

export default UserList;
