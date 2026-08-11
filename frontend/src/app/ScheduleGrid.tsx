// frontend/src/app/ScheduleGrid.tsx

'use client';

import React, { useState, useRef } from 'react';
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

  // Task 1: Left column collapse state (Default: false = Expanded on initial page load)
  const [isColumnCollapsed, setIsColumnCollapsed] = useState(false);

  // Ref และ State สำหรับระบบ Mouse Drag Scroll ตารางซ้าย-ขวา
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 🟢 ฟังก์ชันเช็กสล็อตหมดเวลาตามเวลาไทย (UTC+7 / Asia/Bangkok)
  const isSlotExpiredByTime = (timeLabel: string) => {
    const startTimeStr = timeLabel.split(' - ')[0]; // เช่น "13:30"
    if (!startTimeStr) return false;

    const now = new Date();
    const bangkokTimeString = now.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Bangkok',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    }); // ได้เวลาไทยปัจจุบัน เช่น "14:15"

    const [currHours, currMins] = bangkokTimeString.split(':').map(Number);
    const currentTotalMinutes = currHours * 60 + currMins;

    const [slotHours, slotMins] = startTimeStr.split(':').map(Number);
    const slotTotalMinutes = slotHours * 60 + slotMins;

    // ถ้าเวลาปัจจุบันมากกว่าหรือเท่ากับเวลาเริ่มสล็อต ถือว่าหมดเวลาจอง
    return currentTotalMinutes >= slotTotalMinutes;
  };

  const filteredRooms = rooms.filter((r) => {
    if (filterType === 'small') return r.type === 'small';
    if (filterType === 'large') return r.type === 'large';
    return true;
  });

  const isSlotSelected = (roomId: string, slotId: string) => {
    return selectedSlots.some((s) => s.roomId === roomId && s.slotId === slotId);
  };

  // 🟢 เหตุการณ์สำหรับการลากตารางด้วยเมาส์
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - gridRef.current.offsetLeft);
    setScrollLeft(gridRef.current.scrollLeft);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    // หน่วงเวลาเล็กน้อยเพื่อป้องกันไม่ให้ Trigger onClick ขณะลาก
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !gridRef.current) return;
    e.preventDefault();
    const x = e.pageX - gridRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // ความเร็วในการเลื่อน
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    gridRef.current.scrollLeft = scrollLeft - walk;
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
            ทั้งหมด ({rooms.length})
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

        {/* Quick indicator button to collapse/expand room column */}
        <button
          onClick={() => setIsColumnCollapsed((prev) => !prev)}
          className="btn-micro flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-200 shadow-md"
        >
          <span>{isColumnCollapsed ? '▶ ขยายคอลัมน์' : '◀ ย่อคอลัมน์'}</span>
        </button>
      </div>

      {/* Main Interactive Grid Container */}
      <div className="glass-card rounded-2xl p-2 sm:p-4 border border-white/20 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* 🟢 เพิ่ม Event listeners สำหรับลากเมาส์เลื่อนตาราง */}
        <div
          ref={gridRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`overflow-x-auto pb-2 scrollbar-thin select-none ${
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-white/15">
                {/* Fixed Left Header for Room Name (Collapsible Width) */}
                <th
                  className={`p-2 sm:p-3 text-left sticky left-0 z-20 bg-gray-950/95 backdrop-blur-md rounded-tl-xl border-r border-white/15 transition-all duration-300 ease-in-out ${
                    isColumnCollapsed ? 'w-16 min-w-[64px]' : 'w-44 sm:w-48 min-w-[176px]'
                  }`}
                >
                  {isColumnCollapsed ? (
                    // Collapsed Header View
                    <div className="flex flex-col items-center justify-center gap-1 text-center py-0.5">
                      <span className="text-[11px] font-bold text-pink-300 uppercase">
                        ห้อง
                      </span>
                      <button
                        onClick={() => setIsColumnCollapsed(false)}
                        className="btn-micro p-1 rounded-lg bg-pink-500/30 hover:bg-pink-500/50 border border-pink-400/50 text-pink-200 hover:text-white transition-all shadow-md"
                        title="ขยายคอลัมน์ห้อง (Expand)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    // Expanded Header View (Default)
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <div className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          ห้อง / เวลา
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white truncate">
                          Haekpak Rooms
                        </div>
                      </div>
                      <button
                        onClick={() => setIsColumnCollapsed(true)}
                        className="btn-micro p-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/40 border border-pink-400/40 text-pink-300 hover:text-white transition-all shadow-md shrink-0"
                        title="ย่อคอลัมน์ห้อง (Collapse)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
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
              {filteredRooms.map((room, roomIdx) => {
                const badgeText =
                  room.badgeText ||
                  (room as any).badge_text ||
                  (room.capacity ? `สูงสุด ${room.capacity} คน` : '4-6 คน');

                const priceValue =
                  room.pricePerHour ||
                  (room as any).price_per_hour ||
                  (room as any).price ||
                  160;

                return (
                  <tr
                    key={room.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors group"
                  >
                    {/* Sticky Room Info Cell */}
                    <td
                      className={`p-2 sm:p-3 sticky left-0 z-10 bg-gray-950/95 backdrop-blur-md border-r border-white/15 shadow-lg transition-all duration-300 ease-in-out ${
                        isColumnCollapsed ? 'w-16 min-w-[64px]' : 'w-44 sm:w-48 min-w-[176px]'
                      }`}
                    >
                      {isColumnCollapsed ? (
                        // Collapsed Cell View (Icon + Short Room Number + Price)
                        <div className="flex flex-col items-center justify-center text-center py-1 space-y-1">
                          <span className="text-base">{room.type === 'small' ? '🎤' : '🎉'}</span>
                          <span className="text-[11px] font-extrabold text-white leading-tight">
                            R{roomIdx + 1}
                          </span>
                          <span className="text-[10px] font-bold text-pink-400">
                            ฿{priceValue}
                          </span>
                        </div>
                      ) : (
                        // Expanded Cell View (Full Room Title & Centered Capacity Badge)
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                            <span>{room.type === 'small' ? '🎤' : '🎉'}</span>
                            <span className="truncate">{room.name}</span>
                          </div>

                          {/* Task 2: Center-aligned capacity badge & price container */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 mt-2">
                            {/* Centered Capacity Badge */}
                            <div className="flex-1 flex items-center justify-center text-center px-2 py-1 rounded-full bg-white/10 text-gray-200 border border-white/15 shadow-inner">
                              <span className="text-[11px] font-semibold leading-none text-center w-full">
                                {badgeText}
                              </span>
                            </div>

                            {/* Price Badge */}
                            <span className="text-xs font-bold text-pink-400 text-center sm:text-right shrink-0">
                              ฿{priceValue}/ชม.
                            </span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Time Cells */}
                    {timeSlots.map((slot) => {
                      const statusInSchedule = schedules[room.id]?.[slot.id];
                      const expiredByTime = isSlotExpiredByTime(slot.timeLabel);

                      // คำนวณสถานะจริง
                      const isBooked = statusInSchedule === 'booked';
                      const isExpired =
                        statusInSchedule === 'expired' || expiredByTime;
                      const selected = isSlotSelected(room.id, slot.id);

                      // Slot Styling Decisions
                      let slotStyle = '';
                      let statusLabel = '';
                      let isClickable = false;

                      if (isBooked) {
                        slotStyle =
                          'bg-red-950/40 border-red-500/30 text-red-400 cursor-not-allowed opacity-80';
                        statusLabel = 'จองแล้ว';
                        isClickable = false;
                      } else if (isExpired) {
                        // 🟢 แสดงผลสล็อตหมดเวลา
                        slotStyle =
                          'bg-gray-900/60 border-gray-700/30 text-gray-500 cursor-not-allowed opacity-50';
                        statusLabel = 'หมดเวลา';
                        isClickable = false;
                      } else if (selected) {
                        slotStyle =
                          'bg-pink-600/90 border-pink-300 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.9)] scale-[1.03] ring-2 ring-pink-300 animate-pulse cursor-pointer';
                        statusLabel = '✓ เลือกแล้ว';
                        isClickable = true; // ให้คลิกยกเลิกการเลือกได้
                      } else if (isBookingMode) {
                        // 🟢 เมื่อเปิดโหมดจองเท่านั้น ถึงจะกดเลือกได้
                        slotStyle =
                          'animate-neon-pulse cursor-pointer text-pink-100 font-semibold border-pink-400 hover:scale-105';
                        statusLabel = 'ว่าง (แตะจอง)';
                        isClickable = true;
                      } else {
                        // 🟢 เมื่อไม่ได้เปิดโหมดจอง: ปรับเป็นโหมดดูอย่างเดียว (กดไม่ได้)
                        slotStyle =
                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400/60 cursor-not-allowed';
                        statusLabel = 'ว่าง';
                        isClickable = false; // บังคับให้กดไม่ได้จนกว่าจะเปิดโหมดจอง
                      }

                      return (
                        <td key={slot.id} className="p-1.5 text-center">
                          <button
                            disabled={!isClickable}
                            onClick={() => {
                              // 🟢 กดได้เฉพาะตอนเป็น isClickable และไม่ได้กำลังลากเมาส์
                              if (isClickable && !isDragging) {
                                onToggleSlot({
                                  roomId: room.id,
                                  roomName: room.name,
                                  roomType: room.type,
                                  slotId: slot.id,
                                  timeLabel: slot.timeLabel,
                                  price: Number(priceValue),
                                });
                              }
                            }}
                            className={`btn-micro w-full h-13 rounded-xl p-1.5 flex flex-col items-center justify-center border text-xs transition-all duration-200 ${slotStyle}`}
                          >
                            <span className="font-bold text-xs">
                              {slot.timeLabel}
                            </span>
                            <span className="text-[10px] mt-0.5 tracking-wide">
                              {statusLabel}
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
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