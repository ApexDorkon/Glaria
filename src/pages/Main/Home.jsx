import '../../index.css';
import Hero from '../../components/Hero';
import FeaturedQuests from '../../components/FeaturedQuests';
import News from '../../components/News';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
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

  useEffect(() => {
    if (inViewHero) controlsHero.start({ opacity: 1, y: 0, transition: { duration: 0.7 } });
  }, [inViewHero, controlsHero]);

  useEffect(() => {
    if (inViewQuests) controlsQuests.start({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } });
  }, [inViewQuests, controlsQuests]);

  useEffect(() => {
    if (inViewNews) controlsNews.start({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4 } });
  }, [inViewNews, controlsNews]);

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
          ref={refNews}
          initial={{ opacity: 0, y: 30 }}
          animate={controlsNews}
          className="w-full"
        >
          <News />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none"></div>
    </div>
  );
}