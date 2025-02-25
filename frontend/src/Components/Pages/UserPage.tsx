import React, { useState } from "react";

export default function UserPage() {
  const [githubInfo, setGithubInfo] = useState({ login: "" });

  document.title = "User Page - AlgoBoard";

  async function getUserInfo() {
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
          return;
        }
      }
    }

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
        console.log(data);
        setGithubInfo(data);

        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, now.toString());
      });
  }

  getUserInfo();

  return (
    <>
      <div className="bg-[#0D1117] text-white min-h-screen p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold">
            <h1>Hey!</h1>

            <p>{githubInfo}</p>
          </div>
        </div>
      </div>
    </>
  );
}
