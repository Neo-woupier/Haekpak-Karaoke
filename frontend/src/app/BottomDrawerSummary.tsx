// frontend/src/app/BottomDrawerSummary.tsx

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

  // คำนวณราคารวม
  const totalPrice = selectedSlots.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl animate-slide-up">
      <div className="glass-card rounded-2xl p-4 border border-pink-500/50 bg-gray-950/95 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* รายละเอียดห้องและเวลาที่เลือกด้านซ้าย */}
        <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="bg-pink-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-md">
              {selectedSlots.length} ช่วงเวลา
            </span>
            <button
              onClick={onClearSelection}
              className="text-xs text-gray-400 hover:text-pink-300 underline cursor-pointer transition-colors"
            >
              ล้างการเลือก
            </button>
          </div>

          {/* ชิปแสดงรายการสล็อตที่เลือก */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 max-h-16 overflow-y-auto custom-scrollbar">
            {selectedSlots.map((slot, index) => (
              <span
                key={`${slot.roomId}-${slot.slotId}-${index}`}
                className="text-[11px] bg-pink-950/60 text-pink-200 border border-pink-500/30 px-2 py-0.5 rounded-md backdrop-blur-sm"
              >
                {slot.roomName} ({slot.timeLabel})
              </span>
            ))}
          </div>

          <div className="text-xs text-gray-300 font-medium">
            ราคารวม: <span className="text-pink-400 font-bold text-sm">฿{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* ปุ่มยืนยันการเลือก (ปรับสีให้ทึบแน่น เรืองแสงเด่นชัด) */}
        <button
          onClick={onProceedCheckout}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 shadow-[0_0_30px_rgba(236,72,153,0.8)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-white/30 shrink-0"
        >
          <span>ยืนยันการเลือก (มัดจำ 50%)</span>
          <span className="text-lg">➔</span>
        </button>
      </div>
    </div>
  );
}