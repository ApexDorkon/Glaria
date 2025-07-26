import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TwitterCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("access_token");

    if (!accessToken) {
      console.error("No access token in callback URL");
      navigate("/");
      return;
    }

    localStorage.setItem("accessToken", accessToken);

    // Check if user profile exists
    fetch("https://glaria-api.onrender.com/api/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (res) => {
        if (res.status === 404) {
          const payload = await res.json();
          const userId = payload?.user_id || "unknown";
          navigate("/", {
            state: {
              needsProfile: true,
              userId,
            },
          });
        } else {
          navigate("/profile");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
        navigate("/");
      });
  }, []);

  return <div className="text-center p-10">Logging in with Twitter...</div>;
}
