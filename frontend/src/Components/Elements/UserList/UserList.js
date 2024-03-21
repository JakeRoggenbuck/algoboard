import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const ScoreHistogram = (props) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Reference to store the chart instance

  useEffect(() => {
    const myChartRef = chartRef.current.getContext('2d');

    // If there's an existing chart instance, destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Creating a new chart instance
    chartInstance.current = new Chart(myChartRef, {
      type: 'bar',
      data: {
        labels: [
          '<800k',
          '800k-1.6M',
          '1.6M-2.4M',
          '2.4M-3.2M',
          '3.2M-4M',
          '>4M',
        ],
        datasets: [
          {
            label: '% of Users',
            data: [20, 30, 25, 10, 10, 5],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup function to destroy chart instance when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []); // Make sure to include any dependencies here if your chart data is dynamic

  return (
    <div>
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
      <ScoreHistogram />

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
    </>
  );
};

export default UserList;
