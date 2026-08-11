'use client';

import React, { useState } from 'react';
import { SelectedSlot, CustomerInfo, BookingReceipt } from './types';
import { createClient } from '@/utils/supabase/client';

interface CheckoutModalProps {
  selectedSlots: SelectedSlot[];
  onClose: () => void;
  onConfirmBooking: (receipt: BookingReceipt) => void;
}

export default function CheckoutModal({
  selectedSlots,
  onClose,
  onConfirmBooking,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = selectedSlots.reduce((sum, item) => sum + (item.price || 0), 0);
  const depositAmount = totalAmount * 0.5; // 50% Deposit
  const remainingAmount = totalAmount - depositAmount;

  // PromptPay QR mock generator link with real-time deposit value
  // PromptPay ID for Haekpak Karaoke simulation: 0655507523
  const qrCodeUrl = `https://promptpay.io/0655507523/${depositAmount}.png`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMessage('กรุณากรอกชื่อผู้จอง');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMessage('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9-10 หลัก)');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // 1. บันทึกข้อมูลใบเสร็จลงตาราง bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            customer_name: customerName,
            customer_phone: phone,
            total_amount: totalAmount,
            deposit_amount: depositAmount,
            remaining_amount: remainingAmount,
            qr_code_url: qrCodeUrl,
            payment_status: 'COMPLETED_DEPOSIT',
          },
        ])
        .select()
        .single();

      if (bookingError) {
        console.error('Booking Error:', bookingError);
        setErrorMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูลการจอง');
        setIsSubmitting(false);
        return;
      }

      // 2. ล็อคสล็อตเวลาที่ถูกเลือกทั้งหมดลงตาราง booked_slots
      const slotsToInsert = selectedSlots.map((slot) => ({
        booking_id: bookingData.id,
        room_id: slot.roomId,
        slot_id: slot.slotId,
      }));

      const { error: slotsError } = await supabase
        .from('booked_slots')
        .insert(slotsToInsert);

      if (slotsError) {
        console.error('Slots Lock Error:', slotsError);
        setErrorMessage('เกิดข้อผิดพลาดในการล็อคสล็อตเวลา');
        setIsSubmitting(false);
        return;
      }

      // 3. ประกอบข้อมูลใบเสร็จส่งกลับไปยัง onConfirmBooking
      const receipt: BookingReceipt = {
        bookingId: bookingData.id.slice(0, 8).toUpperCase(), // ใช้ ID จริงจาก DB แบบย่อ
        createdAt: new Date(bookingData.created_at).toLocaleString('th-TH'),
        customer: {
          name: customerName,
          phone: phone,
        },
        selectedSlots: selectedSlots,
        totalAmount,
        depositAmount,
        remainingAmount,
        qrCodeUrl,
        paymentStatus: 'COMPLETED_DEPOSIT',
      };

      setIsSubmitting(false);
      onConfirmBooking(receipt);
    } catch (err) {
      console.error('Unexpected Error:', err);
      setErrorMessage('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-zoom-in">
      <div className="relative w-full max-w-lg glass-modal rounded-3xl p-5 sm:p-7 border border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.4)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-micro absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-pink-500/30 border border-white/20 flex items-center justify-center text-white text-lg font-bold"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/30">
            💳 มัดจำ 50% เพื่อยืนยันสิทธิ์
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            ชำระเงินมัดจำ & ยืนยันการจอง
          </h2>
          <p className="text-xs text-gray-300">
            Haekpak Karaoke Online Booking System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Input Section */}
          <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/15">
            <h3 className="text-xs font-bold uppercase text-pink-300 tracking-wider">
              👤 ข้อมูลผู้จอง (Customer Info)
            </h3>

            <div>
              <label className="block text-xs text-gray-300 mb-1 font-medium">
                ชื่อ ผู้จอง <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น นาย สมชาย ของไม่น้อย"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1 font-medium">
                เบอร์โทรศัพท์ <span className="text-pink-400">*</span>
              </label>
              <input
                type="tel"
                placeholder="เช่น 0812345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm outline-none transition-all"
              />
            </div>

            {errorMessage && (
              <div className="text-xs text-red-400 font-semibold bg-red-950/50 p-2.5 rounded-xl border border-red-500/30 animate-pulse">
                ⚠️ {errorMessage}
              </div>
            )}
          </div>

          {/* Selected Summary Card */}
          <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/15">
            <div className="flex justify-between items-center text-xs text-gray-300">
              <span>จำนวนห้อง & สล็อต:</span>
              <span className="font-semibold text-white">
                {selectedSlots.length} รายการ
              </span>
            </div>

            <div className="max-h-24 overflow-y-auto space-y-1.5 py-1 pr-1">
              {selectedSlots.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10"
                >
                  <span className="text-pink-200 font-medium">
                    {item.roomName} ({item.timeLabel})
                  </span>
                  <span className="text-white font-bold">฿{item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>ราคารวมทั้งหมด:</span>
                <span className="font-bold text-white">฿{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-pink-300 font-bold text-sm bg-pink-500/20 p-2 rounded-xl border border-pink-500/40">
                <span>ยอดเงินมัดจำที่ต้องชำระ (50%):</span>
                <span className="text-base text-pink-200">฿{depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-[11px] pt-0.5">
                <span>คงเหลือชำระหน้าร้าน:</span>
                <span>฿{remainingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* PromptPay QR Code Display Section */}
          <div className="glass-card rounded-2xl p-4 text-center space-y-3 border border-pink-500/30  from-pink-950/20 to-black/40">
            <div className="text-xs font-bold text-pink-300 uppercase tracking-wider">
              📲 สแกน QR Code เพื่อชำระเงินมัดจำ (PromptPay)
            </div>

            <div className="inline-block p-3 rounded-2xl bg-white shadow-xl shadow-pink-500/20 border-2 border-pink-400">
              <img
                src={qrCodeUrl}
                alt="PromptPay QR Code Deposit"
                className="w-44 h-44 object-contain mx-auto"
                onError={(e) => {
                  // Fallback visual if PromptPay service has network restriction
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="text-[11px] text-gray-800 font-bold mt-1">
                พร้อมเพย์: Haekpak Karaoke
              </div>
              <div className="text-xs font-extrabold text-pink-600">
                ยอดโอน: ฿{depositAmount.toLocaleString()}
              </div>
            </div>

            <p className="text-[11px] text-gray-300">
              กรุณาสแกนผ่านแอปธนาคารใดก็ได้ ระบบจะบันทึกการมัดจำ 50% โดยอัตโนมัติ
            </p>
          </div>

          {/* Submit Action */}
          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-micro w-full py-4 rounded-2xl font-black text-base text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 shadow-[0_0_30px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,0.9)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-white/20"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>กำลังบันทึกการชำระเงิน...</span>
              </>
            ) : (
              <span>ชำระเงินมัดจำ ฿{depositAmount.toLocaleString()} & ยืนยันการจอง</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
