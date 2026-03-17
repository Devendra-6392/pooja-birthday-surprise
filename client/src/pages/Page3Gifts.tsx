import { motion } from 'framer-motion';
import { useState } from 'react';
import Confetti from '@/components/Confetti';

interface Page3GiftsProps {
  onNext: () => void;
  name: string;
}

export default function Page3Gifts({ onNext, name }: Page3GiftsProps) {
  const [revealedGifts, setRevealedGifts] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  const gifts = [
    {
      id: 0,
      title: 'Unlimited Love',
      emoji: '💖',
      description: `For ${name}: An infinite supply of love, hugs, and cuddles`,
    },
    {
      id: 1,
      title: 'Movie Date',
      emoji: '🍿',
      description: `For ${name}: A cozy movie night with your favorite snacks`,
    },
    {
      id: 2,
      title: 'Secret Surprise',
      emoji: '😍',
      description: `For ${name}: Something special I've been planning...`,
    },
  ];

  const handleReveal = (id: number) => {
    const newRevealed = new Set(revealedGifts);
    newRevealed.add(id);
    setRevealedGifts(newRevealed);

    if (newRevealed.size === gifts.length) {
      setShowConfetti(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-red-100 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <Confetti trigger={showConfetti} />

      {/* Background floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -200, 0],
              x: [0, Math.sin(i) * 100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-6xl opacity-40"
            style={{
              left: `${10 + i * 8}%`,
              top: `${0 + i * 5}%`,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600 font-display"
        >
          Your Gifts 🎁
        </motion.h1>

        {/* Gifts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {gifts.map((gift) => (
            <motion.div
              key={gift.id}
              variants={itemVariants}
              className="relative"
            >
              {!revealedGifts.has(gift.id) ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReveal(gift.id)}
                  className="w-full h-64 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                >
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Gift box icon */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-4 relative z-10"
                  >
                    🎁
                  </motion.div>

                  <p className="text-white text-lg font-bold relative z-10">
                    Click to Open
                  </p>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-64 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border-2 border-pink-300"
                >
                  <div className="text-6xl mb-4">{gift.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center font-display">
                    {gift.title}
                  </h3>
                  <p className="text-gray-700 text-center text-sm">
                    {gift.description}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Next Button */}
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              Continue 💖
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
