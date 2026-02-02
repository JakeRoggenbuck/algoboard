import { Link } from "react-router-dom";
import React from "react";
import latency_image from "../../images/api-status-latency.png";
import histagram_image from "../../images/histagram.png";
import banner_logo from "../../images/banner_logo.png";
import icon_image from "../../images/icon_image.png";
import hourly_updates from "../../images/hourly-updates.png";
import new_update_script from "../../images/new_update_script.png";
import Feedback from "../../Components/Elements/Feedback.tsx";
import ChangelogLoginDemo from "../../Components/Elements/ChangelogLoginDemo.tsx";

export default function Changelog() {
  const diamond = " 💎";
  const rocket = " 🚀";
  const raised_hands = " 🙌";
  const tada = " 🎉";
  const star = " ⭐";
  const star2 = " 🌟";
  const lightning = " ⚡";

  document.title = "Changelog - AlgoBoard";

  return (
    <>
      <Feedback />

      <div className="bg-[#0D1117] min-h-screen flex flex-col justify-between">
        <header className="text-white p-5 text-sm flex justify-between items-center">
          <Link to="/">
            <div className="flex flex-row items-center">
              <img alt="AlgoBoard" className="m-2 h-8" src={icon_image} />
              <p className="text-xl">AlgoBoard</p>
            </div>
          </Link>
        </header>

        <div className="flex flex-col text-white items-center min-h-screen my-4">
          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 2-2-2026
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Account page data and stats refresh
            </h3>
            <p className="my-4">
              Account pages now pull fresh data and display improved stats.
            </p>

            <h3 className="my-4 text-white text-2xl">
              - User page improvements behind a feature flag
            </h3>
            <p className="my-4">
              Rolled out user page updates with a feature flag for safe rollout.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 2-1-2026
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Onboarding flow updates
            </h3>
            <p className="my-4">
              The onboarding experience moved and got a smoother flow.
            </p>

            <h3 className="my-4 text-white text-2xl">
              - Join AlgoBoard when signed in
            </h3>
            <p className="my-4">
              Signed-in users can now join AlgoBoard directly.
            </p>

            <h3 className="my-4 text-white text-2xl">- Rename boards</h3>
            <p className="my-4">
              Boards can now be renamed after they are created.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 1-31-2026
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Elixir backend rewrite start
            </h3>
            <p className="my-4">
              Started the Elixir backend rewrite for core services.
            </p>

            <h3 className="my-4 text-white text-2xl">
              - Sessions and boards migrations
            </h3>
            <p className="my-4">
              Added migrations for sessions and boards data.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 1-30-2026
            </h1>

            <h3 className="my-4 text-white text-2xl">- Logging scope update</h3>
            <p className="my-4">
              Logging now focuses on function calls to reduce noise.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 1-10-2026
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Add start and end date support
            </h3>
            <p className="my-4">
              Data can now be requested with a start and end date.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 1-7-2026
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Improved admin login view
            </h3>
            <p className="my-4">
              The admin view now shows logins in a clearer format.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 12-2-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">- New home route</h3>
            <p className="my-4">
              The main site now has a dedicated home route.
            </p>

            <h3 className="my-4 text-white text-2xl">
              - Footer link to jr0.org
            </h3>
            <p className="my-4">Added a footer link to other projects.</p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 11-7-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">- Logs route update</h3>
            <p className="my-4">
              Updated routing to use "logs" instead of the older path.
            </p>

            <h3 className="my-4 text-white text-2xl">- TypeScript fixes</h3>
            <p className="my-4">
              Cleaned up a set of TypeScript errors and small issues.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 10-8-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Kronicler URL updates
            </h3>
            <p className="my-4">Updated Kronicler URL and routing entries.</p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 10-6-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Kronicler logging and CORS
            </h3>
            <p className="my-4">
              Added Kronicler logging with updated CORS settings.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 9-30-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">- New stats view</h3>
            <p className="my-4">
              Added a stats page with more data and line charts.
            </p>

            <h3 className="my-4 text-white text-2xl">
              - Name select and deselect
            </h3>
            <p className="my-4">
              You can now select and deselect names in the UI.
            </p>

            <h3 className="my-4 text-white text-2xl">
              - Style updates to match AlgoBoard
            </h3>
            <p className="my-4">
              Updated layout and styles to better match the main site.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 9-28-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Fix add-user names with dashes
            </h3>
            <p className="my-4">
              Users with dashes in their name can now be added to boards.
            </p>

            <h3 className="my-4 text-white text-2xl">
              - Scoring algorithm text update
            </h3>
            <p className="my-4">
              Clarified the scoring algorithm description in the UI.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 9-20-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Graph and badges fixes
            </h3>
            <p className="my-4">
              Fixed rendering issues in graphs and score badges.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 8-27-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Google OAuth login flow
            </h3>
            <p className="my-4">
              Added Google OAuth login with callback and redirect handling.
            </p>

            <h3 className="my-4 text-white text-2xl">- JWT helpers</h3>
            <p className="my-4">Added JWT helpers to support auth tokens.</p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 4-1-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - Ranking now has a time range
            </h3>
            <p className="my-4">
              Before, the user list rank would be "all time" but now that rank
              is based on the last 2 weeks.
            </p>

            <h3 className="my-4 text-white text-2xl">- Ranking function</h3>
            <p className="my-4">
              The ranking is now based on the function{" "}
              <b>f(x) = easy + (2 * medium) + (3 * hard)</b>
            </p>

            <h3 className="my-4 text-white text-2xl">- Open Graph Preview</h3>
            <p className="my-4">
              I added Open Graph, which is a way to display a short preview on
              other websites.
            </p>

            <h3 className="my-4 text-white text-2xl">- Account Page</h3>
            <p className="my-4">
              I added an{" "}
              <a href="https://algoboard.org/account">account page</a>
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 1-30-2025
            </h1>

            <h3 className="my-4 text-white text-2xl">- Hello SSL!</h3>
            <p className="my-4">I added SSL and properly hosted the site.</p>

            <h3 className="my-4 text-white text-2xl">
              - Login with GitHub OAuth
            </h3>
            <p className="my-4">You can now login with GitHub OAuth.</p>

            <ChangelogLoginDemo />
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 9-09-2024
            </h1>

            <h3 className="my-4 text-white text-2xl">- Change name</h3>
            <p className="my-4">This is now called the AlgoBoard!</p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 9-08-2024
            </h1>

            <h3 className="my-4 text-white text-2xl">- Feedback Banner</h3>
            <p className="my-4">
              I added a banner at the top of the screen that looks like this! I
              am also adding it below in case I change the banner or take the
              banner down at some point in the future. This is the real feedback
              banner and it actually works! You can click the feedback form
              button! Your feedback is really important to me!
            </p>
            <Feedback />

            <h3 className="my-4 text-white text-2xl">
              - Make buttons the same width
            </h3>
            <p className="my-4">
              I also made these two buttons the same width.
            </p>

            <div className="flex flex-row space-x-2">
              <Link
                to="/boards"
                className="mx-1 text-blue-600 hover:text-blue-800"
              >
                <button className="text-xl mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 whitespace-nowrap">
                  View Boards
                </button>
              </Link>

              <Link
                to="/changelog"
                className="mx-1 text-blue-600 hover:text-blue-800"
              >
                <button className="text-xl mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 whitespace-nowrap">
                  Changelog
                </button>
              </Link>
            </div>

            <h3 className="my-4 text-white text-2xl">- Settle on a name</h3>
            <p className="my-4">This website is now called The Board!</p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 9-07-2024
            </h1>

            <h3 className="my-4 text-white text-2xl">- Score badges</h3>
            <p className="my-4">
              I added badges for reaching different scores. These badges get
              displayed next to your username.
              <ul>
                <li>score &lt; 1,000,000 = {lightning}</li>
                <li>score &lt; 500,000 = {star}</li>
                <li>score &lt; 400,000 = {star2}</li>
                <li>score &lt; 300,000 = {raised_hands}</li>
                <li>score &lt; 200,000 = {tada}</li>
                <li>score &lt; 100,000 = {rocket}</li>
                <li>score &lt; 50,000 = {diamond}</li>
              </ul>
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 8-19-2024
            </h1>

            <h3 className="my-4 text-white text-2xl">
              - More Frequent Data Updates
            </h3>
            <p className="my-4">
              I added updates that happen every 3 hours instead of once a day.
            </p>
            <img alt="Hourly Updates" className="m-2" src={hourly_updates} />

            <p className="my-4">
              I also changed the update script to update every three hours. This
              is a simple solution and it works great.
            </p>
            <img alt="Update Script" className="m-2" src={new_update_script} />
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 8-16-2024
            </h1>

            <h3 className="my-4 text-white text-2xl">- New icon</h3>
            <p className="my-4">
              I created a new icon based on a previous logo idea.
              <img alt="New Icon" className="m-2" src={icon_image} />
              <img alt="New Banner" className="m-2" src={banner_logo} />
            </p>

            <h3 className="my-4 text-white text-2xl">- Add page titles</h3>
            <p className="my-4">
              I set page titles programmatically by board and I also added meta
              descriptions and a name in the manifest.json file.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 8-15-2024
            </h1>

            <h3 className="my-4 text-white text-2xl">- Fixed last modified</h3>
            <p className="my-4">
              Before it was displaying the time of the first data point for that
              week by mistake.
            </p>
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 8-12-2024
            </h1>
            <h3 className="my-4 text-white text-2xl">- Added Changelog</h3>
            <p className="my-4">
              I created this page, the "changelog" to show what I update.
            </p>
            <h3 className="my-4 text-white text-2xl">- API Status Latency</h3>
            <p className="my-4">
              I added a tag that displays the API latency on the home page.
            </p>

            <img alt="Latency Indicator" src={latency_image} />

            <h3 className="my-4 text-white text-2xl">- Added a Histogram</h3>
            <p className="my-4">
              I added a Histogram view for the total score. I also added button
              to switch between the views.
            </p>

            <img
              alt="Histogram"
              className="object-contain h-80"
              src={histagram_image}
            />
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
      </div>
    </>
  );
}
