'use client';

import React from 'react';
import { BookingReceipt } from './types';

interface SuccessPassModalProps {
  receipt: BookingReceipt;
  onDone: () => void;
}

export default function SuccessPassModal({ receipt, onDone }: SuccessPassModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-zoom-in">
      <div className="relative w-full max-w-md glass-modal rounded-3xl p-6 sm:p-8 border border-emerald-400/40 shadow-[0_0_60px_rgba(16,185,129,0.4)] text-center space-y-5">
        {/* Top Success Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-3xl flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.6)] animate-bounce">
          ✓
        </div>

        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            Booking Confirmed Pass
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            การจองสำเร็จแล้ว!
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            ขอบคุณที่ใช้บริการ Haekpak Karaoke
          </p>
        </div>

        {/* Digital Pass Ticket Card */}
        <div className="glass-card rounded-2xl p-4 border border-white/20 text-left space-y-3  from-white/10 to-transparent relative overflow-hidden">
          {/* Ticket Edge Notches */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-950 border border-white/20" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-950 border border-white/20" />

          {/* Ticket Header */}
          <div className="flex justify-between items-center border-b border-white/15 pb-2">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold">
                หมายเลขการจอง (Booking ID)
              </div>
              <div className="text-base font-black text-pink-400 tracking-wide">
                #{receipt.bookingId}
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">
              มัดจำแล้ว 50%
            </div>
          </div>

          {/* Customer & Time Info */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>ผู้จอง:</span>
              <span className="font-bold text-white">{receipt.customer.name}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>เบอร์โทรศัพท์:</span>
              <span className="font-bold text-white">{receipt.customer.phone}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>วันที่ทำรายการ:</span>
              <span className="text-gray-200">{receipt.createdAt}</span>
            </div>
          </div>

          {/* Slots List */}
          <div className="border-t border-dashed border-white/20 pt-2 space-y-1">
            <div className="text-[11px] font-bold text-pink-300">รายการห้องและช่วงเวลา:</div>
            {receipt.selectedSlots.map((slot, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-xs bg-white/5 px-2 py-1 rounded border border-white/10"
              >
                <span className="text-gray-200">{slot.roomName}</span>
                <span className="text-pink-300 font-semibold">{slot.timeLabel}</span>
              </div>
            ))}
          </div>

          {/* Payment Financials */}
          <div className="border-t border-white/15 pt-2 space-y-1 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>ราคารวมทั้งสิ้น:</span>
              <span className="font-bold text-white">฿{receipt.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-300 font-bold">
              <span>ชำระมัดจำเรียบร้อย (50%):</span>
              <span>฿{receipt.depositAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-pink-300 font-semibold">
              <span>ชำระเพิ่มเติมที่หน้าร้าน:</span>
              <span>฿{receipt.remainingAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-300">
          💡 กรุณาแคปหน้าจอตั๋วการจองนี้ไว้เพื่อแสดงแก่เจ้าหน้าที่เมื่อเข้าใช้บริการ
        </p>

        {/* Done / Reset Button */}
        <button
          onClick={onDone}
          className="btn-micro w-full py-3.5 rounded-2xl font-black text-sm text-white  from-emerald-500 to-cyan-500 shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] cursor-pointer"
        >
          ตกลง & กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
}
