import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const twitterId = searchParams.get("twitter_id");
  const twitterUsername = searchParams.get("username");
  const userExists = searchParams.get("userExists") === "true";
  const accessToken = searchParams.get("access_token");

  // ✅ Always store token immediately
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
  }, [accessToken]);

  // ✅ If user already exists, skip signup
  useEffect(() => {
    if (userExists) {
      navigate("/profile");
    }
  }, [userExists, navigate]);

  // ✅ Exit prompt
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const blockNav = (e) => {
      if (!window.confirm("You haven’t finished signing up. Are you sure you want to leave?")) {
        e.preventDefault();
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockNav);
    return () => window.removeEventListener("popstate", blockNav);
  }, []);

  const handleSubmit = async () => {
    if (username.length < 4) {
      alert("Username must be at least 4 characters");
      return;
    }

    const payload = {
      username,
      email,
      twitter_id: twitterId,
      twitter_username: twitterUsername,
    };

    try {
      const res = await fetch("https://glaria-api.onrender.com/api/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Signup failed");

      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Signup failed. Try again.");
    }
  };

  if (!twitterId || !twitterUsername) {
    return <div className="text-center mt-10 text-red-500">Missing Twitter info.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="bg-white/50 backdrop-blur-xl p-8 rounded-3xl shadow-md max-w-sm w-full">
        <h2 className="text-xl font-bold text-center mb-6 text-white">Sign up to Glaria</h2>

        <label className="text-white text-sm mb-1 block">Set up your Username</label>
        <input
          type="text"
          className="w-full p-2 rounded-lg mb-4 bg-white/80 text-black placeholder-gray-500"
          placeholder="Your Glaria username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="text-white text-sm mb-1 block">Verify email (optional)</label>
        <input
          type="email"
          className="w-full p-2 rounded-lg mb-6 bg-white/80 text-black placeholder-gray-500"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}