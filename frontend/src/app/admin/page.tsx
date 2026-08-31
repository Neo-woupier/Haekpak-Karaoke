'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface BookingRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  deposit_amount: number;
  remaining_amount: number;
  payment_slip_url: string | null;
  payment_status: string;
  booking_date: string | null;
  created_at: string;
}

const ADMIN_PASSWORD = '1234';

export default function AdminPage() {
  // Password Gate State (React state only, not persisted)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Data States
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Search/Filter state for admin convenience
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Password Submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setPasswordError('');
      setIsUnlocked(true);
    } else {
      setPasswordError('รหัสผ่านไม่ถูกต้อง');
    }
  };

  // Fetch real data from Supabase once unlocked
  const fetchBookings = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        setFetchError('ไม่สามารถโหลดข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง');
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setFetchError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchBookings();
    }
  }, [isUnlocked]);

  // Format Helpers
  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '฿0';
    return `฿${Number(val).toLocaleString()}`;
  };

  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('th-TH', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateOnly = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('th-TH', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED_DEPOSIT' || s === 'PAID_DEPOSIT') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          มัดจำแล้ว 50%
        </span>
      );
    }
    if (s === 'PAID' || s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          ชำระครบแล้ว
        </span>
      );
    }
    if (s === 'CANCELLED' || s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/40">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          ยกเลิก
        </span>
      );
    }
    // Default / PENDING
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/40">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        {status || 'รอดำเนินการ'}
      </span>
    );
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
      (b.customer_phone && b.customer_phone.includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q))
    );
  });

  // Calculate quick stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
  const totalDeposit = bookings.reduce((sum, b) => sum + (Number(b.deposit_amount) || 0), 0);

  return (
    <main className="relative min-h-screen text-white bg-gray-950 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden pb-20">
      {/* Background GIF Container matching main app */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 filter brightness-90 transition-all duration-700"
        style={{ backgroundImage: "url('/catsing.gif')" }}
      />

      {/* Semi-Transparent Dark Glass Overlay */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-[3px] -z-10" />

      {/* ---------------------------------------------------- */}
      {/* PASSWORD GATE SCREEN (If not unlocked yet) */}
      {/* ---------------------------------------------------- */}
      {!isUnlocked ? (
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md glass-modal rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl backdrop-blur-2xl text-center space-y-6 animate-zoom-in">
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/30 border border-pink-400/40 text-pink-300 text-3xl flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(236,72,153,0.3)]">
              🔒
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text from-pink-400 via-purple-300 to-cyan-400 drop-shadow-[0_2px_10px_rgba(236,72,153,0.4)]">
                เข้าสู่ระบบแอดมิน
              </h1>
              <p className="text-xs text-gray-300">
                กรุณากรอกรหัสผ่านเพื่อเข้าสู่แดชบอร์ดตรวจสอบการจอง
              </p>
            </div>

            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  รหัสผ่านเข้าใช้งาน (Admin Password)
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="กรอกรหัสผ่าน..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-gray-400 outline-none transition-all duration-200"
                />
                {passwordError && (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5 font-medium animate-zoom-in">
                    <span>⚠️</span>
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn-micro w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] cursor-pointer transition-all duration-200"
              >
                เข้าสู่ระบบ (Login)
              </button>
            </form>

            <div className="pt-2 border-t border-white/10">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-300 transition-colors duration-200 py-1"
              >
                <span>←</span>
                <span>กลับสู่หน้าหลัก (Back to Home)</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ---------------------------------------------------- */
        /* ADMIN DASHBOARD (Unlocked view) */
        /* ---------------------------------------------------- */
        <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6">
          {/* Header Bar */}
          <header className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/20 shadow-2xl backdrop-blur-xl">
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Admin Dashboard
                </span>
                <span className="text-xs text-gray-400">| Read-Only</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text from-pink-400 via-purple-300 to-cyan-400 drop-shadow-[0_2px_10px_rgba(236,72,153,0.4)]">
                รายการจองห้องคาราโอเกะ
              </h1>
              <p className="text-xs text-gray-300">
                ระบบจัดการและตรวจสอบรายการจองทั้งหมด (Haekpak Karaoke)
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <button
                onClick={fetchBookings}
                disabled={isLoading}
                className="btn-micro px-3.5 py-2 rounded-xl text-xs font-semibold glass-card-light text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/20 cursor-pointer flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50"
              >
                <span className={isLoading ? 'animate-spin inline-block' : ''}>🔄</span>
                <span>รีเฟรชข้อมูล</span>
              </button>

              <Link
                href="/"
                className="btn-micro px-3.5 py-2 rounded-xl text-xs font-semibold glass-card-light text-gray-200 border border-white/20 hover:text-pink-300 hover:border-pink-400/40 transition-all duration-200 flex items-center gap-1.5"
              >
                <span>🏠</span>
                <span>หน้าหลัก</span>
              </Link>
            </div>
          </header>

          {/* Quick Metrics Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-white/15 space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">การจองทั้งหมด</span>
              <div className="text-xl sm:text-2xl font-black text-white">{bookings.length} รายการ</div>
            </div>
            <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-white/15 space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">ยอดรวมทั้งหมด</span>
              <div className="text-xl sm:text-2xl font-black text-pink-400">{formatCurrency(totalRevenue)}</div>
            </div>
            <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-white/15 space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">ยอดมัดจำที่รับแล้ว</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{formatCurrency(totalDeposit)}</div>
            </div>
            <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-white/15 space-y-1">
              <span className="text-[11px] text-gray-400 uppercase font-semibold">ยอดรอชำระหน้าร้าน</span>
              <div className="text-xl sm:text-2xl font-black text-cyan-400">{formatCurrency(totalRevenue - totalDeposit)}</div>
            </div>
          </div>

          {/* Search & Action Bar */}
          <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-white/15 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:w-80">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ค้นหาชื่อผู้จอง, เบอร์โทร..."
                  className="w-full pl-3.5 pr-8 py-2 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-gray-400 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✖
                  </button>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-300 self-end sm:self-center">
              แสดงผล <span className="font-bold text-pink-300">{filteredBookings.length}</span> จากทั้งหมด{' '}
              <span className="font-bold text-white">{bookings.length}</span> รายการ
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* SKELETON LOADING STATE */}
          {/* ---------------------------------------------------- */}
          {isLoading ? (
            <div className="space-y-4">
              {/* Skeleton cards simulating booking list */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-4 sm:p-5 border border-white/15 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="space-y-2">
                      <div className="h-5 w-44 rounded-lg skeleton-shimmer" />
                      <div className="h-4 w-32 rounded-md skeleton-shimmer" />
                    </div>
                    <div className="h-7 w-28 rounded-full skeleton-shimmer self-start" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="h-10 rounded-xl skeleton-shimmer" />
                    <div className="h-10 rounded-xl skeleton-shimmer" />
                    <div className="h-10 rounded-xl skeleton-shimmer" />
                    <div className="h-10 rounded-xl skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : fetchError ? (
            /* ---------------------------------------------------- */
            /* FETCH ERROR STATE */
            /* ---------------------------------------------------- */
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border border-rose-500/30 space-y-4 shadow-[0_0_40px_rgba(244,63,94,0.2)]">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 text-2xl flex items-center justify-center mx-auto border border-rose-500/30">
                ⚠️
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
                <p className="text-xs text-rose-300">{fetchError}</p>
              </div>
              <button
                onClick={fetchBookings}
                className="btn-micro px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md cursor-pointer"
              >
                ลองใหม่อีกครั้ง (Retry)
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            /* ---------------------------------------------------- */
            /* EMPTY STATE */
            /* ---------------------------------------------------- */
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center border border-white/15 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 text-gray-400 text-2xl flex items-center justify-center mx-auto border border-white/10">
                📋
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  {searchQuery ? 'ไม่พบรายการจองที่ตรงกับคำค้นหา' : 'ยังไม่มีรายการจองในระบบ'}
                </h3>
                <p className="text-xs text-gray-400">
                  {searchQuery
                    ? 'ลองค้นหาด้วยคำอื่น เช่น เบอร์โทรศัพท์ หรือชื่อผู้จอง'
                    : 'เมื่อมีลูกค้าทำการจองผ่านระบบ ข้อมูลจะปรากฏที่หน้านี้โดยอัตโนมัติ'}
                </p>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-micro px-4 py-2 rounded-xl text-xs font-semibold glass-card-light text-pink-300 border border-pink-400/30 hover:bg-pink-500/20 cursor-pointer"
                >
                  ล้างคำค้นหา
                </button>
              )}
            </div>
          ) : (
            /* ---------------------------------------------------- */
            /* REAL DATA BOOKINGS LIST */
            /* ---------------------------------------------------- */
            <div className="space-y-3.5">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="glass-card rounded-2xl p-4 sm:p-5 border border-white/15 hover:border-pink-500/40 transition-all duration-300 space-y-3.5"
                >
                  {/* Card Top Row: Customer info & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/10 pb-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 font-bold text-base shrink-0">
                        {booking.customer_name ? booking.customer_name.charAt(0).toUpperCase() : '👤'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white">
                            {booking.customer_name || 'ไม่ระบุชื่อ'}
                          </h3>
                          <span className="text-xs text-pink-300 font-semibold bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">
                            📞 {booking.customer_phone || '-'}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>รหัสการจอง: <span className="font-mono text-gray-300">#{booking.id.slice(0, 8)}</span></span>
                          <span>•</span>
                          <span>ทำรายการ: {formatDateTime(booking.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="self-start sm:self-auto">
                      {renderStatusBadge(booking.payment_status)}
                    </div>
                  </div>

                  {/* Card Middle Row: Financials & Booking Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                      <span className="text-[10px] text-gray-400 block font-medium">วันที่จอง (Booking Date)</span>
                      <span className="text-xs font-semibold text-gray-200 mt-0.5 block">
                        {booking.booking_date ? formatDateOnly(booking.booking_date) : formatDateOnly(booking.created_at)}
                      </span>
                    </div>

                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                      <span className="text-[10px] text-gray-400 block font-medium">ยอดรวมทั้งสิ้น</span>
                      <span className="text-xs font-bold text-white mt-0.5 block">
                        {formatCurrency(booking.total_amount)}
                      </span>
                    </div>

                    <div className="bg-emerald-500/10 rounded-xl p-2.5 border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-300 block font-medium">ยอดมัดจำ (50%)</span>
                      <span className="text-xs font-bold text-emerald-300 mt-0.5 block">
                        {formatCurrency(booking.deposit_amount)}
                      </span>
                    </div>

                    <div className="bg-pink-500/10 rounded-xl p-2.5 border border-pink-500/20">
                      <span className="text-[10px] text-pink-300 block font-medium">คงเหลือชำระหน้าร้าน</span>
                      <span className="text-xs font-bold text-pink-300 mt-0.5 block">
                        {formatCurrency(booking.remaining_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Row: Payment Slip Link/Thumbnail */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-[11px]">หลักฐานการโอนเงิน:</span>
                      {booking.payment_slip_url ? (
                        <a
                          href={booking.payment_slip_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 hover:border-pink-400 transition-all duration-200 group"
                        >
                          {/* Mini Slip Thumbnail if image */}
                          <span className="text-sm">🧾</span>
                          <span className="font-semibold text-xs underline group-hover:text-pink-200">
                            ดูสลิปการโอนเงิน (คลิกเพื่อเปิด)
                          </span>
                          <span className="text-[10px] text-pink-400">↗</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">ไม่มีการแนบสลิป</span>
                      )}
                    </div>

                    {booking.payment_slip_url && (
                      <a
                        href={booking.payment_slip_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-gray-400 hover:text-cyan-300 underline transition-colors"
                      >
                        เปิดรูปในแท็บใหม่
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
