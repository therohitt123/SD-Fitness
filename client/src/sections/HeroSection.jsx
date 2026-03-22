import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { API_BASE_URL } from '../api/client';
import { useNavigate } from 'react-router-dom';

const transition = { duration: 1, ease: [0.22, 1, 0.36, 1] };

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function Advanced3DSlider() {
  const navigate = useNavigate();
  const [slidesData, setSlidesData] = useState([]);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    api
      .get('/api/videos')
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        if (!rows.length) {
          setSlidesData([]);
          return;
        }
        const mapped = rows.map((row, i) => ({
          id: row._id || `s-${i}`,
          name: row.title || `Slide ${i + 1}`,
          location: 'SD Fitness',
          img: row.url,
          mediaType: row.mediaType || 'image',
        }));
        setSlidesData(mapped);
      })
      .catch(() => {
        setSlidesData([]);
      });
  }, []);

  useEffect(() => {
    if (!slidesData.length) return;
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % slidesData.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slidesData]);

  useEffect(() => {
    if (!slidesData.length) return;
    setProgress(0);
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / 5000) * 100));
    }, 80);
    return () => clearInterval(timer);
  }, [index, slidesData.length]);

  useEffect(() => {
    if (!slidesData.length) {
      setIndex(0);
      return;
    }
    setIndex((prev) => prev % slidesData.length);
  }, [slidesData.length]);

  const mainSlide = slidesData[index];

  const getTiles = () => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(slidesData[(index + i) % slidesData.length]);
    }
    return arr;
  };

  const tiles = getTiles();

  if (!slidesData.length) return null;

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-black text-white"
      onMouseMove={(e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 12;
        const y = (e.clientY / innerHeight - 0.5) * 12;
        setParallax({ x, y });
      }}
      onMouseLeave={() => setParallax({ x: 0, y: 0 })}
    >

      {/* BACKGROUND */}
      <AnimatePresence mode="wait">
        {mainSlide.mediaType === 'video' ? (
          <motion.video
            key={mainSlide.id}
            src={resolveMediaUrl(mainSlide.img)}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: parallax.x, y: parallax.y }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <motion.img
            key={mainSlide.id}
            src={resolveMediaUrl(mainSlide.img)}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: parallax.x, y: parallax.y }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/50 " />

      {/* TEXT */}
      <div className="sm:sticky absolute max-md:left-24 top-[57%] z-20 flex max-w-xl max-sm:w-full max-sm:mx-auto max-sm:left-0 sm:-translate-y-1/2 flex-col items-center justify-center md:mt-10 ">
      
        <img src="/SD_Fitness.svg" alt="SD Fitness" className="md:mb-2 h-36 w-36 object-contain md:h-44 md:w-44 absolute -top-[115px] max-sm:-top-24" />
        <h1 className="text-2xl font-black uppercase leading-tight tracking-tight md:text-4xl">{mainSlide.name}</h1>
        <p className="mt-1 text-xs text-white/70 md:text-sm">{mainSlide.location}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="rounded-xl bg-brand-500/90 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500"
          >
            Join Now
          </button>
          <button
            type="button"
            onClick={() => navigate('/#plans')}
            className="rounded-xl border border-white/40 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
          >
            View Plans
          </button>
        </div>
      </div>

      {/* 3D TILES */}
      <div className="absolute bottom-10 right-4 z-30 md:bottom-12 md:right-10" style={{ perspective: 1400 }}>
        <div
          className="relative hidden h-[200px] w-[600px] md:block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {tiles.map((slide, i) => (
            <motion.div
              key={`${slide.id}-${i}`}
              onClick={() => setIndex((index + i) % slidesData.length)}
              className="absolute top-0 right-0 h-[180px] w-[130px] rounded-xl overflow-hidden cursor-pointer shadow-2xl"
              animate={{
                x: -i * 95,
                scale: i === 0 ? 1.2 : 0.9,
                rotateY: i === 0 ? 0 : -40,
                z: i === 0 ? 0 : -120,
                opacity: i > 4 ? 0 : 1,
                filter: i === 0 ? 'blur(0px)' : 'blur(1.5px)',
                zIndex: 50 - i,
              }}
              transition={transition}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src={resolveMediaUrl(slide.img)}
                alt={slide.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute bottom-0 left-0 p-3 text-xs">
                <p className="font-bold">{slide.name}</p>
                <p className="opacity-70">{slide.location}</p>
              </div>

              {i === 0 && (
                <div className="absolute inset-0 ring-2 ring-white/70 rounded-xl" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-30 h-px w-full bg-white/15">
        <div className="h-full bg-gradient-to-r from-brand-500 to-pink-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}