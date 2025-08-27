import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchToken() {
      // Parse query params from the URL
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code) {
        console.error("No code found in callback URL");
        navigate("/");
        return;
      }

      try {
        // Send the code to your backend to exchange for a JWT
        const res = await fetch(`http://127.0.0.1:8000/auth?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || "")}`, {
          method: "GET",
          credentials: "include", // so cookies from backend are saved
        });

        if (res.ok) {
          // Backend should set JWT cookie and redirect is optional
          navigate("/");
        } else {
          console.error("Token exchange failed", await res.text());
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching token", err);
        navigate("/login");
      }
    }

    fetchToken();
  }, [location.search, navigate]);

  return <div>Logging you in...</div>;
}
