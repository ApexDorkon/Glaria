import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import GlariaLogo from "../assets/glariacircle.png";
import SignupModal from "../components/SignupModal";
import ConnectWallet from "../components/ConnectWallet";
import { ethers } from "ethers";
import dummyPP from "../assets/glassMan.png"; // Placeholder profile picture
export default function Layout({ children }) {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [twitterUser, setTwitterUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
const [showWalletConnect, setShowWalletConnect] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state) {
      window.history.replaceState({}, document.title, window.location.pathname);

      const completeTwitterLogin = async () => {
        try {
          const res = await fetch(`https://glaria-api.onrender.com/auth/twitter/callback?code=${code}&state=${state}`);
          const data = await res.json();

          if (!data || !data.twitter_user || !data.access_token) {
            alert("Twitter login failed.");
            return;
          }

          const { twitter_user, userExists, access_token } = data;

          localStorage.setItem("access_token", access_token);
          setIsAuthenticated(true);
          setTwitterUser(twitter_user);

          setTimeout(() => {
            if (userExists) navigate("/profile");
            else setShowSignupModal(true);
          }, 150);
        } catch (err) {
          console.error("Twitter login error:", err);
          alert("Twitter login failed. Try again.");
        }
      };

      completeTwitterLogin();
    }
  }, [navigate]);

  const handleXLogin = () => {
    window.location.href = "https://glaria-api.onrender.com/auth/twitter/login";
  };

  const handleWalletLogin = () => {
    console.log("Wallet login button clicked");
  setTwitterUser(null);
  setShowWalletConnect(true);
  setShowLoginOptions(false);
};
useEffect(() => {
  const onStorageChange = () => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    if (!token) setTwitterUser(null);
  };

  window.addEventListener("storage", onStorageChange);

  return () => window.removeEventListener("storage", onStorageChange);
}, []);
  const handleSignupSubmit = async (userData) => {
    try {
      const res = await fetch(`https://glaria-api.onrender.com/api/create-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok || !data.access_token) throw new Error("Signup failed");

      localStorage.setItem("access_token", data.access_token);
      setIsAuthenticated(true);
      setShowSignupModal(false);
      navigate("/profile");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setTwitterUser(null);
    setProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 flex flex-col items-center gap-8 text-black">
        {/* Navbar */}
        <header className="
          w-full
          bg-white/30
          backdrop-blur-lg
          rounded-3xl
          border
          border-white/40
          shadow-md
          px-4 py-4
          flex
          items-center
          justify-between
          flex-wrap

          /* Mobile styles */
          md:flex-nowrap
        ">
{/* Logo and GLARIA text */}
<div
  className="
    flex items-center cursor-pointer space-x-4 flex-shrink-0
    w-full justify-center mb-3 md:mb-0 md:w-auto md:justify-start
  "
  onClick={() => navigate("/")}
>
 <div
  className="
    relative w-20 h-20 rounded-full
    bg-gray-200/20 backdrop-blur-lg border border-gray-300/50
    shadow-[inset_0_4px_8px_rgb(255_255_255_/_0.6),inset_0_-4px_6px_rgb(0_0_0_/_0.1)]
    flex items-center justify-center
    overflow-hidden
    transition-transform transition-shadow duration-150 ease-in-out
    hover:scale-95
    hover:shadow-[inset_0_2px_4px_rgb(0_0_0_/_0.3),inset_0_-2px_4px_rgb(0_0_0_/_0.2)]
  "
>
  {/* Glossy highlight */}
  <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-tr from-white/40 via-white/60 to-transparent pointer-events-none" />
  {/* Middle glossy highlight */}
  <div
    className="absolute inset-0 rounded-full bg-white/100 pointer-events-none"
    style={{ filter: "blur(10px)" }}
  />
  {/* Inner shadow for depth */}
  <div className="absolute inset-0 rounded-full shadow-[inset_0_8px_15px_rgb(0_0_0_/_0.15)] pointer-events-none" />
  <img
    src={GlariaLogo}
    alt="Logo"
    className="w-[4.5rem] h-[4.5rem] object-contain relative z-10"
    style={{ maxWidth: "100%", maxHeight: "100%" }}
  />
</div>
  <span className="text-lg sm:text-xl font-bold select-none whitespace-nowrap text-black">
    GLARIA
  </span>
</div>
          {/* Nav links and profile/login */}
          <div className="
            flex
            w-full
            justify-around
            items-center
            space-x-0
            md:space-x-6
            md:w-auto
            md:justify-end
          ">
            <nav className="flex space-x-6 text-gray-800 font-medium text-base md:text-lg lg:text-xl">
              <Link
                to="/quests"
                className="hover:no-underline hover:text-gray-900 px-2 py-2 whitespace-nowrap"
              >
                Quests
              </Link>
              <Link
                to="/projects"
                className="hover:no-underline hover:text-gray-900 px-2 py-2 whitespace-nowrap"
              >
                Projects
              </Link>
            </nav>

            <div className="relative flex-shrink-0">
             {isAuthenticated ? (
  <img
  src={twitterUser?.profile_image_url || dummyPP}
  alt="Profile"
  className="
    rounded-full
    cursor-pointer
    w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16
    border border-white/30
    bg-white/10
    backdrop-blur-sm
    shadow-[0_0_10px_3px_rgba(255,255,255,0.3)]
    hover:shadow-[0_0_20px_6px_rgba(255,255,255,0.5)]
    transition-shadow
    duration-300
  "
  onClick={() => navigate("/profile")}
  title="Go to Profile"
/>
              ) : (
                <button
                  onClick={() => setShowLoginOptions(true)}
                  className="py-2 px-5 bg-white/50 backdrop-blur-md rounded-full border border-white/30 hover:scale-105 transition text-gray-800 font-semibold"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full">{children || <Outlet />}</main>

        {/* Signup Modal */}
        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onSubmit={handleSignupSubmit}
            twitterId={twitterUser?.id}
            twitterUsername={twitterUser?.username}
          />
        )}
      </div>
{showWalletConnect && (
  <ConnectWallet
    onClose={() => {
      console.log("Wallet connection modal closed");
      setShowWalletConnect(false);
    }}
    onConnected={async ({ address, signature }) => {
      console.log("Wallet connected callback called");
      setShowWalletConnect(false);

      console.log("Wallet address:", address);
      console.log("Signature:", signature);

      try {
        const res = await fetch("https://glaria-api.onrender.com/api/auth/wallet-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, signature }),
        });

        console.log("Sent wallet login data to backend");

        if (!res.ok) {
          throw new Error("Wallet login failed");
        }

        const data = await res.json();
        console.log("Backend response:", data);

        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          setIsAuthenticated(true);
          navigate("/profile");
          console.log("Wallet login successful, user authenticated");
        } else {
          console.warn("Wallet login failed: No access token");
          alert("Wallet login failed: No access token");
        }
      } catch (error) {
        console.error("Wallet login error:", error);
        alert(error.message || "Wallet login failed");
      }
    }}
  />
)}
      {/* Login Options Modal */}
      {showLoginOptions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl text-center space-y-4 relative">
            <button
              className="absolute top-3 right-4 text-gray-500 text-xl"
              onClick={() => setShowLoginOptions(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-gray-800">Login to GLARIA</h3>
            <button
              className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
              onClick={handleXLogin}
            >
              Login using X
            </button>
            
          </div>
        </div>
      )}
      <style>{`
        /* Hide scrollbar but allow horizontal scroll */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}