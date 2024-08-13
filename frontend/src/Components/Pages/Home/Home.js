import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

export default function Component() {
  const [isStatusOkay, setIsStatusOkay] = useState(false);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    // Function to fetch status
    const fetchStatus = async () => {
      try {
        var starttime = new Date();
        const response = await fetch('http://50.116.10.252:8000/status');
        const data = await response.json();

        // Check the status and update the state
        if (data === 'okay') {
          setIsStatusOkay(true);
        } else {
          setIsStatusOkay(false);
        }

        var endtime = new Date();
        setLatency(endtime - starttime);
      } catch (error) {
        console.error('Failed to fetch status:', error);
        setIsStatusOkay(false);
      }
    };

    // Call the fetch function
    fetchStatus();
  }, []); // The empty array means this effect runs once on mount

  return (
    <div className="bg-[#0D1117] min-h-screen flex flex-col justify-between">
      <header className="text-white p-5 text-sm flex justify-between items-center">
        <p class="text-xl">Leaterboard</p>
        {/* <nav> */}
        {/*   <a */}
        {/*     className="text-white hover:text-blue-300 transition-colors duration-300" */}
        {/*     href="#" */}
        {/*   > */}
        {/*     About */}
        {/*   </a> */}
        {/* </nav> */}
      </header>
      <main className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-white text-7xl font-extrabold mb-8">Leaterboard</h1>

        <Link to="/boards" className="text-blue-600 hover:text-blue-800">
          <button className="text-xl mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Boards
          </button>
        </Link>
      </main>
      <footer className="text-white p-5 text-sm flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isStatusOkay ? (
            <CircleIcon className="text-green-500" />
          ) : (
            <CircleIcon className="text-red-500" />
          )}

          <span>API Status</span>
          <p className="text-gray-400"> - {latency}ms</p>
        </div>
        <span>Contact: bug@jr0.org</span>
      </footer>
    </div>
  );
}

function CircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
