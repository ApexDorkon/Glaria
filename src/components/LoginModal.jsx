import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginModal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleXLogin = () => {
    window.location.href = "https://glaria-api.onrender.com/auth/twitter/login";
  };

  const handleWalletLogin = () => {
    alert("Wallet login not implemented yet.");
  };

  // New close handler that navigates home
  const handleClose = () => {
    navigate("/");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
        <div
          className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl text-center space-y-4 relative
                     sm:max-w-sm md:max-w-md"
        >
          <button
            className="absolute top-3 right-4 text-gray-500 text-xl"
            onClick={handleClose}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
          <h3 className="text-xl font-semibold text-gray-800">Login to GLARIA</h3>
          <button
            className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
            onClick={handleXLogin}
            disabled={loading}
          >
            Login using X
          </button>
          
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div.max-w-md {
            max-width: 280px !important;
          }
        }
      `}</style>
    </>
  );
}