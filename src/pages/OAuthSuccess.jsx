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
        console.log("Access Token:", accessToken); 
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
  <div className="min-h-screen flex items-start justify-center bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc] pt-16">
    <div className="bg-white/20 backdrop-blur-3xl rounded-3xl shadow-lg max-w-sm w-full p-10 border border-white/40">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 drop-shadow-md">
        Sign up to <span className="text-indigo-600">Glaria</span>
      </h2>

      <label className="block text-gray-800 text-sm mb-2 font-semibold">
        Set up your Username
      </label>
      <input
        type="text"
        className="w-full p-3 mb-6 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
        placeholder="Your Glaria username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="block text-gray-800 text-sm mb-2 font-semibold">
        Verify email (optional)
      </label>
      <input
        type="email"
        className="w-full p-3 mb-8 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-bold shadow-md drop-shadow-md"
      >
        Sign Up
      </button>
    </div>
  </div>
);
}