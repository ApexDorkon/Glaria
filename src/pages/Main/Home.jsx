import '../../index.css';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import FeaturedQuests from '../../components/FeaturedQuests';
import News from '../../components/News';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 flex flex-col items-center gap-12 text-black">
        
        <Hero />
        <FeaturedQuests />
        <News />
      </div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none"></div>
    </div>
  );
}
