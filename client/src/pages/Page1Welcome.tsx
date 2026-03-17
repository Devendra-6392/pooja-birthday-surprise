import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface Page1WelcomeProps {
  onNext: () => void;
  name: string;
}

export default function Page1Welcome({ onNext, name }: Page1WelcomeProps) {
  const [loveCount, setLoveCount] = useState(1);
  const { displayedText } = useTypingEffect(
    `I made something special just for you ${name}...`,
    50,
    500
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLoveCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-100 flex flex-col items-center justify-center px-4 py-8">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-4xl opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl text-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-rose-600"
        >
          Happy Birthday {name} ❤️
        </motion.h1>

        {/* Typing Effect Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl text-gray-700 mb-12 h-16 flex items-center justify-center font-light"
        >
          {displayedText}
          {displayedText.length > 0 && displayedText.length < 40 && (
            <span className="animate-pulse">|</span>
          )}
        </motion.div>

        {/* Love Counter */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-12 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-pink-200"
        >
          <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600">
            I Love You {loveCount} ❤️
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-lg text-gray-600 mb-12 font-light"
        >
          Made with ❤️ by your stupid boyfriend 😜
        </motion.p>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          Start Surprise 💖
        </motion.button>
      </div>
    </div>
  );
}
