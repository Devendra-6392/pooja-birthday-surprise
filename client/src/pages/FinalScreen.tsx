import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface FinalScreenProps {
  onRestart: () => void;
  name: string;
}

export default function FinalScreen({ onRestart, name }: FinalScreenProps) {
  const [loveCount, setLoveCount] = useState(1);

  const finalMessage = `Happy Birthday ${name} ❤️
You are my happiness, my peace, my everything.
I promise to always stay with you.
I love you more every day 💖`;

  const { displayedText } = useTypingEffect(finalMessage, 40, 500);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoveCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-rose-200 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Intense floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -300, 0],
              x: [0, Math.sin(i) * 150, 0],
              opacity: [0.3, 0.7, 0.3],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 12 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-7xl opacity-50"
            style={{
              left: `${5 + i * 4}%`,
              top: `${-10 + i * 3}%`,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl text-center">
        {/* Emotional Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-pink-200"
        >
          <div className="text-2xl md:text-3xl text-gray-800 font-light leading-relaxed whitespace-pre-line">
            {displayedText}
            {displayedText.length > 0 && displayedText.length < finalMessage.length && (
              <span className="animate-pulse">|</span>
            )}
          </div>
        </motion.div>

        {/* Love Counter - Large */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mb-12 p-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl shadow-2xl"
        >
          <div className="text-5xl md:text-6xl font-bold text-white">
            I Love You {loveCount} ❤️
          </div>
        </motion.div>

        {/* Floating hearts around love counter */}
        <div className="relative h-32 mb-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.cos((i * 45 * Math.PI) / 180) * 60, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.15,
                repeat: Infinity,
              }}
              className="absolute text-4xl"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              ❤️
            </motion.div>
          ))}
        </div>

        {/* Restart Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
        >
          Play Again 🔁
        </motion.button>

        {/* Decorative elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 text-9xl opacity-10 pointer-events-none"
        >
          💖
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-20 -left-20 text-9xl opacity-10 pointer-events-none"
        >
          💖
        </motion.div>
      </div>
    </div>
  );
}
