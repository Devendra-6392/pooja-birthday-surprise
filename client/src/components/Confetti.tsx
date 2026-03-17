import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger?: boolean;
}

export default function Confetti({ trigger = true }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    // Confetti burst
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 50,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#ec4899', '#f43f5e', '#fbbf24', '#60a5fa', '#a78bfa'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [trigger]);

  return null;
}
