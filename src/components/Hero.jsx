import { useState, useEffect } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    // Mobile version — add your mobile-specific layout here
    return (
      <div className="w-full px-6 py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
        <h1 className="text-2xl font-semibold leading-snug text-gray-900 text-center">
          Explore the Projects on Sophon chain,
          <br />
          complete quests to collect points
        </h1>
      </div>
    );
  }

  // Desktop version — unchanged, exactly as you provided
  return (
    <div className="w-full px-10 py-14 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 text-center">
        Explore the Projects on Sophon chain,<br /> complete quests to collect points
      </h1>
    </div>
  );
}