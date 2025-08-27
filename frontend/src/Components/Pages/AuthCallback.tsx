import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchToken() {
      const res = await fetch("http://127.0.0.1:8000" + "/auth/callback", {
        credentials: "include",
      });

      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);

      navigate("/");
    }

    fetchToken();
  }, []);

  return <div>Logging you in...</div>;
}
