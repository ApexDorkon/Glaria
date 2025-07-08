import React, { useEffect, useState } from "react";
import Leaderboard from "../../components/Leaderboard"; // Adjust the path as needed

export default function GeneralLeaderboardWrapper() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("https://glaria-api.onrender.com/api/leaderboard");
        const data = await res.json();

        const formatted = data.map(user => ({
          username: user.twitter_username,
          profilePhoto: user.nft_image_url,
          points: user.total_xp,
        }));

        setLeaderboardData(formatted);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto p-6 text-center text-gray-600">
        Loading leaderboard...
      </div>
    );
  }

  return <Leaderboard type="general" data={leaderboardData} />;
}