'use client';

import React, { useState } from 'react';
import { Room, TimeSlot, SelectedSlot } from './types';

interface ScheduleGridProps {
  rooms: Room[];
  timeSlots: Omit<TimeSlot, 'status'>[];
  schedules: Record<string, Record<string, 'available' | 'booked' | 'expired'>>;
  isBookingMode: boolean;
  selectedSlots: SelectedSlot[];
  onToggleSlot: (slot: SelectedSlot) => void;
}

export default function ScheduleGrid({
  rooms,
  timeSlots,
  schedules,
  isBookingMode,
  selectedSlots,
  onToggleSlot,
}: ScheduleGridProps) {
  // Mobile filter state: 'all' | 'small' | 'large'
  const [filterType, setFilterType] = useState<'all' | 'small' | 'large'>('all');

  const filteredRooms = rooms.filter((r) => {
    if (filterType === 'small') return r.type === 'small';
    if (filterType === 'large') return r.type === 'large';
    return true;
  });

  const isSlotSelected = (roomId: string, slotId: string) => {
    return selectedSlots.some((s) => s.roomId === roomId && s.slotId === slotId);
  };

  return (
    <div className="w-full space-y-4">
      {/* Mobile Room Type Quick Filters */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setFilterType('all')}
            className={`btn-micro px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'all'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            ทั้งหมด (5)
          </button>
          <button
            onClick={() => setFilterType('small')}
            className={`btn-micro px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'small'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            ห้องเล็ก (Max 7)
          </button>
          <button
            onClick={() => setFilterType('large')}
            className={`btn-micro px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'large'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            ห้องใหญ่ (Max 12)
          </button>
        </div>

        <div className="hidden sm:block text-xs text-pink-200/80 font-medium">
          💡 สไลด์แนวนอนเพื่อดูเวลาทั้งหมด
        </div>
      </div>

      {/* Main Interactive Grid Container */}
      <div className="glass-card rounded-2xl p-2 sm:p-4 border border-white/20 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-white/15">
                {/* Fixed Left Header for Room Name */}
                <th className="p-3 text-left w-44 sticky left-0 z-20 bg-gray-950/80 backdrop-blur-md rounded-tl-xl">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    ห้อง / เวลา
                  </div>
                  <div className="text-sm font-bold text-white"> Haekpak Rooms</div>
                </th>

                {/* Time Slot Columns */}
                {timeSlots.map((slot) => (
                  <th
                    key={slot.id}
                    className="p-2 text-center min-w-[100px] border-l border-white/10"
                  >
                    <div className="text-xs font-bold text-pink-300 bg-pink-950/40 px-2 py-1 rounded-lg border border-pink-500/30">
                      {slot.timeLabel}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors group"
                >
                  {/* Sticky Room Info Cell */}
                  <td className="p-3 sticky left-0 z-10 bg-gray-950/90 backdrop-blur-md border-r border-white/10 shadow-lg">
                    <div className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{room.type === 'small' ? '🎤' : '🎉'}</span>
                      <span className="truncate">{room.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                        {room.badgeText}
                      </span>
                      <span className="text-xs font-bold text-pink-400">
                        ฿{room.pricePerHour}/ชม.
                      </span>
                    </div>
                  </td>

                  {/* Time Cells */}
                  {timeSlots.map((slot) => {
                    const status = schedules[room.id]?.[slot.id] || 'available';
                    const selected = isSlotSelected(room.id, slot.id);

                    // Slot Styling Decisions
                    let slotStyle = '';
                    let statusLabel = '';
                    let isClickable = false;

                    if (status === 'booked') {
                      slotStyle =
                        'bg-red-950/40 border-red-500/30 text-red-400 cursor-not-allowed opacity-80';
                      statusLabel = 'จองแล้ว';
                    } else if (status === 'expired') {
                      slotStyle =
                        'bg-gray-900/50 border-gray-700/30 text-gray-500 cursor-not-allowed opacity-60';
                      statusLabel = 'หมดเวลา';
                    } else if (selected) {
                      slotStyle =
                        'bg-pink-600/90 border-pink-300 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.9)] scale-[1.03] ring-2 ring-pink-300 animate-pulse';
                      statusLabel = '✓ เลือกแล้ว';
                      isClickable = true;
                    } else if (isBookingMode) {
                      slotStyle =
                        'animate-neon-pulse cursor-pointer text-pink-100 font-semibold border-pink-400 hover:scale-105';
                      statusLabel = 'ว่าง (แตะจอง)';
                      isClickable = true;
                    } else {
                      // Standard Available Slot
                      slotStyle =
                        'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400 cursor-pointer hover:scale-105';
                      statusLabel = 'ว่าง';
                      isClickable = true;
                    }

                    return (
                      <td key={slot.id} className="p-1.5 text-center">
                        <button
                          disabled={!isClickable}
                          onClick={() => {
                            if (isClickable) {
                              onToggleSlot({
                                roomId: room.id,
                                roomName: room.name,
                                roomType: room.type,
                                slotId: slot.id,
                                timeLabel: slot.timeLabel,
                                price: room.pricePerHour,
                              });
                            }
                          }}
                          className={`btn-micro w-full h-13 rounded-xl p-1.5 flex flex-col items-center justify-center border text-xs transition-all duration-200 ${slotStyle}`}
                        >
                          <span className="font-bold text-xs">{slot.timeLabel}</span>
                          <span className="text-[10px] mt-0.5 tracking-wide">
                            {statusLabel}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="glass-card rounded-xl p-3 flex flex-wrap items-center justify-around gap-3 text-xs text-gray-200 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-emerald-500/30 border border-emerald-400" />
          <span>ว่าง (Available)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-pink-600 border border-pink-300 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
          <span>ที่คุณเลือก (Selected)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-red-950/60 border border-red-500/40" />
          <span>มีผู้จองแล้ว (Booked)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-gray-800/80 border border-gray-600" />
          <span>หมดเวลา (Expired)</span>
        </div>
      </div>
    </div>
  );
}
