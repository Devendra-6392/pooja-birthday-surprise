import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import ScratchCard from '@/components/ScratchCard';

interface Page2InteractionsProps {
  onNext: () => void;
  name: string;
}

export default function Page2Interactions({ onNext, name }: Page2InteractionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const questions = [
    { text: `${name}, do you love me? 😘`, yes: 'YES 💖', no: 'NO 😜' },
    { text: `Who is the best boyfriend? 😎`, yes: 'ME! 😎', no: 'Someone else 😜' },
    { text: `Ready for your surprise ${name}? 🎁`, yes: 'YES! 🎉', no: 'Not yet 😜' },
  ];

  const handleYes = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScratchCard(true);
    }
  };

  const handleNoHover = () => {
    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 200 - 100;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.sin(i) * 80, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute text-5xl opacity-40"
            style={{
              left: `${15 + i * 10}%`,
              top: `${5 + i * 8}%`,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {!showScratchCard ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Question */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 font-display">
              {question.text}
            </h2>

            {/* Buttons Container */}
            <div className="flex gap-6 justify-center flex-wrap">
              {/* YES Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYes}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {question.yes}
              </motion.button>

              {/* NO Button (Runaway) */}
              <motion.button
                ref={noButtonRef}
                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                transition={{ type: 'spring', stiffness: 200 }}
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {question.no}
              </motion.button>
            </div>

            {/* Progress indicator */}
            <div className="mt-12 flex gap-2 justify-center">
              {questions.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 rounded-full ${
                    i <= currentQuestion ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                  animate={{ width: i <= currentQuestion ? 40 : 20 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 font-display">
              Scratch to Reveal 💌
            </h2>

            <ScratchCard
              message={`${name}, you are my favorite person forever ❤️`}
              onReveal={() => {
                setTimeout(() => {
                  setShowScratchCard(true);
                }, 500);
              }}
            />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="mt-12 px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              Unlock Your Gifts 🎁
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
