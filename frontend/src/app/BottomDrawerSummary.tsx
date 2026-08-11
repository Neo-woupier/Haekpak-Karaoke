'use client';

import React from 'react';
import { SelectedSlot } from './types';

interface BottomDrawerSummaryProps {
  selectedSlots: SelectedSlot[];
  onClearSelection: () => void;
  onProceedCheckout: () => void;
}

export default function BottomDrawerSummary({
  selectedSlots,
  onClearSelection,
  onProceedCheckout,
}: BottomDrawerSummaryProps) {
  if (selectedSlots.length === 0) return null;

  const totalAmount = selectedSlots.reduce((sum, item) => sum + item.price, 0);
  const depositAmount = totalAmount * 0.5; // 50% deposit calculation

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4  from-black/90 via-black/70 to-transparent backdrop-blur-xl border-t border-pink-500/30 transition-all duration-300 animate-zoom-in">
      <div className="max-w-4xl mx-auto glass-card rounded-2xl p-4 border border-pink-500/40 shadow-[0_-10px_35px_rgba(236,72,153,0.3)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Selected Summary Info */}
          <div className="w-full sm:w-auto space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500 text-white shadow-md">
                {selectedSlots.length} ช่วงเวลา
              </span>
              <button
                onClick={onClearSelection}
                className="text-xs text-gray-400 hover:text-pink-300 underline btn-micro"
              >
                ล้างการเลือก
              </button>
            </div>

            {/* List selected slots badges */}
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto py-1">
              {selectedSlots.map((slot, i) => (
                <span
                  key={`${slot.roomId}-${slot.slotId}-${i}`}
                  className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-pink-200"
                >
                  {slot.roomName} ({slot.timeLabel})
                </span>
              ))}
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <div className="text-xs text-gray-300">
                ราคารวม: <span className="text-sm font-semibold text-white">฿{totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-sm font-black text-transparent bg-clip-text  from-pink-400 to-cyan-300">
                มัดจำ 50%: ฿{depositAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onProceedCheckout}
            className="btn-micro w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-sm text-white  from-pink-500 via-purple-600 to-cyan-500 shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:shadow-[0_0_35px_rgba(236,72,153,0.9)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ยืนยันการเลือก (มัดจำ 50%)</span>
            <span className="text-lg">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
