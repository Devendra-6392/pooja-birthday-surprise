import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Card {
  id: string;
  content: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HeartMatch({ onComplete }: { onComplete?: () => void }) {
  const phrases = [
    'You + Me',
    'Forever',
    'My Favorite',
    'Soulmate',
    'Always Yours',
    'Best Part of Me',
  ];

  const makeDeck = (): Card[] => {
    const pairs = phrases.flatMap((p) => [p, p]);
    return shuffle(
      pairs.map((content, i) => ({ id: `${i}-${content}`, content, flipped: false, matched: false }))
    );
  };

  const [cards, setCards] = useState<Card[]>(makeDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const totalPairs = phrases.length;

  useEffect(() => {
    if (selected.length === 2) {
      const [a, b] = selected;
      if (cards[a].content === cards[b].content) {
        // match
        setTimeout(() => {
          setCards((prev) => {
            const next = prev.slice();
            next[a] = { ...next[a], matched: true };
            next[b] = { ...next[b], matched: true };
            return next;
          });
          setSelected([]);
        }, 350);
      } else {
        // flip back
        setTimeout(() => {
          setCards((prev) => {
            const next = prev.slice();
            next[a] = { ...next[a], flipped: false };
            next[b] = { ...next[b], flipped: false };
            return next;
          });
          setSelected([]);
        }, 700);
      }
      setMoves((m) => m + 1);
    }
  }, [selected, cards]);

  useEffect(() => {
    const matchedCount = cards.filter((c) => c.matched).length / 2;
    if (matchedCount === totalPairs) {
      setWon(true);
      onComplete?.();
    }
  }, [cards, onComplete]);

  const handleClick = (index: number) => {
    if (won) return;
    setCards((prev) => {
      const next = prev.slice();
      if (next[index].flipped || next[index].matched) return prev;
      next[index] = { ...next[index], flipped: true };
      return next;
    });
    setSelected((s) => (s.length === 2 ? [index] : [...s, index]));
  };

  const restart = () => {
    setCards(makeDeck());
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-pink-700">Heart Match</h3>
        <div className="text-sm text-pink-600">Moves: {moves}</div>
      </div>

      <p className="text-sm text-pink-500 mb-4">Find matching pairs — each pair hides a tiny love message 💌</p>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <motion.button
            key={card.id}
            onClick={() => handleClick(i)}
            whileTap={{ scale: 0.96 }}
            className="relative w-full pb-[100%] rounded-lg perspective"
            aria-label={card.flipped || card.matched ? `Card: ${card.content}` : 'Hidden card'}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-lg shadow-md bg-white"
              animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
              transition={{ duration: 0.45 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* front (hidden) */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-400 to-red-400 text-white font-bold"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                💖
              </div>

              {/* back (content) */}
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-lg p-2 text-center text-sm text-pink-800 bg-white`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {card.content}
              </div>
            </motion.div>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={restart} className="px-4 py-2 bg-pink-500 text-white rounded-full shadow-sm">
          Restart
        </button>
        {won && (
          <div className="text-right">
            <div className="text-sm font-semibold text-pink-700">You found all the hearts! 🎉</div>
            <div className="text-xs text-pink-500">Surprise: A sweet kiss awaits 💋</div>
          </div>
        )}
      </div>
    </div>
  );
}
