import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import icon_image from "../../images/icon_image.png";
import Feedback from "../../Components/Elements/Feedback.tsx";
import LoginControls from "../../Components/Elements/LoginControls.tsx";
import { useUser } from "../../Components/Context/UserContext.tsx";

type UserStats = {
  id: number;
  name: string;
  rank: number;
  easy_solved: number;
  med_solved: number;
  hard_solved: number;
  github_username: string;
};

const FEATURES = {
  login: true,
  top_text: false,
  github_stats: false,
  leetcode_stats: true,
  update_username: false,
};

const UserPage = () => {
  const { githubInfo, isLoading: isUserLoading, setGithubInfo } = useUser();
  const [newUsername, setNewUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsError, setStatsError] = useState("");
  const [joinUsername, setJoinUsername] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");

  useEffect(() => {
    document.title = "User Page - AlgoBoard";
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!githubInfo.login) {
        setUserStats(null);
        setStatsError("");
        return;
      }

      try {
        const url = new URL("https://api.algoboard.org/user-stats");
        url.searchParams.set("github_username", githubInfo.login);

        const response = await fetch(url.toString());
        if (!response.ok) {
          if (response.status === 404) {
            setUserStats(null);
            setStatsError("");
            return;
          }
          throw new Error("Failed to load user stats");
        }

        const data = await response.json();
        setUserStats(data.user ?? null);
        setStatsError("");
      } catch (err) {
        console.error(err);
        setStatsError("Failed to load user stats.");
      }
    };

    fetchUserStats();
  }, [githubInfo.login]);

  const isValidUsername = (username) =>
    Array.from(username).every((c) => /[a-zA-Z0-9-]/.test(c));

  const handleJoin = async (e) => {
    e.preventDefault();
    setJoinError("");
    setJoinSuccess("");

    if (!joinUsername.trim()) {
      setJoinError("Leetcode username cannot be empty.");
      return;
    }

    if (!isValidUsername(joinUsername)) {
      setJoinError("Leetcode username can only include letters, numbers, or -.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setJoinError("Please log in with GitHub first.");
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch("https://api.algoboard.org/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ username: joinUsername }),
      });

      if (!response.ok) {
        throw new Error("Failed to join AlgoBoard");
      }

      const data = await response.json();
      setUserStats(data.user ?? null);
      setJoinSuccess("Welcome to AlgoBoard!");
      setJoinUsername("");
    } catch (err) {
      console.error(err);
      setJoinError("Could not join AlgoBoard. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        "https://api.algoboard.org/update-username",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          body: JSON.stringify({ newUsername }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update username");
      }

      const updatedInfo = { ...githubInfo, login: newUsername };
      setGithubInfo(updatedInfo);
      localStorage.setItem("githubUserInfo", JSON.stringify(updatedInfo));

      setSuccessMessage("Username updated successfully!");
      setNewUsername("");
      setError("");
    } catch (err) {
      setError("Failed to update username. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const problemStats = userStats
    ? {
        easy: userStats.easy_solved,
        med: userStats.med_solved,
        hard: userStats.hard_solved,
      }
    : { easy: 0, med: 0, hard: 0 };
  const totalSolved = problemStats.easy + problemStats.med + problemStats.hard;

  if (isUserLoading && !githubInfo.login) {
    return (
      <div className="bg-[#0D1117] text-white min-h-screen p-8 flex items-center justify-center">
        <div className="animate-pulse">Loading profile data...</div>
      </div>
    );
  }

  return (
    <>
      <Feedback />

      <header className="bg-[#0D1117] text-white z-10 p-5 text-sm flex flex justify-between items-center">
        <Link to="/">
          <div className="flex flex-row items-center">
            <img alt="AlgoBoard" className="m-2 h-8" src={icon_image} />
            <p className="text-xl">AlgoBoard</p>
          </div>
        </Link>

        {FEATURES.top_text ? (
          <nav>
            <a
              className="text-white hover:text-blue-300 transition-colors duration-300"
              href="/"
            >
              About
            </a>
          </nav>
        ) : (
          <></>
        )}

        {FEATURES.login ? <LoginControls /> : <></>}
      </header>
      <div className="bg-[#0D1117] text-white min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row items-center gap-6 border-b border-gray-700">
              <div className="flex-shrink-0">
                <img
                  src={githubInfo.avatar_url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-500"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">
                  {githubInfo.name || githubInfo.login}
                </h1>
                <div className="text-blue-400 mb-2">@{githubInfo.login}</div>
                {githubInfo.bio && (
                  <p className="text-gray-300 mb-4">{githubInfo.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href={githubInfo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition"
                  >
                    GitHub Profile
                  </a>
                  {githubInfo.blog && (
                    <a
                      href={
                        githubInfo.blog.startsWith("http")
                          ? githubInfo.blog
                          : `https://${githubInfo.blog}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {FEATURES.github_stats ? (
              <>
                {/* Stats section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-700">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-2">GitHub Repos</h3>
                    <p className="text-2xl font-bold">
                      {githubInfo.public_repos}
                    </p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-2">Followers</h3>
                    <p className="text-2xl font-bold">{githubInfo.followers}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm mb-2">Following</h3>
                    <p className="text-2xl font-bold">{githubInfo.following}</p>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {FEATURES.leetcode_stats ? (
              <>
                {/* AlgoBoard Stats */}
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold mb-4">
                    AlgoBoard Stats
                  </h2>
                  {statsError && (
                    <div className="mb-4 rounded bg-red-900 bg-opacity-50 p-3 text-red-200">
                      {statsError}
                    </div>
                  )}
                  {userStats && (
                    <div className="mb-4 space-y-2 text-sm text-gray-300">
                      <div className="inline-flex items-center rounded-full bg-green-900 bg-opacity-60 px-3 py-1 text-xs font-semibold text-green-200">
                        Leetcode Linked
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          GitHub Username:
                        </span>{" "}
                        {userStats.github_username}
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          Leetcode Username:
                        </span>{" "}
                        {userStats.name}
                        <span className="text-gray-400">
                          {" "}
                          · rank #{userStats.rank.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-900 bg-opacity-50 p-4 rounded-lg">
                      <h3 className="text-green-400 text-sm mb-2">Easy</h3>
                      <p className="text-2xl font-bold">{problemStats.easy}</p>
                    </div>
                    <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg">
                      <h3 className="text-yellow-400 text-sm mb-2">Medium</h3>
                      <p className="text-2xl font-bold">{problemStats.med}</p>
                    </div>
                    <div className="bg-red-900 bg-opacity-50 p-4 rounded-lg">
                      <h3 className="text-red-400 text-sm mb-2">Hard</h3>
                      <p className="text-2xl font-bold">{problemStats.hard}</p>
                    </div>
                    <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
                      <h3 className="text-blue-400 text-sm mb-2">Total</h3>
                      <p className="text-2xl font-bold">{totalSolved}</p>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <></>
            )}

            {FEATURES.update_username ? (
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold mb-4">
                  Update Leetcode Username (Coming Soon!)
                </h2>
                {error && (
                  <div className="mb-4 p-3 bg-red-900 bg-opacity-50 rounded text-red-200">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-900 bg-opacity-50 rounded text-green-200">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="newUsername"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      New Username
                    </label>
                    <input
                      type="text"
                      id="newUsername"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new username"
                      disabled={isSaving}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving}
                  >
                    {isSaving ? "Updating..." : "Update Username"}
                  </button>
                </form>
              </div>
            ) : (
              <></>
            )}
            {!userStats && (
              <div className="p-6">
                <div className="mb-4 rounded-lg bg-red-900 bg-opacity-60 p-3 text-sm text-red-100">
                  <div className="font-semibold">
                    Leetcode Account Not Linked!
                  </div>
                  <div className="text-red-200">
                    Please add your Leetcode username here to join AlgoBoard.
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4">Join AlgoBoard</h2>
                <p className="mt-1 text-sm text-gray-300">
                  Link your GitHub account to a Leetcode username. If you just
                  joined, you'll show up on the board in the next few hours.
                </p>

                {joinError && (
                  <div className="mt-3 rounded bg-red-900 bg-opacity-50 p-3 text-red-200">
                    {joinError}
                  </div>
                )}
                {joinSuccess && (
                  <div className="mt-3 rounded bg-green-900 bg-opacity-50 p-3 text-green-200">
                    {joinSuccess}
                  </div>
                )}

                <form onSubmit={handleJoin} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="joinUsername"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Leetcode Username
                    </label>
                    <input
                      type="text"
                      id="joinUsername"
                      value={joinUsername}
                      onChange={(e) => setJoinUsername(e.target.value)}
                      className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Leetcode username"
                      disabled={isJoining}
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isJoining}
                  >
                    {isJoining ? "Joining..." : "Join AlgoBoard"}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="mt-4 text-gray-400 text-sm text-center">
            <p>
              Account created:{" "}
              {new Date(githubInfo.created_at).toLocaleDateString()}
            </p>
            <p>
              Last updated:{" "}
              {new Date(githubInfo.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-[#0D1117] text-white p-5 text-sm flex justify-center items-center border-t border-gray-800">
        <span>
          View my other projects at{" "}
          <a
            href="https://jr0.org"
            target="_blank"
            rel="noopener noreferrer author"
            className="text-blue-300 hover:text-blue-400"
          >
            jr0.org
          </a>
        </span>
      </footer>
    </>
  );
};

export default UserPage;
