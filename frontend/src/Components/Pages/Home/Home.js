import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-[#0D1117] h-screen flex flex-col items-center justify-center text-white">
      <div className="absolute top-4 left-4">
        <p>leaterboard.com</p>
      </div>
      <h1 className="text-6xl font-bold">Leaterboard</h1>

      <Link to="/boards" className="text-blue-600 hover:text-blue-800">
        <button className="text-xl mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
			Boards
        </button>
      </Link>
    </div>
  );
}
