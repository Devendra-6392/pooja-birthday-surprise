import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface IntroScreenProps {
  onComplete: () => void;
  name: string;
}

export default function IntroScreen({ onComplete, name }: IntroScreenProps) {
  const [phase, setPhase] = useState<'heart' | 'text' | 'burst'>('heart');
  const { displayedText: greeting } = useTypingEffect('Hey ' + name + '...', 80, 1000);
  const { displayedText: message } = useTypingEffect('I have something special for you 💖', 60, greeting.length > 0 ? 2500 : 10000);

  useEffect(() => {
    if (greeting === 'Hey ' + name + '...') {
      setPhase('text');
    }
  }, [greeting, name]);

  useEffect(() => {
    if (message === 'I have something special for you 💖') {
      const timer = setTimeout(() => {
        setPhase('burst');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (phase === 'burst') {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  // Generate burst hearts
  const burstHearts = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    angle: (360 / 30) * i,
    delay: i * 0.05,
  }));

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Glowing Heart */}
      {phase === 'heart' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute"
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(236, 72, 153, 0.6))',
                'drop-shadow(0 0 40px rgba(236, 72, 153, 0.8))',
                'drop-shadow(0 0 20px rgba(236, 72, 153, 0.6))',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-8xl"
          >
            ❤️
          </motion.div>
        </motion.div>
      )}

      {/* Typing Text */}
      {phase === 'text' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute text-center"
        >
          <div className="text-5xl font-bold text-white mb-8 font-display">
            {greeting}
          </div>
          <div className="text-2xl text-pink-300 font-light">
            {message}
          </div>
        </motion.div>
      )}

      {/* Burst Hearts */}
      {phase === 'burst' &&
        burstHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: Math.cos((heart.angle * Math.PI) / 180) * 300,
              y: Math.sin((heart.angle * Math.PI) / 180) * 300,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 2,
              delay: heart.delay,
              ease: 'easeOut',
            }}
            className="absolute text-4xl"
          >
            ❤️
          </motion.div>
        ))}
    </div>
  );
}
