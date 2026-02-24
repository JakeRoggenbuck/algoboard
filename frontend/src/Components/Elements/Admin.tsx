import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

type LoginRowValue = string | number | null | undefined;

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const parseTimestampValue = (value: LoginRowValue): Date | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const timestamp =
      value > 1_000_000_000_000
        ? value
        : value > 1_000_000_000
          ? value * 1000
          : NaN;
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  if (
    !trimmedValue ||
    (!trimmedValue.includes("-") &&
      !trimmedValue.includes("T") &&
      !trimmedValue.includes("/") &&
      !trimmedValue.includes(":"))
  ) {
    return null;
  }

  const date = new Date(trimmedValue);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getMonthKeyFromRow = (row: LoginRowValue[]): string | null => {
  const preferredTimestampColumns = [0, 3, 4];
  for (const index of preferredTimestampColumns) {
    const parsed = parseTimestampValue(row[index]);
    if (parsed) {
      return `${parsed.getUTCFullYear()}-${String(parsed.getUTCMonth() + 1).padStart(2, "0")}`;
    }
  }

  for (const value of row) {
    const parsed = parseTimestampValue(value);
    if (parsed) {
      return `${parsed.getUTCFullYear()}-${String(parsed.getUTCMonth() + 1).padStart(2, "0")}`;
    }
  }

  return null;
};

type LoginsMonthlyHistogramProps = {
  data: Array<{ month: string; count: number }>;
};

function LoginsMonthlyHistogram({ data }: LoginsMonthlyHistogramProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const context = chartRef.current.getContext("2d");
    if (!context) {
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(context, {
      type: "bar",
      data: {
        labels: data.map((item) => item.month),
        datasets: [
          {
            label: "Logins",
            data: data.map((item) => item.count),
            backgroundColor: "#60A5FACC",
            borderColor: "#60A5FA",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
            title: {
              display: true,
              text: "Login Count",
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="mt-2 h-72">
      <canvas ref={chartRef} />
    </div>
  );
}

function Admin() {
  const [username, setUsername] = useState("");
  const [board, setBoard] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoginsLoading, setIsLoginsLoading] = useState(false);
  const [loginCounts, setLoginCounts] = useState<
    Array<{ username: string; email: string; count: number }>
  >([]);
  const [loginCountsTotal, setLoginCountsTotal] = useState(0);
  const [monthlyLoginCounts, setMonthlyLoginCounts] = useState<
    Array<{ month: string; count: number }>
  >([]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const showPanel = () => {
    setIsVisible(true);
  };

  const AddUserToBoardSubmit = async () => {
    if (!username.trim()) {
      setMessage("Please enter a username");
      return;
    }

    if (!board.trim()) {
      setMessage("Please enter a board");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://api.algoboard.org/admin/add-user-to-board",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            board: board,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 200) {
        setMessage("User added to board successfully!");
        setUsername("");
        setBoard("");
      } else {
        setMessage(data.message || "Failed to add user to board");
      }
    } catch (error) {
      setMessage("An error occurred while adding the user to board");
    } finally {
      setIsLoading(false);
    }
  };

  const GetLatestLogins = async () => {
    setIsLoginsLoading(true);
    try {
      const response = await fetch(
        "https://api.algoboard.org/admin/get-logins",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (response.status === 200) {
        const counts = new Map<string, number>();
        const emailByKey = new Map<string, string>();
        const monthlyCounts = new Map<string, number>();
        let total = 0;

        if (Array.isArray(data)) {
          data.forEach((row) => {
            if (!Array.isArray(row)) {
              return;
            }

            const monthKey = getMonthKeyFromRow(row as LoginRowValue[]);
            if (monthKey) {
              monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);
            }

            const usernameValue = row[2];
            const emailValue = row[1];

            if (typeof usernameValue !== "string" || !usernameValue.trim()) {
              return;
            }

            const normalizedEmail =
              typeof emailValue === "string" && emailValue.trim()
                ? emailValue
                : "Unknown";
            const key = `${usernameValue}::${normalizedEmail}`;

            total += 1;
            counts.set(key, (counts.get(key) || 0) + 1);
            emailByKey.set(key, normalizedEmail);
          });
        }

        const sortedCounts = Array.from(counts.entries())
          .map(([key, count]) => {
            const separatorIndex = key.indexOf("::");
            const usernameValue =
              separatorIndex >= 0 ? key.slice(0, separatorIndex) : key;

            return {
              username: usernameValue,
              email: emailByKey.get(key) || "Unknown",
              count,
            };
          })
          .sort((a, b) => {
            if (b.count !== a.count) {
              return b.count - a.count;
            }

            const usernameCompare = a.username.localeCompare(b.username);
            if (usernameCompare !== 0) {
              return usernameCompare;
            }

            return a.email.localeCompare(b.email);
          });

        const sortedMonthlyCounts = Array.from(monthlyCounts.entries())
          .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
          .map(([monthKey, count]) => ({
            month: monthFormatter.format(new Date(`${monthKey}-01T00:00:00Z`)),
            count,
          }));

        setLoginCounts(sortedCounts);
        setLoginCountsTotal(total);
        setMonthlyLoginCounts(sortedMonthlyCounts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoginsLoading(false);
    }
  };

  const createUserSubmit = async () => {
    if (!username.trim()) {
      setMessage("Please enter a username");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://api.algoboard.org/admin/create-user",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 200) {
        setMessage("User added successfully!");
        setUsername("");
      } else {
        setMessage(data.message || "Failed to add user");
      }
    } catch (error) {
      setMessage("An error occurred while adding the user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isVisible ? (
        <div className="p-6 max-w mx-auto bg-[#161B22] rounded-lg shadow-md">
          <div className="space-y-4">
            <div className="flex">
              <h2 className="text-xl font-bold text-gray-100">Admin Panel</h2>

              <button
                onClick={handleClose}
                className="py-1 px-2 mx-8 text-gray-100 flex justify-end"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-100">
              By default a newly created user gets added to the "everyone"
              board.
            </p>

            {/* Create User Button */}
            <h1 className="font-bold text-gray-100">Create a User</h1>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={createUserSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Add User"}
              </button>
            </div>

            {/* Add User to Board Button */}
            <h1 className="font-bold text-gray-100">Add a User to a Board</h1>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <input
                type="text"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                placeholder="Enter board"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={AddUserToBoardSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Add User"}
              </button>
            </div>

            <h1 className="font-bold text-gray-100">Show latest logins</h1>
            <div className="flex gap-2">
              <button
                onClick={GetLatestLogins}
                disabled={isLoginsLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoginsLoading ? "Loading..." : "Get Logins"}
              </button>
            </div>

            {loginCounts.length > 0 && (
              <div className="mt-4 space-y-2">
                <h2 className="text-lg font-bold text-gray-100">
                  Logins by Username and Email
                </h2>
                <p className="text-sm text-gray-400">
                  Total logins: {loginCountsTotal} | Unique username/email pairs:{" "}
                  {loginCounts.length}
                </p>
                <div className="border border-gray-700 rounded-md overflow-hidden max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 px-3 py-2 text-gray-400 text-sm border-b border-gray-700">
                    <span>Username</span>
                    <span className="text-left">Email</span>
                    <span className="text-right">Count</span>
                  </div>
                  {loginCounts.map((entry) => (
                    <div
                      key={`${entry.username}-${entry.email}`}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 px-3 py-2 text-gray-100 border-b border-gray-800 last:border-b-0"
                    >
                      <span className="truncate">{entry.username}</span>
                      <span className="truncate text-left">{entry.email}</span>
                      <span className="text-right">{entry.count}</span>
                    </div>
                  ))}
                </div>
                {monthlyLoginCounts.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-md font-bold text-gray-100">
                      Logins Per Month
                    </h3>
                    <LoginsMonthlyHistogram data={monthlyLoginCounts} />
                  </div>
                )}
              </div>
            )}

            {message && (
              <p
                className={`text-sm ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <button onClick={showPanel}>
            <p className="text-gray-400">Show Admin Panel</p>
          </button>
        </>
      )}
    </>
  );
}

export default Admin;
