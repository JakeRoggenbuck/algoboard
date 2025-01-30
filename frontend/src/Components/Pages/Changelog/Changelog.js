import { Link } from "react-router-dom";
import latency_image from "../../../images/api-status-latency.png";
import histagram_image from "../../../images/histagram.png";
import banner_logo from "../../../images/banner_logo.png";
import icon_image from "../../../images/icon_image.png";
import hourly_updates from "../../../images/hourly-updates.png";
import new_update_script from "../../../images/new_update_script.png";
import Feedback from "../../../Components/Elements/Feedback/Feedback.js";

export default function Changelog() {
  const diamond = " 💎";
  const rocket = " 🚀";
  const raised_hands = " 🙌";
  const tada = " 🎉";
  const star = " ⭐";
  const star2 = " 🌟";
  const lightning = " ⚡";
  const exclamation = " ❗";
  const exclamation2 = " ‼️";

  document.title = "Changelog - AlgoBoard";

  return (
    <>
      <Feedback />
      <div className="bg-[#0D1117] min-h-screen flex flex-col justify-between">
        <header className="text-white p-5 text-sm flex justify-between items-center">
          <Link to="/">
            <div className="flex flex-row items-center">
              <img className="m-2 h-8" src={icon_image} />
              <p class="text-xl">AlgoBoard</p>
            </div>
          </Link>
        </header>

        <div className="flex flex-col text-white items-center min-h-screen my-4">
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
            <img className="m-2" src={hourly_updates} />

            <p className="my-4">
              I also changed the update script to update every three hours. This
              is a simple solution and it works great.
            </p>
            <img className="m-2" src={new_update_script} />
          </div>

          <div className="m-4 w-3/5">
            <h1 className="my-4 font-bold text-white text-5xl">
              Changelog for 8-16-2024
            </h1>

            <h3 className="my-4 text-white text-2xl">- New icon</h3>
            <p className="my-4">
              I created a new icon based on a previous logo idea.
              <img className="m-2" src={icon_image} />
              <img className="m-2" src={banner_logo} />
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

            <img src={latency_image} />

            <h3 className="my-4 text-white text-2xl">- Added a Histagram</h3>
            <p className="my-4">
              I added a Histagram view for the total score. I also added button
              to switch between the views.
            </p>

            <img className="object-contain h-80" src={histagram_image} />
          </div>
        </div>
      </div>
    </>
  );
}
