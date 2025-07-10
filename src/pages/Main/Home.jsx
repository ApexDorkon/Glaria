import '../../index.css';
import Hero from '../../components/Hero';
import FeaturedQuests from '../../components/FeaturedQuests';
import News from '../../components/News';
import Leaderboard from '../../components/Leaderboard';  // Import your leaderboard
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Home() {
  // For Hero
  const controlsHero = useAnimation();
  const [refHero, inViewHero] = useInView({ triggerOnce: true, threshold: 0.1 });

  // For FeaturedQuests
  const controlsQuests = useAnimation();
  const [refQuests, inViewQuests] = useInView({ triggerOnce: true, threshold: 0.1 });

  // For News
  const controlsNews = useAnimation();
  const [refNews, inViewNews] = useInView({ triggerOnce: true, threshold: 0.1 });

  // For Leaderboard
  const controlsLeaderboard = useAnimation();
  const [refLeaderboard, inViewLeaderboard] = useInView({ triggerOnce: true, threshold: 0.1 });

  // State for real leaderboard data
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    if (inViewHero) controlsHero.start({ opacity: 1, y: 0, transition: { duration: 0.7 } });
  }, [inViewHero, controlsHero]);

  useEffect(() => {
    if (inViewQuests) controlsQuests.start({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } });
  }, [inViewQuests, controlsQuests]);

  useEffect(() => {
    if (inViewNews) controlsNews.start({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4 } });
  }, [inViewNews, controlsNews]);

  useEffect(() => {
    if (inViewLeaderboard) controlsLeaderboard.start({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.6 } });
  }, [inViewLeaderboard, controlsLeaderboard]);

  // Fetch leaderboard data from API on mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("https://glaria-api.onrender.com/api/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");

        const data = await res.json();

        // Map API data to Leaderboard props format
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
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 flex flex-col items-center gap-12 text-black">

        <motion.div
          ref={refHero}
          initial={{ opacity: 0, y: 30 }}
          animate={controlsHero}
          className="w-full"
        >
          <Hero />
        </motion.div>

        <motion.div
          ref={refQuests}
          initial={{ opacity: 0, y: 30 }}
          animate={controlsQuests}
          className="w-full flex justify-center"
        >
          <FeaturedQuests />
        </motion.div>

     
        <motion.div
          ref={refLeaderboard}
          initial={{ opacity: 0, y: 30 }}
          animate={controlsLeaderboard}
          className="w-full flex justify-center"
        >
          {/* Show loading message or leaderboard */}
          {loadingLeaderboard ? (
            <p className="text-gray-700">Loading leaderboard...</p>
          ) : (
            <Leaderboard type="general" data={leaderboardData} />
          )}
        </motion.div>

      </div>

      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none"></div>
    </div>
  );
}