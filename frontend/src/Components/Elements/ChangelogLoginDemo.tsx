import { LogIn, User } from "lucide-react";

const ChangelogLoginDemo = () => {
  const onSignIn = () => {
    alert("Just a demo! Go to the home page for the real login!");
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onSignIn}
        className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition h-10"
      >
        <LogIn className="mr-2" size={20} />
        Sign In
      </button>

      <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 h-10">
        <User className="text-cyan-400" size={20} />

        <span className="font-medium text-gray-200">Guest</span>
      </div>
    </div>
  );
};

export default ChangelogLoginDemo;
