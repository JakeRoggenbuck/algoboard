import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import icon_image from "../../../images/icon_image.png";
import Feedback from "../../../Components/Elements/Feedback/Feedback.js";
import { Cpu, User, LogIn, Zap, LogOut } from "lucide-react";

const CLIENT_ID = "Ov23liAdJ5YRCEzVsbOD";

const FEATURES = { login: true };

export default function Component() {
  const [isStatusOkay, setIsStatusOkay] = useState(false);
  const [solved, setSolved] = useState(-9999);
  const [latency, setLatency] = useState(0);

  const [rerender, setRerender] = useState(false);
  const [githubInfo, setGithubInfo] = useState({ login: "" });

  document.title = "Home - AlgoBoard";
  const tada = " 🎉";

  async function getUserInfo() {
    await fetch("https://api.algoboard.org/user-info", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setGithubInfo(data);
      });
  }

  useEffect(() => {
    const s = window.location.search;
    const url = new URLSearchParams(s);
    const code = url.get("code");

    if (code && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("https://api.algoboard.org/access-token?code=" + code, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    } else {
      getUserInfo();
    }

    // Remove code from url bar
    window.history.pushState({}, "", window.location.pathname);
  }, [rerender]);

  function loginWithGitHub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID,
    );
  }

  function logout() {
    localStorage.removeItem("accessToken");
    window.location.reload();
  }

  useEffect(() => {
    // Function to fetch status
    const fetchStatus = async () => {
      try {
        var starttime = new Date();
        const response = await fetch("https://api.algoboard.org/status");
        const data = await response.json();

        // Check the status and update the state
        if (data === "okay") {
          setIsStatusOkay(true);
        } else {
          setIsStatusOkay(false);
        }

        var endtime = new Date();
        setLatency(endtime - starttime);
      } catch (error) {
        console.error("Failed to fetch status:", error);
        setIsStatusOkay(false);
      }

      const response = await fetch("https://api.algoboard.org/solved");
      const data = await response.json();

      setSolved(data["easy"] + data["med"] + data["hard"]);
    };

    // Call the fetch function
    fetchStatus();
  }, []); // The empty array means this effect runs once on mount

  return (
    <>
      <div className="bg-[#0D1117] min-h-screen flex flex-col justify-between">
        <Feedback />
        <header className="text-white p-5 text-sm flex flex justify-between items-center">
          <div className="flex flex-row items-center">
            <img className="m-2 h-8" src={icon_image} />
            <p class="text-xl">AlgoBoard</p>
          </div>
          {/* <nav> */}
          {/*   <a */}
          {/*     className="text-white hover:text-blue-300 transition-colors duration-300" */}
          {/*     href="#" */}
          {/*   > */}
          {/*     About */}
          {/*   </a> */}
          {/* </nav> */}

          {FEATURES.login ? (
            <div className="flex items-center space-x-4">
              {localStorage.getItem("accessToken") ? (
                <button
                  onClick={logout}
                  className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-cyan-600 hover:to-blue-700 transition h-10"
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

              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 h-10">
                {"avatar_url" in githubInfo ? (
                  <img
                    src={githubInfo.avatar_url}
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
            </div>
          ) : (
            <></>
          )}
        </header>
        <main className="flex flex-col items-center justify-center flex-grow">
          <h1 className="text-white text-8xl font-extrabold mb-8">AlgoBoard</h1>
          {solved != -9999 ? (
            <p className="text-2xl text-gray-400">
              <b>{solved}</b> Problems Solved! {tada}
            </p>
          ) : (
            <p className="m-4"></p>
          )}

          <div className="flex flex-row space-x-2">
            <Link
              to="/boards"
              className="mx-1 text-blue-600 hover:text-blue-800"
            >
              <button className="text-xl mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white font-bold py-3 px-4 rounded-lg w-40 whitespace-nowrap hover:from-cyan-600 hover:to-blue-700">
                View Boards
              </button>
            </Link>

            <Link
              to="/changelog"
              className="mx-1 text-blue-600 hover:text-blue-800"
            >
				<button className="text-xl mt-8 bg-[#0D1117] hover:border-blue-700 border-blue-500 border-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-40 whitespace-nowrap">
                Changelog
              </button>
            </Link>
          </div>
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
          <span>
            <a target="_blank" href="https://forms.gle/o2pdkqeoXEVV7kw78">
              Feedback Form
            </a>
          </span>
          <span>Contact: bug@jr0.org</span>
        </footer>
      </div>
    </>
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
