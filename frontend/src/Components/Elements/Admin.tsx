import React, { useState } from "react";

function Admin() {
  const [username, setUsername] = useState("");
  const [board, setBoard] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
        console.log(data);
      }
    } catch (error) {
      console.log(error);
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

            <h1 className="font-bold text-gray-100">
              Show latest logins (Will console log)
            </h1>
            <div className="flex gap-2">
              <button
                onClick={GetLatestLogins}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >Get Logins</button>
            </div>

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
