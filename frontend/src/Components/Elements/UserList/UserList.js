import { useEffect, useState, useRef } from 'react';
import StatsTable from '../StatsTable/StatsTable';

import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';

import Chart from 'chart.js/auto';

const ScoreHistogram = (props) => {
  let data = props.data;

  data = data.slice(0, 7);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const dataA = data.map((item) => item['solved']['easy']);
    const dataB = data.map((item) => item['solved']['medium']);
    const dataC = data.map((item) => item['solved']['hard']);

    chartInstance.current = new Chart(myChartRef, {
      type: 'bar',
      data: {
        labels: data.map((item) => item['name']),
        datasets: [
          {
            label: 'Easy',
            data: dataA,
            backgroundColor: '#a3e78ecc',
            borderColor: '#a3e78e',
            borderWidth: 1,
          },
          {
            label: 'Medium',
            data: dataB,
            backgroundColor: '#f3ea90cc',
            borderColor: '#f3ea90',
            borderWidth: 1,
          },
          {
            label: 'Hard',
            data: dataC,
            backgroundColor: '#f390cacc',
            borderColor: '#f390ca',
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
      <canvas ref={chartRef} width="400" height="100" class="m-4"></canvas>
    </div>
  );
};

const ScoreLine = (props) => {
  let data = [
    [99, 'hansonn', 476902, 64, 96, 15, '2024-03-22 16:57:21.004944'],
    [100, '2003kevinle', 729649, 53, 62, 0, '2024-03-22 16:57:21.925759'],
    [101, 'feliciafengg', 788512, 78, 27, 0, '2024-03-22 16:57:23.253695'],
    [102, 'realchef', 886582, 63, 28, 0, '2024-03-22 16:57:24.269013'],
    [103, 'jakeroggenbuck', 596301, 116, 25, 4, '2024-03-22 16:57:25.187881'],
    [104, 'normando', 932480, 46, 36, 3, '2024-03-22 16:57:26.329168'],
    [105, 'AroopB', 1063080, 31, 40, 0, '2024-03-22 16:57:27.653005'],
    [106, 'ahujaanish11', 899576, 36, 52, 2, '2024-03-22 16:57:28.805813'],
    [107, 'siddharthmmani', 1656043, 30, 6, 0, '2024-03-22 16:57:29.653168'],
    [108, 'andchen1', 2516684, 13, 3, 0, '2024-03-22 16:57:31.132261'],
    [109, 'atata6', 2682092, 12, 1, 1, '2024-03-22 16:57:32.270228'],
    [110, 'vshl', 4633138, 3, 0, 0, '2024-03-22 16:57:33.503022'],
    [111, 'AggieWorker', 4771376, 2, 1, 0, '2024-03-22 16:57:34.620019'],
    [112, 'isabellovecandy', 4362363, 4, 0, 0, '2024-03-22 16:57:35.853369'],
    [113, 'hansonn', 477280, 64, 96, 15, '2024-03-23 20:23:56.630293'],
    [114, '2003kevinle', 730211, 53, 62, 0, '2024-03-23 20:23:57.820031'],
    [115, 'feliciafengg', 789136, 78, 27, 0, '2024-03-23 20:23:58.845488'],
    [116, 'realchef', 887252, 63, 28, 0, '2024-03-23 20:23:59.964549'],
    [117, 'jakeroggenbuck', 568055, 121, 27, 4, '2024-03-23 20:24:00.884786'],
    [118, 'normando', 933239, 47, 36, 3, '2024-03-23 20:24:01.916673'],
    [119, 'AroopB', 1063922, 31, 40, 0, '2024-03-23 20:24:03.142378'],
    [120, 'ahujaanish11', 884848, 36, 53, 2, '2024-03-23 20:24:04.374118'],
    [121, 'siddharthmmani', 1657347, 30, 6, 0, '2024-03-23 20:24:05.601983'],
    [122, 'andchen1', 2518483, 13, 3, 0, '2024-03-23 20:24:06.830287'],
    [123, 'atata6', 2683929, 12, 1, 1, '2024-03-23 20:24:08.264953'],
    [124, 'vshl', 4635919, 3, 0, 0, '2024-03-23 20:24:09.489199'],
    [125, 'AggieWorker', 4774166, 2, 1, 0, '2024-03-23 20:24:10.619891'],
    [126, 'isabellovecandy', 4365031, 4, 0, 0, '2024-03-23 20:24:11.744192'],
    [127, 'hansonn', 477749, 64, 96, 15, '2024-03-24 23:34:00.018866'],
    [128, '2003kevinle', 730896, 53, 62, 0, '2024-03-24 23:34:01.245873'],
    [129, 'feliciafengg', 789871, 78, 27, 0, '2024-03-24 23:34:02.578681'],
    [130, 'realchef', 888024, 63, 28, 0, '2024-03-24 23:34:04.010447'],
    [131, 'jakeroggenbuck', 556065, 122, 28, 4, '2024-03-24 23:34:04.931911'],
    [132, 'normando', 925828, 47, 36, 3, '2024-03-24 23:34:06.050187'],
    [133, 'AroopB', 1064878, 31, 40, 0, '2024-03-24 23:34:07.483025'],
    [134, 'ahujaanish11', 856472, 37, 56, 2, '2024-03-24 23:34:08.519904'],
    [135, 'siddharthmmani', 1658717, 30, 6, 0, '2024-03-24 23:34:09.739333'],
    [136, 'andchen1', 2520392, 13, 3, 0, '2024-03-24 23:34:10.866459'],
    [137, 'atata6', 2685900, 12, 1, 1, '2024-03-24 23:34:11.793400'],
    [138, 'vshl', 4638986, 3, 0, 0, '2024-03-24 23:34:12.871079'],
    [139, 'AggieWorker', 4777289, 2, 1, 0, '2024-03-24 23:34:14.045293'],
    [140, 'isabellovecandy', 4367935, 4, 0, 0, '2024-03-24 23:34:15.454953'],
    [141, 'hansonn', 478169, 64, 96, 15, '2024-03-25 17:59:36.082474'],
    [142, '2003kevinle', 731558, 53, 62, 0, '2024-03-25 17:59:38.012868'],
    [143, 'feliciafengg', 790574, 78, 27, 0, '2024-03-25 17:59:39.457344'],
    [144, 'realchef', 888824, 63, 28, 0, '2024-03-25 17:59:40.687086'],
    [145, 'jakeroggenbuck', 548549, 129, 31, 5, '2024-03-25 17:59:41.701614'],
    [146, 'normando', 926615, 47, 36, 3, '2024-03-25 17:59:43.141382'],
    [147, 'AroopB', 1065791, 31, 40, 0, '2024-03-25 17:59:44.270774'],
    [148, 'ahujaanish11', 857228, 39, 59, 3, '2024-03-25 17:59:45.364113'],
    [149, 'siddharthmmani', 1660113, 30, 6, 0, '2024-03-25 17:59:46.318733'],
    [150, 'andchen1', 2522335, 13, 3, 0, '2024-03-25 17:59:47.487753'],
    [151, 'atata6', 2687926, 12, 1, 1, '2024-03-25 17:59:48.619895'],
    [152, 'vshl', 4642072, 3, 0, 0, '2024-03-25 17:59:49.585677'],
    [153, 'AggieWorker', 4780398, 2, 1, 0, '2024-03-25 17:59:50.852530'],
    [154, 'isabellovecandy', 4370892, 4, 0, 0, '2024-03-25 17:59:52.150772'],
    [155, 'hansonn', 478634, 64, 96, 15, '2024-03-26 12:50:05.691897'],
    [156, '2003kevinle', 732263, 53, 62, 0, '2024-03-26 12:50:07.090763'],
    [157, 'feliciafengg', 791305, 78, 27, 0, '2024-03-26 12:50:08.421292'],
    [158, 'realchef', 889699, 63, 28, 0, '2024-03-26 12:50:09.583639'],
    [159, 'jakeroggenbuck', 509666, 129, 31, 5, '2024-03-26 12:50:10.818051'],
    [160, 'normando', 927472, 47, 36, 3, '2024-03-26 12:50:12.481206'],
    [161, 'AroopB', 1066741, 31, 40, 0, '2024-03-26 12:50:13.591815'],
    [162, 'ahujaanish11', 789875, 39, 62, 4, '2024-03-26 12:50:15.077785'],
    [163, 'siddharthmmani', 1661682, 30, 6, 0, '2024-03-26 12:50:16.193188'],
    [164, 'andchen1', 2524387, 13, 3, 0, '2024-03-26 12:50:17.703612'],
    [165, 'atata6', 2690221, 12, 1, 1, '2024-03-26 12:50:18.862067'],
    [166, 'vshl', 4645702, 3, 0, 0, '2024-03-26 12:50:20.098108'],
    [167, 'AggieWorker', 4784088, 2, 1, 0, '2024-03-26 12:50:21.336115'],
    [168, 'isabellovecandy', 4374301, 4, 0, 0, '2024-03-26 12:50:22.348287'],
    [169, 'GeorgegroeG', 550070, 66, 71, 17, '2024-03-26 12:50:23.323414'],
    [170, 'hansonn', 479114, 64, 96, 15, '2024-03-27 10:42:07.482382'],
    [171, '2003kevinle', 732954, 53, 62, 0, '2024-03-27 10:42:08.405934'],
    [172, 'feliciafengg', 792018, 78, 27, 0, '2024-03-27 10:42:09.477529'],
    [173, 'realchef', 890523, 63, 28, 0, '2024-03-27 10:42:10.876807'],
    [174, 'jakeroggenbuck', 490487, 132, 34, 5, '2024-03-27 10:42:12.448101'],
    [175, 'normando', 920332, 47, 37, 3, '2024-03-27 10:42:13.883778'],
    [176, 'AroopB', 1067678, 31, 40, 0, '2024-03-27 10:42:14.896463'],
    [177, 'ahujaanish11', 736326, 39, 72, 4, '2024-03-27 10:42:16.092894'],
    [178, 'siddharthmmani', 1663232, 30, 6, 0, '2024-03-27 10:42:17.292257'],
    [179, 'andchen1', 2526631, 13, 3, 0, '2024-03-27 10:42:18.592340'],
    [180, 'atata6', 2692573, 12, 1, 1, '2024-03-27 10:42:19.667651'],
    [181, 'vshl', 4649738, 3, 0, 0, '2024-03-27 10:42:20.741672'],
    [182, 'AggieWorker', 4788129, 2, 1, 0, '2024-03-27 10:42:21.970612'],
    [183, 'isabellovecandy', 4378062, 4, 0, 0, '2024-03-27 10:42:22.876196'],
    [184, 'GeorgegroeG', 550592, 66, 71, 17, '2024-03-27 10:42:23.836488'],
    [185, 'hansonn', 479578, 64, 96, 15, '2024-03-28 11:25:01.729204'],
    [186, '2003kevinle', 733629, 53, 62, 0, '2024-03-28 11:25:03.147855'],
    [187, 'feliciafengg', 792824, 78, 27, 0, '2024-03-28 11:25:04.683813'],
    [188, 'realchef', 891385, 63, 28, 0, '2024-03-28 11:25:06.021607'],
    [189, 'jakeroggenbuck', 460830, 135, 41, 5, '2024-03-28 11:25:07.155743'],
    [190, 'normando', 921189, 47, 37, 3, '2024-03-28 11:25:08.679118'],
    [191, 'AroopB', 1068589, 31, 40, 0, '2024-03-28 11:25:10.525754'],
    [192, 'ahujaanish11', 714773, 39, 73, 6, '2024-03-28 11:25:12.265550'],
    [193, 'siddharthmmani', 1664755, 30, 6, 0, '2024-03-28 11:25:14.617319'],
    [194, 'andchen1', 2528816, 13, 3, 0, '2024-03-28 11:25:16.256589'],
    [195, 'atata6', 2694924, 12, 1, 1, '2024-03-28 11:25:17.581763'],
    [196, 'vshl', 4653914, 3, 0, 0, '2024-03-28 11:25:18.926184'],
    [197, 'AggieWorker', 4792346, 2, 1, 0, '2024-03-28 11:25:20.063988'],
    [198, 'isabellovecandy', 4381983, 4, 0, 0, '2024-03-28 11:25:21.463727'],
    [199, 'GeorgegroeG', 551110, 66, 71, 17, '2024-03-28 11:25:23.308670'],
    [200, 'hansonn', 480002, 64, 96, 15, '2024-03-29 12:08:59.655988'],
    [201, '2003kevinle', 734292, 53, 62, 0, '2024-03-29 12:09:01.133770'],
    [202, 'feliciafengg', 793527, 78, 27, 0, '2024-03-29 12:09:02.647809'],
    [203, 'realchef', 892200, 63, 28, 0, '2024-03-29 12:09:03.892731'],
    [204, 'jakeroggenbuck', 426185, 143, 46, 5, '2024-03-29 12:09:05.121430'],
    [205, 'normando', 922054, 47, 37, 3, '2024-03-29 12:09:06.454129'],
    [206, 'AroopB', 1069461, 31, 40, 0, '2024-03-29 12:09:07.681932'],
    [207, 'ahujaanish11', 704854, 40, 74, 6, '2024-03-29 12:09:09.032383'],
    [208, 'siddharthmmani', 1666209, 30, 6, 0, '2024-03-29 12:09:09.982397'],
    [209, 'andchen1', 2531019, 13, 3, 0, '2024-03-29 12:09:11.325263'],
    [210, 'atata6', 2697252, 12, 1, 1, '2024-03-29 12:09:12.698490'],
    [211, 'vshl', 4657959, 3, 0, 0, '2024-03-29 12:09:13.996172'],
    [212, 'AggieWorker', 4796415, 2, 1, 0, '2024-03-29 12:09:15.046161'],
    [213, 'isabellovecandy', 4385759, 4, 0, 0, '2024-03-29 12:09:16.746576'],
    [214, 'GeorgegroeG', 551581, 66, 71, 17, '2024-03-29 12:09:17.891069'],
  ];

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
    const myChartRef = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const generateChartDatasets = (transformedData) => {
      const datasets = Object.entries(transformedData).reduce(
        (acc, [name, records]) => {
          // Map the records to the desired data structure, e.g., extracting the rank and date
          const data_easy = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(' ')[0], // Assuming you want to plot the date on the x-axis
            y: easy, // and the rank on the y-axis
          }));

          const data_med = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(' ')[0], // Use the date as the x-axis value
            y: med, // Using the med value for the y-axis
          }));

          const data_hard = records.map(([rank, easy, med, hard, date]) => ({
            x: date.split(' ')[0], // Use the date as the x-axis value
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

          // const xValues = data.map((d) => new Date(d).getTime());
          // console.log(xValues)
          // const minX = new Date(Math.min(...xValues))
          //   .toISOString()
          //   .split('T')[0];
          // const maxX = new Date(Math.max(...xValues))
          //   .toISOString()
          //   .split('T')[0];

          // If y values change, include this dataset
          if (!allYValuesSame_easy) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataEasy,
              backgroundColor: '#a3e78ecc',
              borderColor: '#a3e78e',
              borderWidth: 1,
              fill: false,
            });
          }

          if (!allYValuesSame_med) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataMed,
              backgroundColor: '#f3ea90cc',
              borderColor: '#f3ea90',
              borderWidth: 1,
              fill: false,
            });
          }

          if (!allYValuesSame_hard) {
            acc.push({
              label: name, // Use the user's name as the label
              data: adjustedDataHard,
              backgroundColor: '#f390cacc',
              borderColor: '#f390ca',
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
      type: 'line',
      data: {
        labels: data.map((item) => item['name']), // Assuming 'name' is the category for each data point
        datasets: datasets,
      },
      options: {
        padding: {
          left: 0, // Reducing or removing padding on the left
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top', // Adjust legend position as needed
          },
          title: {
            display: true,
            text: 'Problems Solved This Week', // Update title to reflect your data context
          },
        },
        scales: {
          y: {
            beginAtZero: false, // Change this based on your data's needs
            title: {
              display: true,
              text: 'Problems by difficulty', // Y-axis label
            },
          },
          x: {
            // Assuming 'name' is a string, no specific configuration needed here,
            // but you can adjust if your x-axis is date-based or numerical

            title: {
              display: true,
              text: 'Date', // X-axis label
            },

            type: 'time',
            time: {
              unit: 'day',
              parser: 'yyyy-MM-dd', // Specify the format of your dates
              tooltipFormat: 'yyyy-MM-dd', // Format for the tooltip
            },
            min: minDate,
            max: maxDate,

            // type: 'time',
            // time: {
            //   // Luxon format string
            //   tooltipFormat: '',
            // },

            // type: 'time',

            // time: {
            //   unit: 'day',
            // },
            // bounds: 'data', // This ensures the axis is only as wide as the data
            // ticks: {
            //   source: 'data', // This makes sure ticks come only from the data points you have
            // },
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
      <canvas ref={chartRef} width="400" height="100" class="m-4"></canvas>
    </div>
  );
};

const UserList = (props) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/boards/' + props.boardId,
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data.participants);
        setStats(data.stats);
      } catch (error) {
        console.error('Could not fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const colors = ['#a3e78e', '#8ed0e7', '#d28ee7', '#f3ea90', '#f390ca'];

  return (
    <>
      {/* <ScoreHistogram data={users} /> */}

      <ScoreLine data={users} />

      {users.map((user, index) => (
        <div
          key={index}
          className={`bg-[#161B22] rounded-md p-4 ${index > 0 ? 'mt-4' : ''}`}
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
                  solved: {user.solved.easy} easy, {user.solved.medium} medium,{' '}
                  {user.solved.hard} hard, total:{' '}
                  {user.solved.easy + user.solved.medium + user.solved.hard}
                </div>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <span className="font-semibold">
                score:{' '}
                {user.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
