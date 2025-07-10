import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function FeaturedQuests() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  let scrollTimeout = null;

  const quests = [
    {
      id: 1,
      description: "Verify on X",
      projectName: "Project X",
      projectLogo: "/logo.png",
      xp: 30,
    },
    {
      id: 2,
      description: "Join Discord",
      projectName: "GammaDAO",
      projectLogo: "/logo.png",
      xp: 25,
    },
    {
      id: 3,
      description: "Mint Character",
      projectName: "ZetaChain",
      projectLogo: "/logo.png",
      xp: 50,
    },
    {
      id: 4,
      description: "Connect Wallet",
      projectName: "OmniFi",
      projectLogo: "/logo.png",
      xp: 15,
    },
    {
      id: 5,
      description: "Retweet Announcement",
      projectName: "NovaLaunch",
      projectLogo: "/logo.png",
      xp: 20,
    },
    {
      id: 6,
      description: "Vote in Snapshot",
      projectName: "MetaGov",
      projectLogo: "/logo.png",
      xp: 40,
    },
  ];

  // Detect mobile screen width
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Debounced scroll handler to snap to closest card on mobile
  const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      // Card width including gap (approx)
      const cardWidth = container.firstChild.offsetWidth + 16; // 16px gap approx

      // Calculate nearest snap position
      const scrollLeft = container.scrollLeft;
      const snapIndex = Math.round(scrollLeft / cardWidth);

      // Snap scroll
      container.scrollTo({
        left: snapIndex * cardWidth,
        behavior: "smooth",
      });
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 sm:py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg featured-quests-glass">
      <h2 className="text-lg font-semibold mb-6">FEATURED QUESTS</h2>

      {isMobile ? (
        // Mobile horizontal scroll with snapping
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="featured-quests-grid"
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "65vw", // mobile card width
            gap: "1rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: "1rem",
            scrollPaddingRight: "1rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {quests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => navigate(`/quests/${quest.id}`)}
              className="aspect-[4/3] rounded-xl bg-white/50 border border-white/30 shadow-inner p-4 sm:p-6 flex flex-col justify-between cursor-pointer"
              style={{
                scrollSnapAlign: "center",
                maxWidth: "100%",
                minWidth: "65vw",
              }}
            >
              <p className="text-base sm:text-xl font-semibold text-gray-800 leading-snug">
                {quest.description}
              </p>
              <div className="flex justify-between items-end mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={quest.projectLogo}
                    alt={quest.projectName}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {quest.projectName}
                  </span>
                </div>
                <div className="bg-white/60 backdrop-blur-md px-2 py-1 rounded-full shadow text-xs font-semibold text-gray-900">
                  +{quest.xp} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop grid (original)
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 featured-quests-grid">
          {quests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => navigate(`/quests/${quest.id}`)}
              className="aspect-[4/3] rounded-xl bg-white/50 border border-white/30 shadow-inner p-4 sm:p-6 flex flex-col justify-between hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer"
            >
              <p className="text-base sm:text-xl font-semibold text-gray-800 leading-snug">
                {quest.description}
              </p>
              <div className="flex justify-between items-end mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={quest.projectLogo}
                    alt={quest.projectName}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {quest.projectName}
                  </span>
                </div>
                <div className="bg-white/60 backdrop-blur-md px-2 py-1 rounded-full shadow text-xs font-semibold text-gray-900">
                  +{quest.xp} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .featured-quests-glass {
            padding-left: 2rem;
            padding-right: 2rem;
            margin-left: -2rem;
            margin-right: -2rem;
            border-radius: 2rem;
          }
        }
      `}</style>
    </div>
  );
}