'use client';

import React from 'react';

export default function SkeletonGrid() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 p-2 sm:p-4">
      {/* Skeleton Top Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
          <div className="h-6 w-48 rounded-lg skeleton-shimmer mx-auto sm:mx-0" />
          <div className="h-4 w-32 rounded-md skeleton-shimmer mx-auto sm:mx-0" />
        </div>
        <div className="h-10 w-32 rounded-xl skeleton-shimmer" />
      </div>

      {/* Skeleton Legend */}
      <div className="glass-card rounded-xl p-3 flex justify-around items-center gap-2">
        <div className="h-5 w-20 rounded skeleton-shimmer" />
        <div className="h-5 w-20 rounded skeleton-shimmer" />
        <div className="h-5 w-20 rounded skeleton-shimmer" />
      </div>

      {/* Skeleton Grid Table */}
      <div className="glass-card rounded-2xl p-4 space-y-3 overflow-hidden">
        {/* Header time row skeleton */}
        <div className="grid grid-cols-6 gap-2">
          <div className="h-8 rounded-lg skeleton-shimmer col-span-2 sm:col-span-1" />
          <div className="h-8 rounded-lg skeleton-shimmer hidden sm:block" />
          <div className="h-8 rounded-lg skeleton-shimmer hidden sm:block" />
          <div className="h-8 rounded-lg skeleton-shimmer hidden sm:block" />
          <div className="h-8 rounded-lg skeleton-shimmer hidden sm:block" />
          <div className="h-8 rounded-lg skeleton-shimmer" />
        </div>

        {/* Room rows skeletons */}
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="grid grid-cols-6 gap-2 items-center">
            <div className="h-14 rounded-xl skeleton-shimmer col-span-2 sm:col-span-1" />
            <div className="h-14 rounded-xl skeleton-shimmer hidden sm:block" />
            <div className="h-14 rounded-xl skeleton-shimmer hidden sm:block" />
            <div className="h-14 rounded-xl skeleton-shimmer hidden sm:block" />
            <div className="h-14 rounded-xl skeleton-shimmer hidden sm:block" />
            <div className="h-14 rounded-xl skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
