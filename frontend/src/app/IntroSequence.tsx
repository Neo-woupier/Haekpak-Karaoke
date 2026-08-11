'use client';

import React, { useEffect, useState } from 'react';

interface IntroSequenceProps {
  onComplete: () => void;
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  // States: 'zooming' -> 'holding' -> 'fading' -> 'done'
  const [animStage, setAnimStage] = useState<'zooming' | 'holding' | 'fading' | 'done'>('zooming');

  useEffect(() => {
    // 0.0s - 0.25s: Zoom-in
    const holdTimer = setTimeout(() => {
      setAnimStage('holding');
    }, 250);

    // 0.25s + 0.75s = 1.0s: Hold finishes, start fade out
    const fadeTimer = setTimeout(() => {
      setAnimStage('fading');
    }, 1000);

    // 1.0s + 0.3s = 1.3s: Complete transition
    const doneTimer = setTimeout(() => {
      setAnimStage('done');
      onComplete();
    }, 1300);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (animStage === 'done') return null;

  return (
    // แก้ z-100 -> z-[100]
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300">
      <div
        className={`relative z-10 text-center p-6 md:p-8 rounded-3xl glass-card border border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.3)] max-w-md mx-4 transition-all duration-300 ease-out transform ${
          animStage === 'zooming'
            ? 'animate-zoom-in'
            : animStage === 'fading'
            ? 'animate-fade-out opacity-0'
            : 'scale-100 opacity-100'
        }`}
      >
        <div className="inline-block px-3 py-1 mb-3 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-semibold uppercase tracking-wider animate-pulse">
          🎤 Welcome to Premium Karaoke
        </div>

        {/* แก้พิมพ์ผิด bg-gradiernt-to- -> bg-gradient-to-r */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 drop-shadow-[0_4px_16px_rgba(236,72,153,0.8)]">
          HAEKPAK KARAOKE
        </h1>

        <p className="mt-3 text-base sm:text-lg font-medium text-pink-100/90 drop-shadow-md">
          ระบบจองห้องคาราโอเกะออนไลน์
        </p>

        {/* Decorative glowing lines */}
        <div className="mt-4 flex justify-center items-center gap-2">
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-pink-500 rounded-full" />
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-pink-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}