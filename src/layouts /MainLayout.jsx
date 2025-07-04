import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';

export default function MainLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200); // simulate loading delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc] text-black">
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 flex flex-col gap-12">
        <Navbar />
        {isLoading ? (
          <div className="flex flex-col gap-6 animate-pulse">
            <div className="w-full h-[200px] bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg"></div>
            <div className="w-full h-[320px] bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg"></div>
            <div className="w-full h-[180px] bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg"></div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none"></div>
    </div>
  );
}
