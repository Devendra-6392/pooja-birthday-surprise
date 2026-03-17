import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScratchCardProps {
  message?: string;
  onReveal?: () => void;
}

export default function ScratchCard({ message, onReveal }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);

  // prettier love notes
  const loveNotes = [
    "You make my heart smile every single day.",
    "With you, simple moments feel like magic.",
    "I love how you laugh — it lights up everything.",
    "Every day with you is my favorite day.",
    "You are my safe place and my adventure all at once.",
    "I fall in love with you in new ways, always.",
    "Thank you for being wonderfully, perfectly you.",
    "Your kindness is my favorite kind of beautiful.",
    "I keep choosing you — today and always.",
    "You are my person, my home, my heart.",
    "Like a favorite song, you stay in my head and warm my soul.",
    "When I count my blessings, I count you twice.",
    "Your hand in mine makes the ordinary feel eternal.",
    "You are the spark that makes all my colors brighter.",
    "If love were a garden, you'd be every bloom.",
    "I love the small ways you show you care — they mean everything.",
  ];

  const chosenMessage = message ?? loveNotes[Math.floor(Math.random() * loveNotes.length)];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = container.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Draw shiny scratch surface
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#f472b6');
    grad.addColorStop(1, '#fb7185');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // soft noise texture
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 200; i++) {
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 3, Math.random() * 3);
    }

    // instruction text
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '600 18px Poppins, system-ui, -apple-system, "Segoe UI", Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to reveal a love note ✨', rect.width / 2, rect.height / 2);

    // set composite mode for erasing
    ctx.globalCompositeOperation = 'destination-out';

    const pointerDown = { down: false };

    const drawErase = (x: number, y: number) => {
      const radius = 26;
      const grd = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
      grd.addColorStop(0, 'rgba(0,0,0,0.8)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd as unknown as string;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e instanceof TouchEvent) {
        return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
      }
      const me = e as MouseEvent;
      return { x: me.clientX - r.left, y: me.clientY - r.top };
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (isRevealed) return;
      if ((e as MouseEvent).buttons === 0 && !(e instanceof TouchEvent) && !pointerDown.down) return;
      const p = getPos(e);
      drawErase(p.x, p.y);

      // check reveal percentage
      const imageData = ctx.getImageData(0, 0, rect.width, rect.height);
      const data = imageData.data;
      let clear = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 128) clear++;
      }
      const pct = (clear / (rect.width * rect.height)) * 100;
      if (pct > 30) {
        setIsRevealed(true);
        onReveal?.();
        // spawn hearts
        setHearts(Array.from({ length: 14 }, (_, i) => i));
      }
    };

    const handleDown = () => (pointerDown.down = true);
    const handleUp = () => (pointerDown.down = false);

    // events
    canvas.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    canvas.addEventListener('mousemove', handleMove as any);
    canvas.addEventListener('touchstart', handleDown as any, { passive: true });
    canvas.addEventListener('touchmove', handleMove as any, { passive: true });
    window.addEventListener('touchend', handleUp as any);

    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('mousemove', handleMove as any);
      canvas.removeEventListener('touchstart', handleDown as any);
      canvas.removeEventListener('touchmove', handleMove as any);
      window.removeEventListener('touchend', handleUp as any);
    };
  }, [isRevealed, onReveal]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden"
          onClick={() => {
            if (!isRevealed) {
              setIsRevealed(true);
              onReveal?.();
              setHearts(Array.from({ length: 14 }, (_, i) => i));
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isRevealed) {
              setIsRevealed(true);
              onReveal?.();
              setHearts(Array.from({ length: 14 }, (_, i) => i));
            }
          }}
        >
          {/* Hidden message beneath the scratch surface */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center p-6 z-0">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={isRevealed ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center px-4"
              aria-live="polite"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600">
                {chosenMessage}
              </p>
            </motion.div>
          </div>

          {/* Scratch surface (canvas) */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              className="w-full h-48 rounded-2xl cursor-pointer relative z-10 block"
            />
          )}

          {/* heart confetti */}
          {isRevealed && (
            <div className="pointer-events-none absolute inset-0 z-20">
              {hearts.map((h) => {
                const left = Math.round(8 + (h * 73) % 84);
                const delay = (h % 6) * 0.08;
                return (
                  <motion.span
                    key={h}
                    initial={{ y: -10, opacity: 0, scale: 0.6 }}
                    animate={{ y: [0, -40, 120], opacity: [1, 1, 0], scale: [1, 1.1, 0.8] }}
                    transition={{ duration: 1.6, delay }}
                    style={{ left: `${left}%` }}
                    className="absolute text-2xl md:text-3xl"
                  >
                    ❤️
                  </motion.span>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
