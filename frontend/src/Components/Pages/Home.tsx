import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import icon_image from "../../images/icon_image.png";
import bg_image from "../../images/algoboard_bg.png";
import Feedback from "../../Components/Elements/Feedback.tsx";
import Admin from "../../Components/Elements/Admin.tsx";
import { ChevronDown } from "lucide-react";
import { track } from "@amplitude/analytics-browser";
import LoginControls from "../../Components/Elements/LoginControls.tsx";
import { useUser } from "../../Components/Context/UserContext.tsx";

const FEATURES = {
  login: true,
  top_text: false,
  show_background_image: true,
};

function LoginButton() {
  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/login";
  };

  return (
    <button className="text-white" onClick={handleLogin}>
      Login with Google
    </button>
  );
}

export default function Component() {
  const [isStatusOkay, setIsStatusOkay] = useState(false);
  const [solved, setSolved] = useState(-9999);
  const [latency, setLatency] = useState(0);
  const [leetcodeLinkStatus, setLeetcodeLinkStatus] = useState<
    "unknown" | "linked" | "missing"
  >("unknown");

  const { githubInfo, refreshUserInfo } = useUser();

  document.title = "Home - AlgoBoard";
  const tada = " 🎉";

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
              refreshUserInfo();
            }
          });
      }
      getAccessToken();
    } else {
      refreshUserInfo();
    }

    // Remove code from url bar
    window.history.pushState({}, "", window.location.pathname);
  }, [refreshUserInfo]);

  useEffect(() => {
    const fetchLeetcodeLinkStatus = async () => {
      if (!githubInfo.login) {
        setLeetcodeLinkStatus("unknown");
        return;
      }

      try {
        const url = new URL("https://api.algoboard.org/user-stats");
        url.searchParams.set("github_username", githubInfo.login);

        const response = await fetch(url.toString());
        if (!response.ok) {
          if (response.status === 404) {
            setLeetcodeLinkStatus("missing");
            return;
          }
          throw new Error("Failed to load user stats");
        }

        const data = await response.json();
        setLeetcodeLinkStatus(data.user ? "linked" : "missing");
      } catch (error) {
        console.error("Failed to load user stats:", error);
        setLeetcodeLinkStatus("unknown");
      }
    };

    fetchLeetcodeLinkStatus();
  }, [githubInfo.login]);

  const fetchSolvedProblems = async () => {
    const cacheKey = "solvedProblems";
    const cacheTimeKey = "solvedProblemsTime";

    const cacheTime = localStorage.getItem(cacheTimeKey);
    const now = new Date().getTime();

    if (cacheTime && now - parseInt(cacheTime) < 600_000) {
      let k = localStorage.getItem(cacheKey);
      if (k !== null) {
        const cachedData = JSON.parse(k);
        if (cachedData) {
          setSolved(
            cachedData["easy"] + cachedData["med"] + cachedData["hard"],
          );
          return;
        }
      }
    }

    const response = await fetch("https://api.algoboard.org/solved");
    const data = await response.json();

    setSolved(data["easy"] + data["med"] + data["hard"]);

    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(cacheTimeKey, now.toString());
  };

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

      fetchSolvedProblems();
    };

    // Call the fetch function
    fetchStatus();
  }, []); // The empty array means this effect runs once on mount

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  return (
    <>
      <div className="bg-[#0D1117] min-h-screen flex flex-col justify-between">
        {FEATURES.show_background_image ? (
          <img
            src={bg_image}
            alt="Background"
            id="my_image"
            className="absolute top-1/2 left-1/2 object-cover z-0 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-fadeInOut"
          />
        ) : (
          <></>
        )}

        <div className="" />

        <Feedback />

        <header className="text-white z-10 p-5 text-sm flex flex justify-between items-center">
          <div className="flex flex-row items-center">
            <img alt="AlgoBoard Logo" className="m-2 h-8" src={icon_image} />
            <p className="text-xl">AlgoBoard</p>
          </div>

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
            <LoginControls
              onLoginClick={() =>
                track("user-logged-clicked", { data: "login-clicked" })
              }
              onLogoutClick={() =>
                track("user-logged-out-clicked", { data: "logout-clicked" })
              }
            />
          ) : (
            <></>
          )}
        </header>

        {leetcodeLinkStatus === "missing" && (
          <div className="relative z-10 mx-auto mt-2 w-full max-w-3xl px-4">
            <div className="rounded-lg bg-red-900 bg-opacity-60 p-4 text-sm text-red-100">
              <div className="font-semibold">Leetcode Account Not Linked!</div>
              <div className="text-red-200">
                Add your Leetcode username on{" "}
                <Link
                  to="/account"
                  className="text-blue-200 underline hover:text-blue-100"
                >
                  /account
                </Link>{" "}
                to join AlgoBoard.
              </div>
            </div>
          </div>
        )}

        <main className="flex z-10 flex-col items-center justify-center min-h-[70vh] px-4 py-8">
          <div className="flex flex-col items-center max-w-3xl w-full space-y-6">
            <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-extrabold text-center">
              AlgoBoard
            </h1>

            {solved !== -9999 ? (
              <p className="text-xl md:text-2xl text-gray-400 text-center">
                <b>{solved}</b> Problems Solved! {tada}
              </p>
            ) : (
              <div className="h-8"></div>
            )}

            <div className="flex flex-row gap-4 justify-center flex-wrap">
              <Link to="/boards" className="text-blue-600 hover:text-blue-800">
                <button className="text-lg md:text-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg min-w-[160px] whitespace-nowrap transition">
                  View Boards
                </button>
              </Link>

              <Link
                to="/changelog"
                className="text-blue-600 hover:text-blue-800"
              >
                <button className="text-lg md:text-xl bg-[#0D1117] hover:border-blue-700 border-blue-500 border-2 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg min-w-[160px] whitespace-nowrap transition">
                  Changelog
                </button>
              </Link>
            </div>

            <div className="w-full max-w-2xl rounded-xl border border-blue-900/60 bg-[#0B1320] p-6 text-left text-white">
              <h2 className="text-2xl font-bold">How to Join AlgoBoard</h2>
              <ol className="mt-4 space-y-3 text-gray-300">
                <li>
                  <span className="font-semibold text-white">1.</span> Log in
                  with GitHub. Click “Sign in” in the top right.
                </li>
                <li>
                  <span className="font-semibold text-white">2.</span> Visit
                  your profile on{" "}
                  <Link
                    to="/account"
                    className="text-blue-300 hover:text-blue-400"
                  >
                    /account
                  </Link>{" "}
                  and add your Leetcode username in the “Join AlgoBoard”
                  section. You'll show up on the{" "}
                  <Link
                    to="/boards/everyone"
                    className="text-blue-300 hover:text-blue-400"
                  >
                    everyone board
                  </Link>
                  , at the bottom, immediately.
                </li>
              </ol>
            </div>

            {/* Show admin panel to Jake because he is admin */}
            {"login" in githubInfo && githubInfo.login === "JakeRoggenbuck" ? (
              <div className="mt-8">
                <Admin />
                <div className="mt-4">
                  <LoginButton />
                </div>
              </div>
            ) : null}
          </div>

          {/* Down arrow indicator */}
          <div className="mt-16 mb-8 flex justify-center">
            <button
              type="button"
              onClick={scrollToBottom}
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="text-white" size={40} />
            </button>
          </div>
        </main>

        {/* About Section */}
        <section className="z-10 px-4 py-16 md:py-32">
          <div className="flex flex-col items-center max-w-3xl w-full mx-auto">
            <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-6">
              About
            </h2>

            <p className="text-white text-lg md:text-xl max-w-2xl my-2">
              🏆 Algo Board is a website to promote friendly competition for
              solving algorithmic coding problems. Algo Board lets you host
              weekly / monthly competitions for your friends, clubs, and other
              organizations.
            </p>

            <p className="text-white text-lg md:text-xl max-w-2xl my-2">
              Algo Board was initially made in January of 2024 for my friends
              and I to run weekly programming competitions.
            </p>

            <p className="text-white text-lg md:text-xl max-w-2xl my-2">
              The source code can be found on the{" "}
              <a
                className="text-blue-300"
                href="https://github.com/JakeRoggenbuck/algoboard"
              >
                AlgoBoard GitHub
              </a>{" "}
              and is under an MIT license.
            </p>
          </div>
        </section>

        <footer className="sticky bottom-0 z-20 bg-[#0D1117] text-white p-5 text-sm flex justify-between items-center border-t border-gray-800">
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
            <a
              target="_blank"
              rel="noreferrer"
              href="https://forms.gle/o2pdkqeoXEVV7kw78"
            >
              Feedback Form
            </a>
          </span>
          <span>
            Contact:{" "}
            <a className="text-blue-300" href="mailto:bug@jr0.org">
              bug@jr0.org
            </a>{" "}
            or text{" "}
            <a className="text-blue-300" href="tel:+15302120126">
              (530) 212-0126
            </a>
          </span>
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
