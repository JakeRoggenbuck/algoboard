import React from "react";
import { Link } from "react-router-dom";
import { User, LogIn, LogOut } from "lucide-react";
import { useUser } from "../Context/UserContext.tsx";

type LoginControlsProps = {
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
};

export default function LoginControls({
  onLoginClick,
  onLogoutClick,
}: LoginControlsProps) {
  const { githubInfo, loginWithGitHub, logout } = useUser();
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    }
    loginWithGitHub();
  };

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    }
    logout();
  };

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition h-10"
        >
          <LogOut className="mr-2" size={20} />
          Sign Out
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition h-10"
        >
          <LogIn className="mr-2" size={20} />
          Sign In
        </button>
      )}

      <Link to={githubInfo.login ? "/account" : ""}>
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 h-10">
          {"avatar_url" in githubInfo ? (
            <img
              src={githubInfo.avatar_url as string}
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
  );
}
