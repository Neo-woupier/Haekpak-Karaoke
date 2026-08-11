// frontend/src/app/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import IntroSequence from './IntroSequence';
import SkeletonGrid from './SkeletonGrid';
import ScheduleGrid from './ScheduleGrid';
import BottomDrawerSummary from './BottomDrawerSummary';
import CheckoutModal from './CheckoutModal';
import SuccessPassModal from './SuccessPassModal';
import { createClient } from '@/utils/supabase/client';
import { GENERATE_TIME_SLOTS } from './mockData';
import { Room, SelectedSlot, BookingReceipt } from './types';

export default function Home() {
  // App States
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<BookingReceipt | null>(null);

  // Supabase Data States
  const [rooms, setRooms] = useState<Room[]>([]);
  const [schedules, setSchedules] = useState<
    Record<string, Record<string, 'available' | 'booked' | 'expired'>>
  >({});

  const timeSlots = GENERATE_TIME_SLOTS();

  // ดึงข้อมูลจริงจาก Supabase เมื่อหน้าเว็บโหลด
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const supabase = createClient();

      // ดึงวันที่ปัจจุบันตามเวลาไทย (UTC+7 / Asia/Bangkok) รูปแบบ YYYY-MM-DD
      const todayStr = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Bangkok',
      });

      // 1. ดึงรายชื่อห้องทั้งหมด
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('id', { ascending: true });

      // 2. ดึงสล็อตเวลาที่ถูกจองแล้วเฉพาะของวันนี้ (เวลาไทย)
      const { data: slotsData, error: slotsError } = await supabase
        .from('booked_slots')
        .select('room_id, slot_id')
        .eq('booking_date', todayStr);

      if (roomsError) console.error('Error fetching rooms:', roomsError);
      if (slotsError) console.error('Error fetching slots:', slotsError);

      // แปลงข้อมูลสล็อตที่จองแล้วให้อยู่ในโครงสร้าง { 'room-1': { 'slot-1500': 'booked' } }
      const formattedSchedules: Record<
        string,
        Record<string, 'available' | 'booked' | 'expired'>
      > = {};

      if (slotsData) {
        slotsData.forEach((item) => {
          if (!formattedSchedules[item.room_id]) {
            formattedSchedules[item.room_id] = {};
          }
          formattedSchedules[item.room_id][item.slot_id] = 'booked';
        });
      }

      if (roomsData) {
        const formattedRooms: Room[] = roomsData.map((room) => ({
          ...room,
          pricePerHour: Number(room.price_per_hour || 0),
          badgeText:
            room.badge_text ||
            (room.capacity ? `สูงสุด ${room.capacity} คน` : '4-6 คน'),
        }));

        setRooms(formattedRooms);
      }

      setSchedules(formattedSchedules);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Handle Slot Selection Toggle
  const handleToggleSlot = (slot: SelectedSlot) => {
    setSelectedSlots((prev) => {
      const exists = prev.some(
        (item) => item.roomId === slot.roomId && item.slotId === slot.slotId
      );
      if (exists) {
        return prev.filter(
          (item) => !(item.roomId === slot.roomId && item.slotId === slot.slotId)
        );
      } else {
        return [...prev, slot];
      }
    });
  };

  // Handle Completed Booking
  const handleConfirmBooking = (receipt: BookingReceipt) => {
    setSchedules((prev) => {
      const next = { ...prev };
      receipt.selectedSlots.forEach((s) => {
        if (!next[s.roomId]) next[s.roomId] = {};
        next[s.roomId][s.slotId] = 'booked';
      });
      return next;
    });

    setShowCheckout(false);
    setSelectedSlots([]);
    setIsBookingMode(false);
    setCompletedReceipt(receipt);
  };

  return (
    <main className="relative min-h-screen text-white bg-gray-950 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden pb-32">
      {/* Dynamic Background GIF Container */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 filter brightness-90 transition-all duration-700"
        style={{ backgroundImage: "url('/catsing.gif')" }}
      />

      {/* Semi-Transparent Dark Glass Overlay */}
      <div className="fixed inset-0 bg-black/55 backdrop-blur-[2px] -z-10" />

      {/* Initial Intro Sequence Component */}
      {showIntro && (
        <IntroSequence onComplete={() => setShowIntro(false)} />
      )}

      {/* Main Page Layout Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Header Bar */}
        <header className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold text-pink-300 uppercase tracking-widest bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                Online Karaoke Booking
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text from-pink-400 via-purple-300 to-cyan-400 drop-shadow-[0_2px_10px_rgba(236,72,153,0.5)]">
              HAEKPAK KARAOKE
            </h1>
            <p className="text-xs text-gray-300">
              จองห้องคาราโอเกะง่ายๆ ผ่านมือถือ | เปิดบริการ 13:30 - 23:30 น.
            </p>
          </div>

          {/* Action Buttons Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookingMode((prev) => !prev)}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md ${
                isBookingMode
                  ? 'bg-pink-600 text-white shadow-[0_0_25px_rgba(236,72,153,0.9)] ring-2 ring-pink-300 animate-pulse'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:scale-105'
              }`}
            >
              <span>
                {isBookingMode ? '✖ ยกเลิกโหมดเลือก' : '🎤 จองห้อง (Book Room)'}
              </span>
            </button>
          </div>
        </header>

        {/* Booking Mode Active Notification Banner */}
        {isBookingMode && (
          <div className="glass-card rounded-xl p-3 border border-pink-400/60 bg-pink-950/40 text-pink-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 animate-zoom-in">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-400 animate-ping" />
              <span>✨ โหมดเลือกห้องทำงานอยู่: แตะที่ช่วงเวลาที่เปล่งแสงเพื่อเลือกจอง</span>
            </div>
            <span className="text-xs text-pink-300 underline font-normal hidden sm:inline">
              (เลือกได้มากกว่า 1 ช่วงเวลา)
            </span>
          </div>
        )}

        {/* Schedule Grid / Skeleton Loader */}
        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <ScheduleGrid
            rooms={rooms}
            timeSlots={timeSlots}
            schedules={schedules}
            isBookingMode={isBookingMode}
            selectedSlots={selectedSlots}
            onToggleSlot={handleToggleSlot}
          />
        )}
      </div>

      {/* Bottom Drawer Summary Component */}
      <BottomDrawerSummary
        selectedSlots={selectedSlots}
        onClearSelection={() => setSelectedSlots([])}
        onProceedCheckout={() => setShowCheckout(true)}
      />

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          selectedSlots={selectedSlots}
          onClose={() => setShowCheckout(false)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Success Digital Pass Ticket Modal */}
      {completedReceipt && (
        <SuccessPassModal
          receipt={completedReceipt}
          onDone={() => setCompletedReceipt(null)}
        />
      )}
    </main>
  );
}
