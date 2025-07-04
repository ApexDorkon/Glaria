import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TwitterCallback({ setTwitterUser, setShowSignupModal, setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (!code || !state) {
      alert("Missing Twitter callback params");
      navigate("/");
      return;
    }

    const completeLogin = async () => {
      try {
        const res = await fetch(`https://glaria-api.onrender.com/auth/twitter/process?code=${code}&state=${state}`);
        const data = await res.json();

        if (!data || !data.twitter_user) {
          alert("Twitter login failed.");
          return;
        }

        localStorage.setItem("access_token", data.access_token);
        setTwitterUser(data.twitter_user);

        if (data.userExists) {
          setIsAuthenticated(true);
          navigate("/profile");
        } else {
          setShowSignupModal(true);
          navigate("/"); // or stay on homepage while modal is open
        }
      } catch (err) {
        console.error("Login error", err);
      }
    };

    completeLogin();
  }, []);

  return <div className="text-center py-10 text-gray-700">Completing login...</div>;
}
