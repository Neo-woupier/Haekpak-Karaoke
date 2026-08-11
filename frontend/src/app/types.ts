// frontend/src/app/types.ts

export type RoomType = 'small' | 'large';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number; // Max people
  pricePerHour: number; // Baht
  badgeText: string;
  price_per_slot?: number;
}

export type SlotStatus = 'available' | 'booked' | 'expired';

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "13:30"
  endTime: string;   // e.g. "14:30"
  timeLabel: string; // e.g. "13:30 - 14:30"
  status: SlotStatus;
}

export interface SelectedSlot {
  roomId: string;
  roomName: string;
  roomType: RoomType;
  slotId: string;
  timeLabel: string;
  price: number;
}


export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface BookingReceipt {
  bookingId: string;
  createdAt: string;
  customer: CustomerInfo;
  selectedSlots: SelectedSlot[];
  totalAmount: number;
  depositAmount: number; // 50%
  remainingAmount: number;
  qrCodeUrl: string;
  paymentStatus: 'COMPLETED_DEPOSIT' | 'PENDING';
}
