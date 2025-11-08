import React, { useState, useEffect, useRef, useCallback } from "react";
import icon_image from "../../images/icon_image.png";
import { Link } from "react-router-dom";
import * as Chart from "chart.js/auto";

export default function ProblemsChart() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchAndProcessData();
  }, []);

  const fetchAndProcessData = async () => {
    try {
      const response = await fetch(
        "https://api.algoboard.org/entries/everyone",
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      // Process data: each entry is [id, username, rank, easy, medium, hard, timestamp]
      // Group by user and sort by timestamp to calculate deltas
      const userEntries = {};

      data.forEach((entry) => {
        const username = entry[1];
        if (!userEntries[username]) {
          userEntries[username] = [];
        }
        userEntries[username].push({
          timestamp: entry[6],
          easy: entry[3] || 0,
          medium: entry[4] || 0,
          hard: entry[5] || 0,
        });
      });

      // Get all unique usernames
      const users = Object.keys(userEntries).sort();
      setAllUsers(users);
      setSelectedUsers(new Set(users)); // Select all by default

      setLoading(false);

      // Initial chart update will be triggered by useEffect
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleUser = (username) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(username)) {
      newSelected.delete(username);
    } else {
      newSelected.add(username);
    }
    setSelectedUsers(newSelected);
  };

  const toggleAll = () => {
    if (selectedUsers.size === allUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(allUsers));
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const updateChart = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.algoboard.org/entries/everyone",
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      const userEntries = {};

      data.forEach((entry) => {
        const username = entry[1];
        // Only process selected users
        if (!selectedUsers.has(username)) return;

        if (!userEntries[username]) {
          userEntries[username] = [];
        }
        userEntries[username].push({
          timestamp: entry[6],
          easy: entry[3] || 0,
          medium: entry[4] || 0,
          hard: entry[5] || 0,
        });
      });

      // Calculate deltas for each user and aggregate by month
      const monthlyData = {};

      Object.keys(userEntries).forEach((username) => {
        const entries = userEntries[username].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
        );

        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const date = new Date(entry.timestamp);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { easy: 0, medium: 0, hard: 0 };
          }

          if (i === 0) {
            // First entry for this user - count all problems
            monthlyData[monthKey].easy += entry.easy;
            monthlyData[monthKey].medium += entry.medium;
            monthlyData[monthKey].hard += entry.hard;
          } else {
            // Calculate delta from previous entry
            const prev = entries[i - 1];
            monthlyData[monthKey].easy += Math.max(0, entry.easy - prev.easy);
            monthlyData[monthKey].medium += Math.max(
              0,
              entry.medium - prev.medium,
            );
            monthlyData[monthKey].hard += Math.max(0, entry.hard - prev.hard);
          }
        }
      });

      // Find the earliest and latest dates in the data
      let earliestDate = null;
      let latestDate = null;

      Object.values(userEntries).forEach((entries) => {
        entries.forEach((entry) => {
          const date = new Date(entry.timestamp);
          if (!earliestDate || date < earliestDate) earliestDate = date;
          if (!latestDate || date > latestDate) latestDate = date;
        });
      });

      // Generate all months from earliest to latest (or to current date)
      const now = new Date();
      const endDate = latestDate > now ? latestDate : now;
      const allMonths = [];

      // Add 1 to the month since the first month just has "before data",
      // e.g. if someone did 100 problems in the year previous, it would
      // count for march, which isn't correct.
      let currentDate = new Date(
        earliestDate.getFullYear(),
        earliestDate.getMonth() + 1,
        1,
      );
      const lastDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

      while (currentDate <= lastDate) {
        const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
        allMonths.push(monthKey);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // Prepare data for chart
      const labels = allMonths.map((month) => {
        const [year, m] = month.split("-");
        const date = new Date(year, m - 1);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      });

      const easyData = allMonths.map((month) => monthlyData[month]?.easy || 0);
      const mediumData = allMonths.map(
        (month) => monthlyData[month]?.medium || 0,
      );
      const hardData = allMonths.map((month) => monthlyData[month]?.hard || 0);

      // Calculate totals
      const totalEasy = easyData.reduce((a, b) => a + b, 0);
      const totalMedium = mediumData.reduce((a, b) => a + b, 0);
      const totalHard = hardData.reduce((a, b) => a + b, 0);

      setStats({
        totalEasy,
        totalMedium,
        totalHard,
        grandTotal: totalEasy + totalMedium + totalHard,
      });

      setLoading(false);

      // Create chart
      if (chartRef.current) {
        // Destroy previous chart instance if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart.Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Easy",
                data: easyData,
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderColor: "rgb(34, 197, 94)",
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "rgb(34, 197, 94)",
                pointBorderColor: "rgb(34, 197, 94)",
              },
              {
                label: "Medium",
                data: mediumData,
                backgroundColor: "rgba(234, 179, 8, 0.1)",
                borderColor: "rgb(234, 179, 8)",
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "rgb(234, 179, 8)",
                pointBorderColor: "rgb(234, 179, 8)",
              },
              {
                label: "Hard",
                data: hardData,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgb(239, 68, 68)",
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "rgb(239, 68, 68)",
                pointBorderColor: "rgb(239, 68, 68)",
              },
            ],
          },
          options: {
            animation: {
              duration: 0,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  color: "rgba(255, 255, 255, 0.05)",
                  drawBorder: false,
                },
                ticks: {
                  color: "#9ca3af",
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(255, 255, 255, 0.05)",
                  drawBorder: false,
                },
                ticks: {
                  color: "#9ca3af",
                  callback: function (value) {
                    return value.toLocaleString();
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  color: "#e5e7eb",
                  font: {
                    size: 13,
                  },
                  padding: 15,
                  usePointStyle: true,
                },
              },
              tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                titleColor: "#e5e7eb",
                bodyColor: "#e5e7eb",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: function (context) {
                    return (
                      context.dataset.label +
                      ": " +
                      context.parsed.y.toLocaleString()
                    );
                  },
                },
              },
            },
          },
        });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [selectedUsers]);

  useEffect(() => {
    if (!loading && allUsers.length > 0) {
      updateChart();
    }
  }, [selectedUsers, loading, allUsers.length, updateChart]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100 p-6">
      <header className="text-white z-10 p-5 text-sm flex flex justify-between items-center">
        <Link to="/">
          <div className="flex flex-row items-center">
            <img alt="AlgoBoard Logo" className="m-2 h-8" src={icon_image} />
            <p className="text-xl">AlgoBoard</p>
          </div>
        </Link>
      </header>
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Problems Solved by Type in the last year
          </h1>
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400 text-lg">
            Loading data...
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400 text-base">
            Error loading data: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* User Selection Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sticky top-6">
                <h2 className="text-lg font-semibold mb-4">Select Users</h2>

                {/* Search Box */}
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-3"
                />

                {/* Select All Button */}
                <button
                  onClick={toggleAll}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium mb-3 transition-colors"
                >
                  {selectedUsers.size === allUsers.length
                    ? "Deselect All"
                    : "Select All"}
                </button>

                <div className="text-xs text-gray-400 mb-2">
                  {selectedUsers.size} of {allUsers.length} selected
                </div>

                {/* User List */}
                <div className="max-h-96 overflow-y-auto space-y-1">
                  {filteredUsers.map((user) => (
                    <label
                      key={user}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user)}
                        onChange={() => toggleUser(user)}
                        className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                      />
                      <span className="text-sm">{user}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart and Stats */}
            <div className="lg:col-span-3">
              {/* Chart Container */}
              <div
                className="bg-gray-800 rounded-lg p-6 mb-6"
                style={{ height: "500px" }}
              >
                <canvas ref={chartRef}></canvas>
              </div>

              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-2">Total Easy</div>
                    <div className="text-3xl font-bold text-green-500">
                      {stats.totalEasy.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-2">
                      Total Medium
                    </div>
                    <div className="text-3xl font-bold text-yellow-500">
                      {stats.totalMedium.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-2">Total Hard</div>
                    <div className="text-3xl font-bold text-red-500">
                      {stats.totalHard.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-2">
                      Grand Total
                    </div>
                    <div className="text-3xl font-bold text-blue-400">
                      {stats.grandTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Info */}
              <div className="text-gray-500 text-sm"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
