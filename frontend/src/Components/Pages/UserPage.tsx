import React, { useState, useEffect } from "react";
import { User, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import icon_image from "../../images/icon_image.png";
import Feedback from "../../Components/Elements/Feedback.tsx";

const CLIENT_ID = "Ov23liAdJ5YRCEzVsbOD";

const FEATURES = {
  login: true,
  top_text: false,
};

const UserPage = () => {
  const [githubInfo, setGithubInfo] = useState({ login: "" });
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    document.title = "User Page - AlgoBoard";
    getUserInfo();
  }, []);

  async function getUserInfo() {
    setLoading(true);
    const cacheKey = "githubUserInfo";
    const cacheTimeKey = "githubUserInfoTime";
    const cacheTime = localStorage.getItem(cacheTimeKey);
    const now = new Date().getTime();

    // Cache for 10 minutes
    if (cacheTime && now - parseInt(cacheTime) < 600_000) {
      let k = localStorage.getItem(cacheKey);
      if (k != null) {
        const cachedData = JSON.parse(k);
        if (cachedData) {
          setGithubInfo(cachedData);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const response = await fetch("https://api.algoboard.org/user-info", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setGithubInfo(data);
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTimeKey, now.toString());
    } catch (err) {
      setError("Error fetching profile data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function loginWithGitHub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" +
        CLIENT_ID +
        "&scope=user:email",
    );
  }

  function logout() {
    localStorage.removeItem("accessToken");
    window.location.reload();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setLoading(true);

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
      setLoading(false);
    }
  };

  const solvedProblemsData = localStorage.getItem("solvedProblems");

  const problemStats =
    solvedProblemsData !== null && solvedProblemsData["total"] == 1571
      ? JSON.parse(solvedProblemsData)
      : { easy: 0, med: 0, hard: 0 };
  const totalSolved = problemStats.easy + problemStats.med + problemStats.hard;

  if (loading && !githubInfo.login) {
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

        {FEATURES.login ? (
          <div className="flex items-center space-x-4">
            {localStorage.getItem("accessToken") ? (
              <button
                onClick={logout}
                className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition h-10"
              >
                <LogOut className="mr-2" size={20} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={loginWithGitHub}
                className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition h-10"
              >
                <LogIn className="mr-2" size={20} />
                Sign In
              </button>
            )}

            <Link to="/account">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 h-10">
                {"avatar_url" in githubInfo ? (
                  <img
                    src={githubInfo.avatar_url}
                    alt="Profile"
                    height="24"
                    width="24"
                    className="rounded-full"
                  />
                ) : (
                  <User className="text-cyan-400" size={20} />
                )}

                <span className="font-medium text-gray-200">
                  {githubInfo.login ? githubInfo.login : "Guest"}
                </span>
              </div>
            </Link>
          </div>
        ) : (
          <></>
        )}
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

            {/* Stats section */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-700">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-2">GitHub Repos</h3>
                <p className="text-2xl font-bold">{githubInfo.public_repos}</p>
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

            {/* AlgoBoard Stats */}
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold mb-4">
                Problem Solving Stats (Coming Soon!)
              </h2>
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

            {/* Update Username Form */}
            <div className="p-6">
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
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Username"}
                </button>
              </form>
            </div>
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
    </>
  );
};

export default UserPage;
