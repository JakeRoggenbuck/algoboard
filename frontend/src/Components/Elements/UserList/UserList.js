import { useEffect, useState, useRef } from "react";
import StatsTable from "../StatsTable/StatsTable";

import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";

import Chart from "chart.js/auto";

const features = {
  show_days_input: false,
};

const ScoreHistogram = (props) => {
  let data = props.data;

  data = data.slice(0, 7);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const dataA = data.map((item) => item["solved"]["easy"]);
    const dataB = data.map((item) => item["solved"]["medium"]);
    const dataC = data.map((item) => item["solved"]["hard"]);

    chartInstance.current = new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: data.map((item) => item["name"]),
        datasets: [
          {
            label: "Easy",
            data: dataA,
            backgroundColor: "#a3e78ecc",
            borderColor: "#a3e78e",
            borderWidth: 1,
          },
          {
            label: "Medium",
            data: dataB,
            backgroundColor: "#f3ea90cc",
            borderColor: "#f3ea90",
            borderWidth: 1,
          },
          {
            label: "Hard",
            data: dataC,
            backgroundColor: "#f390cacc",
            borderColor: "#f390ca",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]); // Make sure to include 'data' in the dependency array if it's dynamic

  return (
    <div>
      <h1 class="text-center">Problems Solved by Type</h1>
      <canvas ref={chartRef} width="400" height="110" class="m-4"></canvas>
    </div>
  );
};

const ScoreLine = (props) => {
  let data = props.data;

  let transformedData = data.reduce(
    (acc, [id, name, rank, easy, med, hard, date]) => {
      // Check if the name already exists in the accumulator
      if (!acc[name]) {
        acc[name] = []; // Initialize an empty array for this name if it doesn't exist
      }

      // Push the relevant attributes into the array associated with the name
      acc[name].push([rank, easy, med, hard, date]);

      return acc;
    },
    {},
  );

  const dates = data.map((item) => new Date(item[6]));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  minDate.setDate(minDate.getDate() - 1);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const generateChartDatasets = (transformedData) => {
      const datasets = Object.entries(transformedData).reduce(
        (acc, [name, records]) => {
          // Map the records to the desired data structure, e.g., extracting the rank and date
          const data_easy = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(".")[0], // Assuming you want to plot the date on the x-axis
            y: easy, // and the rank on the y-axis
          }));

          const data_med = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(".")[0], // Use the date as the x-axis value
            y: med, // Using the med value for the y-axis
          }));

          const data_hard = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(".")[0], // Use the date as the x-axis value
            y: hard, // Using the hard value for the y-axis
          }));

          const easyValues = data_easy.map((item) => item.y);
          const easy_min = Math.min(...easyValues);

          const adjustedDataEasy = data_easy.map((item) => ({
            x: item.x,
            y: item.y - easy_min,
          }));

          const medValues = data_med.map((item) => item.y);
          const med_min = Math.min(...medValues);

          const adjustedDataMed = data_med.map((item) => ({
            x: item.x,
            y: item.y - med_min,
          }));

          // Find the minimum y value for data_hard
          const hardValues = data_hard.map((item) => item.y);
          const hard_min = Math.min(...hardValues);

          // Subtract the minimum hard value from every y value in data_hard
          const adjustedDataHard = data_hard.map((item) => ({
            x: item.x,
            y: item.y - hard_min,
          }));

          // Check if all y values are the same for this user
          const allYValuesSame_easy = adjustedDataEasy.every(
            (val, _, arr) => val.y === arr[0].y,
          );

          const allYValuesSame_med = adjustedDataMed.every(
            (val, _, arr) => val.y === arr[0].y,
          );

          const allYValuesSame_hard = adjustedDataHard.every(
            (val, _, arr) => val.y === arr[0].y,
          );

          // If y values change, include this dataset
          if (!allYValuesSame_easy) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataEasy,
              backgroundColor: "#a3e78ecc",
              borderColor: "#a3e78e",
              borderWidth: 1,
              fill: false,
            });
          }

          if (!allYValuesSame_med) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataMed,
              backgroundColor: "#f3ea90cc",
              borderColor: "#f3ea90",
              borderWidth: 1,
              fill: false,
            });
          }

          if (!allYValuesSame_hard) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataHard,
              backgroundColor: "#f390cacc",
              borderColor: "#f390ca",
              borderWidth: 1,
              fill: false,
            });
          }

          return acc;
        },
        [],
      );

      return datasets;
    };

    let datasets = generateChartDatasets(transformedData);

    chartInstance.current = new Chart(myChartRef, {
      type: "line",
      data: {
        labels: data.map((item) => item["name"]), // Assuming 'name' is the category for each data point
        datasets: datasets,
      },
      options: {
        padding: {
          left: 0, // Reducing or removing padding on the left
        },
        responsive: true,
        plugins: {
          legend: {
            position: "top", // Adjust legend position as needed
          },
          title: {
            display: true,
            text: "Problems Solved This Week", // Update title to reflect your data context
          },
        },
        scales: {
          y: {
            beginAtZero: false, // Change this based on your data's needs
            title: {
              display: true,
              text: "Problems by difficulty", // Y-axis label
            },
            type: "logarithmic",
            min: 1,
          },
          x: {
            title: {
              display: true,
              text: "Date", // X-axis label
            },

            type: "time",
            time: {
              // unit: 'hour', // Change to hour
              // unitStepSize: 3,
              parser: "yyyy-MM-dd HH:mm:ss", // Parse with date and time
              tooltipFormat: "yyyy-MM-dd HH:mm", // Tooltip with date and time
            },
            min: minDate,
            max: maxDate,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]); // Make sure to include 'data' in the dependency array if it's dynamic

  return (
    <div>
      <h1 class="text-center">Problems Solved by Type in the Last Week</h1>
      <canvas ref={chartRef} width="400" height="110" class="m-4"></canvas>
    </div>
  );
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
        const response = await fetch(
          "https://api.algoboard.org/boards/" + props.boardId,
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
        const exclamation = " ❗";
        const exclamation2 = " ‼️";

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
              className="mx-1 my-4 text-md mt-8 bg-blue-800 text-white font-bold py-2 px-4 rounded"
            >
              Show Problems Solved Graph
            </button>
            <button
              onClick={change_to_histagran_view}
              className="mx-1 my-4 text-md mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Show Score Histogram
            </button>

            {features.show_days_input ? (
              <input
                className="w-32 mx-1 my-4 text-md mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded placeholder-white"
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
            className="mx-1 my-4 text-md mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Show Problems Solved Graph
          </button>
          <button
            onClick={change_to_histagran_view}
            className="mx-1 my-4 text-md mt-8 bg-blue-800 text-white font-bold py-2 px-4 rounded"
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
