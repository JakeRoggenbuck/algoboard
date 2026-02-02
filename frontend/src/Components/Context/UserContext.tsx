import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { track } from "@amplitude/analytics-browser";

const CLIENT_ID = "Ov23liAdJ5YRCEzVsbOD";

type GithubInfo = {
  login?: string;
  avatar_url?: string;
  name?: string;
  html_url?: string;
  blog?: string;
  bio?: string;
  [key: string]: unknown;
};

type UserContextValue = {
  githubInfo: GithubInfo;
  isLoading: boolean;
  refreshUserInfo: () => Promise<void>;
  setGithubInfo: React.Dispatch<React.SetStateAction<GithubInfo>>;
  loginWithGitHub: () => void;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [githubInfo, setGithubInfo] = useState<GithubInfo>({ login: "" });
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserInfo = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setGithubInfo({ login: "" });
      setIsLoading(false);
      return;
    }

    const cacheKey = "githubUserInfo";
    const cacheTimeKey = "githubUserInfoTime";
    const cacheTime = localStorage.getItem(cacheTimeKey);
    const now = Date.now();

    // Cache for 10 minutes
    if (cacheTime && now - parseInt(cacheTime, 10) < 600_000) {
      const cached = localStorage.getItem(cacheKey);
      if (cached !== null) {
        const cachedData = JSON.parse(cached);
        if (cachedData) {
          setGithubInfo(cachedData);
          setIsLoading(false);
          return;
        }
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://api.algoboard.org/user-info", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if ("login" in data) {
        setGithubInfo(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, now.toString());
        track("user-logged-in", { loggin: data["login"] });
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUserInfo();
  }, [refreshUserInfo]);

  const loginWithGitHub = useCallback(() => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" +
        CLIENT_ID +
        "&scope=user:email",
    );
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({
      githubInfo,
      isLoading,
      refreshUserInfo,
      setGithubInfo,
      loginWithGitHub,
      logout,
    }),
    [githubInfo, isLoading, refreshUserInfo, loginWithGitHub, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
