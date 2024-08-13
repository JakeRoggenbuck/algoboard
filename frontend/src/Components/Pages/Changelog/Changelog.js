import { Link } from 'react-router-dom';

export default function Changelog() {
  return (
    <div className="bg-[#0D1117] min-h-screen flex flex-col justify-between">
      <header className="text-white p-5 text-sm flex justify-between items-center">
        <Link to="/">
          <p class="text-xl">Leaterboard</p>
        </Link>
      </header>

      <div className="flex flex-col text-white items-center min-h-screen my-4">
        <div className="m-4">
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

          <img src="https://private-user-images.githubusercontent.com/35516367/357247445-a2a3b6c6-62b8-4f27-a68c-650ab0cba44e.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjM1MTI4NTQsIm5iZiI6MTcyMzUxMjU1NCwicGF0aCI6Ii8zNTUxNjM2Ny8zNTcyNDc0NDUtYTJhM2I2YzYtNjJiOC00ZjI3LWE2OGMtNjUwYWIwY2JhNDRlLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA4MTMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwODEzVDAxMjkxNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWZlMTQzMjM5Yzc2OGMzOTkxMjM3M2YxYWRhZTE2YmZmMThlYmMxOWViNTY4M2NhOTFlMDQ1MjQ5MTVhNzU1ZmMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.mF_OYPJ3s9mY37bUSTmiaSsElmnmp0ih4qJxue7TYUo" />

          <h3 className="my-4 text-white text-2xl">- Added a Histagram</h3>
          <p className="my-4">
            I added a Histagram view for the total score. I also added button to
            switch between the views.
          </p>

          <img
            className="object-contain h-80"
            src="https://private-user-images.githubusercontent.com/35516367/357249249-3db516a4-0516-468b-b7c8-7751acef1653.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjM1MTM2MDIsIm5iZiI6MTcyMzUxMzMwMiwicGF0aCI6Ii8zNTUxNjM2Ny8zNTcyNDkyNDktM2RiNTE2YTQtMDUxNi00NjhiLWI3YzgtNzc1MWFjZWYxNjUzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA4MTMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwODEzVDAxNDE0MlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTg3MWNiYWM0YjA2YjYyMjYzOGJjMjlkZTI2YTk0ZjJjMjQ4OWU1YmIxMzZiNDZjYzcxM2I2ZWI3OWUxMDk0ZmUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.ISK6dPT1rSw6ACJnlcgPEpXQGjp2-7BeZhnrb2tSqA8"
          />
        </div>
      </div>
    </div>
  );
}
