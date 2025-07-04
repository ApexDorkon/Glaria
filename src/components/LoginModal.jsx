// components/LoginModal.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLoginWithX = async () => {
    try {
      setLoading(true);

      // Simulate OAuth login flow (you should replace this)
      const response = await fetch("/api/auth/x-login"); // e.g., redirect to X OAuth
      const { userId, accessToken } = await response.json();

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", userId);

      const check = await fetch(`/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (check.status === 404) {
        navigate("/profile/create");
      } else {
        navigate("/profile");
      }

      onClose();
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithWallet = () => {
    alert("Wallet login not implemented yet.");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl relative">
        <button
          className="absolute top-2 right-3 text-gray-500"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <button
          onClick={handleLoginWithX}
          className="w-full bg-black text-white py-2 rounded-lg mb-3 hover:bg-gray-900"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Login using X"}
        </button>
        <button
          onClick={handleLoginWithWallet}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Login using Wallet
        </button>
      </div>
    </div>
  );
}
