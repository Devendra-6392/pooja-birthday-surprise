import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackName = 'Kithe Reh Gaya';

  useEffect(() => {
    let interval: number | undefined;
    let timeout: number | undefined;

    // Countdown from 5 to 0
    interval = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (interval) clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000) as unknown as number;

    // Attempt to play after 5s
    timeout = window.setTimeout(() => {
      const el = audioRef.current;
      if (!el) return;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsBlocked(false);
          })
          .catch(() => {
            // Autoplay blocked — show play button
            setIsBlocked(true);
            setIsPlaying(false);
          });
      }
    }, 5000) as unknown as number;

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const userPlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      await el.play();
      setIsPlaying(true);
      setIsBlocked(false);
    } catch (e) {
      setIsBlocked(true);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play().then(() => setIsPlaying(true)).catch(() => setIsBlocked(true));
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/Kithe%20Reh%20Gaya.mp3" loop />

      {/* Small status HUD */}
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-3">
        <div className="bg-white/10 text-white px-3 py-2 rounded-full shadow-lg backdrop-blur">
          <div className="text-sm">{trackName}</div>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          className="p-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </motion.button>
      </div>

      {/* Overlay when autoplay blocked */}
      {isBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-black/50 p-6 rounded-xl text-center backdrop-blur-sm">
            <p className="text-white text-lg mb-4">We couldn't start the music automatically.</p>
            <button
              onClick={userPlay}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-md"
            >
              Play Music
            </button>
          </div>
        </div>
      )}

      {/* Countdown toast */}
      {!isPlaying && !isBlocked && (
        <div className="fixed bottom-6 left-6 z-50 bg-white/10 text-white px-4 py-2 rounded-lg shadow-md backdrop-blur">
          Music starting in {countdown}s
        </div>
      )}
    </>
  );
}
