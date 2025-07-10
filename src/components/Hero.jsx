import { useState, useEffect } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="w-full px-4 py-8 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
        <h1 className="text-xl font-semibold leading-relaxed text-gray-900 text-center">
          Explore the Projects on Sophon
          <br /> 
          Engage. Support. Earn.
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full px-10 py-14 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 text-center">
        Explore the Projects on Sophon<br /> Engage. Support. Earn.
      </h1>
    </div>
  );
}