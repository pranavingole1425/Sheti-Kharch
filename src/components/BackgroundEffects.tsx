import React from 'react';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Ambient Soft Glowing Orbs */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-emerald-400/25 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-amber-300/30 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-lime-300/20 rounded-full blur-3xl animate-float-slow" />

      {/* 2. Farm Technical Dot Grid Matrix Overlay */}
      <div className="absolute inset-0 farm-grid-pattern opacity-10" />

      {/* 3. Subtle Floating Agricultural Leaf Particles */}
      <div className="absolute left-[10%] animate-particle-1 text-emerald-600/30 text-xl font-bold">
        🌱
      </div>
      <div className="absolute left-[35%] animate-particle-2 text-amber-600/30 text-2xl font-bold">
        🌾
      </div>
      <div className="absolute left-[65%] animate-particle-3 text-emerald-500/30 text-lg font-bold">
        🍃
      </div>
      <div className="absolute left-[88%] animate-particle-4 text-emerald-700/30 text-xl font-bold">
        🌱
      </div>
    </div>
  );
};
