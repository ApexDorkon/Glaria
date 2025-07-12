import glassMan from "../../assets/glassMan.png";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlariaQuests from "../Quests/GlariaQuests";
import LoginModal from "../../components/LoginModal";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [completedQuests, setCompletedQuests] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Fetch user and quests on mount
  const fetchUserAndCompletedQuests = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token");

      const resUser = await fetch("https://glaria-api.onrender.com/api/me", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      if (resUser.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!resUser.ok) throw new Error("Failed to fetch user info");

      const userData = await resUser.json();
      setUser(userData);

      const resQuests = await fetch("https://glaria-api.onrender.com/api/quests/completed", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      if (resQuests.ok) {
        const questsData = await resQuests.json();
        setCompletedQuests(questsData.total_claimed_quests || 0);
      } else {
        setCompletedQuests(0);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndCompletedQuests();
  }, []);

  // Function to update user XP and completed quests count dynamically
  const updateUserStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // Update user info (especially XP)
      const resUser = await fetch("https://glaria-api.onrender.com/api/me", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (resUser.ok) {
        const userData = await resUser.json();
        setUser(userData);
      }

      // Update completed quests count
      const resQuests = await fetch("https://glaria-api.onrender.com/api/quests/completed", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (resQuests.ok) {
        const questsData = await resQuests.json();
        setCompletedQuests(questsData.total_claimed_quests || 0);
      }
    } catch (err) {
      console.error("Error updating user stats:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-12 flex flex-col items-center gap-8 animate-pulse" />
      </div>
    );
  }

  if (notFound || !user) return <LoginModal />;

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-12 flex flex-col items-center gap-8 text-gray-900">

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-start gap-8 lg:gap-12 w-full ml-0 lg:ml-20">
          {/* Avatar and Username */}
          <div className="flex flex-col items-center gap-2 relative">
            <img
              src={glassMan}
              alt="Avatar"
              className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white shadow-xl"
            />
            <p className="text-lg font-semibold text-gray-900 select-text">{user.username}</p>

            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="absolute top-0 right-0 bg-white/70 rounded-full p-2 shadow hover:bg-white cursor-pointer"
              aria-label="Settings"
              title="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-2.21 0-4 1.79-4 4 0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.21-1.79-4-4-4zm0 0v-2m0 10v-2m4-6l1.414-1.414M6 16l-1.414 1.414M18 12h2M4 12H2m15.364 6.364l1.414 1.414M6.222 6.222L4.808 4.808"
                />
              </svg>
            </button>

            {settingsOpen && (
              <div className="absolute top-14 right-0 bg-white rounded-lg shadow-lg border border-gray-300 w-40 z-50 flex flex-col">
                <Link
                  to="/profile/edit"
                  className="px-4 py-2 hover:bg-gray-100 text-gray-900 cursor-pointer"
                  onClick={() => setSettingsOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  className="px-4 py-2 hover:bg-gray-100 text-gray-900 text-left cursor-pointer"
                  onClick={() => {
                    setSettingsOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-8 w-full lg:w-auto">
            {/* Completed Quests */}
            <div className="min-w-[280px] sm:min-w-[380px] lg:min-w-[480px] rounded-3xl bg-white/10 backdrop-blur-lg border border-white/50 shadow-2xl p-6">
              <p className="text-center font-semibold text-xl">Completed Quests</p>
              <p className="text-center text-4xl font-bold mt-2 mb-4 text-black/90">
                {completedQuests}
              </p>
              <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-blue-400/80 rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
            </div>

            {/* GLARIA XP */}
            <div className="min-w-[280px] sm:min-w-[380px] lg:min-w-[480px] rounded-3xl bg-white/10 backdrop-blur-lg border border-white/50 shadow-2xl p-6">
              <p className="text-center font-semibold text-xl">GLARIA XP</p>
              <p className="text-center text-4xl font-bold mt-2 mb-4 text-black/90">
                {user.xp || 0}
              </p>
              <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-indigo-400/80 rounded-full"
                  style={{ width: `${user.xp || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pass update function down to GlariaQuests */}
        <GlariaQuests updateUserStats={updateUserStats} />

        {/* Connect Buttons Container */}
        <div className="w-full rounded-3xl bg-white/10 backdrop-blur-lg border border-white/50 shadow-2xl p-6 flex flex-col items-center gap-4">
          {user.twitter_username ? (
            <button
              disabled
              className="flex items-center justify-center gap-2 w-48 sm:w-64 px-5 py-3 rounded-full bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white/80 shadow-inner shadow-black/20 backdrop-blur-md border border-white/20 cursor-default"
            >
              <span className="text-lg">X</span>
              <span className="text-sm font-semibold tracking-wide">
                <span className="text-white font-bold">@{user.twitter_username}</span>
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                window.location.href = "https://glaria-api.onrender.com/auth/twitter/login";
              }}
              className="flex items-center justify-center gap-2 w-48 sm:w-64 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 transition text-black font-medium shadow-lg backdrop-blur-md border border-white/40"
            >
              <span className="text-xl">🕊️</span>
              <span className="text-sm font-semibold">Connect X</span>
            </button>
          )}
          <button className="px-6 py-2 w-48 text-sm font-medium rounded-full bg-white/70 hover:bg-white shadow">
            Connect Wallet
          </button>
        </div>

        {/* Generate AI Character */}
        <button className="w-full rounded-3xl bg-white/10 backdrop-blur-lg border border-white/50 py-5 text-lg font-semibold shadow-2xl hover:bg-white/50 transition">
          Generate AI Character
        </button>
      </div>
    </div>
  );
}