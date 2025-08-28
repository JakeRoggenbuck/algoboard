import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🔐 AuthCallback: Component mounted");
    console.log("🔐 AuthCallback: Current location:", location);
    console.log("🔐 AuthCallback: Search params:", location.search);

    async function fetchToken() {
      console.log("🔐 AuthCallback: Starting fetchToken function");
      
      // Parse query params from the URL
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");
      const errorDescription = params.get("error_description");

      console.log("🔐 AuthCallback: Parsed URL parameters:");
      console.log("  - code:", code ? `${code.substring(0, 10)}...` : "null");
      console.log("  - state:", state);
      console.log("  - error:", error);
      console.log("  - error_description:", errorDescription);

      if (error) {
        console.error("🔐 AuthCallback: OAuth error received:", error, errorDescription);
        navigate("/");
        return;
      }

      if (!code) {
        console.error("🔐 AuthCallback: No authorization code found in callback URL");
        console.log("🔐 AuthCallback: Available params:", Array.from(params.entries()));
        navigate("/");
        return;
      }

      console.log("🔐 AuthCallback: Authorization code found, proceeding with token exchange");

      try {
        const authUrl = `http://127.0.0.1:8000/auth?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || "")}`;
        console.log("🔐 AuthCallback: Making request to:", authUrl);
        
        // Send the code to your backend to exchange for a JWT
        const res = await fetch(authUrl, {
          method: "GET",
          credentials: "include", // so cookies from backend are saved
        });

        console.log("🔐 AuthCallback: Response received:");
        console.log("  - Status:", res.status);
        console.log("  - Status Text:", res.statusText);
        console.log("  - Headers:", Object.fromEntries(res.headers.entries()));

        if (res.ok) {
          console.log("🔐 AuthCallback: Token exchange successful");
          
          // Check if we have cookies set
          const cookies = document.cookie;
          console.log("🔐 AuthCallback: Current cookies:", cookies);
          
          // Try to get response body for debugging
          try {
            const responseText = await res.text();
            console.log("🔐 AuthCallback: Response body:", responseText);
          } catch (e) {
            console.log("🔐 AuthCallback: Could not read response body:", e);
          }
          
          console.log("🔐 AuthCallback: Navigating to home page");
          navigate("/");
        } else {
          console.error("🔐 AuthCallback: Token exchange failed");
          const errorText = await res.text();
          console.error("🔐 AuthCallback: Error response:", errorText);
          console.log("🔐 AuthCallback: Navigating to login page due to failure");
          navigate("/login");
        }
      } catch (err) {
        console.error("🔐 AuthCallback: Network error during token exchange:", err);
        console.log("🔐 AuthCallback: Navigating to login page due to network error");
        navigate("/login");
      }
    }

    console.log("🔐 AuthCallback: Calling fetchToken");
    fetchToken();
  }, [location.search, navigate]);

  console.log("🔐 AuthCallback: Rendering component");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">Logging you in...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we complete authentication</p>
      </div>
    </div>
  );
}
