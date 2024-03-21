import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const StatsTable = (props) => {
  let summaryStats = props.summaryStats;
  delete summaryStats['id'];

  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full leading-normal">
        <thead className="bg-[#0f141a]">
          <tr>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Metric
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Count
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Mean
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Stand. Dev.
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Min
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Max
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              25%
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              50%
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#0f141a] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              75%
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summaryStats).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200">
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap ">{key}</p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">{value.count}</p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value.mean.toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value.std.toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value.min.toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value.max.toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value['25%'].toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value['50%'].toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value['75%'].toFixed(2)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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
      <ScoreHistogram data={users} />

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
                  {user.solved.hard} hard
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
