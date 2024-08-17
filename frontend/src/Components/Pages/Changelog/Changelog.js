import { Link } from 'react-router-dom';
import latency_image from '../../../images/api-status-latency.png';
import histagram_image from '../../../images/histagram.png';
import banner_logo from '../../../images/banner_logo.png';
import icon_image from '../../../images/icon_image.png';

export default function Changelog() {
  return (
    <div className="bg-[#0D1117] min-h-screen flex flex-col justify-between">
      <header className="text-white p-5 text-sm flex justify-between items-center">
        <Link to="/">
          <div className="flex flex-row items-center">
            <img className="m-2 h-8" src={icon_image} />
            <p class="text-xl">Leaterboard</p>
          </div>
        </Link>
      </header>

      <div className="flex flex-col text-white items-center min-h-screen my-4">
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
            I added a Histagram view for the total score. I also added button to
            switch between the views.
          </p>

          <img className="object-contain h-80" src={histagram_image} />
        </div>
      </div>
    </div>
  );
}
