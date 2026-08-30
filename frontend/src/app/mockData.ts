// frontend/src/app/mockData.ts

import { Room, TimeSlot } from './types';

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Room 1 (Small)',
    type: 'small',
    capacity: 7,
    pricePerHour: 160,
    badgeText: 'สูงสุด 7 คน',
  },
  {
    id: 'room-2',
    name: 'Room 2 (Small)',
    type: 'small',
    capacity: 7,
    pricePerHour: 160,
    badgeText: 'สูงสุด 7 คน',
  },
  {
    id: 'room-3',
    name: 'Room 3 (Small)',
    type: 'small',
    capacity: 7,
    pricePerHour: 160,
    badgeText: 'สูงสุด 7 คน',
  },
  {
    id: 'room-4',
    name: 'Room 4 (Large)',
    type: 'large',
    capacity: 12,
    pricePerHour: 180,
    badgeText: 'สูงสุด 12 คน',
  },
  {
    id: 'room-5',
    name: 'Room 5 (Large)',
    type: 'large',
    capacity: 12,
    pricePerHour: 180,
    badgeText: 'สูงสุด 12 คน',
  },
];

// Helper to generate fixed 1-hour slots starting from 13:00 to 00:00 (Midnight)
export const GENERATE_TIME_SLOTS = (): Omit<TimeSlot, 'status'>[] => {
  const slots: Omit<TimeSlot, 'status'>[] = [];
  
  // Hours: 13:00 to 00:00 (ขยับทีละ 1 ชั่วโมง)
  let currentHour = 13;

  while (currentHour < 24) {
    const startH = currentHour.toString().padStart(2, '0');
    const startTimeStr = `${startH}:00`;

    // เวลาสิ้นสุดบวกเพิ่ม 1 ชั่วโมง
    let endHour = currentHour + 1;
    if (endHour >= 24) {
      endHour = endHour - 24; // ข้ามเที่ยงคืนเปลี่ยนเป็น 00
    }
    const endH = endHour.toString().padStart(2, '0');
    const endTimeStr = `${endH}:00`;

    const slotId = `slot-${startH}00`;
    const timeLabel = `${startTimeStr} - ${endTimeStr}`;

    slots.push({
      id: slotId,
      startTime: startTimeStr,
      endTime: endTimeStr,
      timeLabel: timeLabel,
    });

    // เลื่อนเวลาเพิ่มทีละ 1 ชั่วโมง
    currentHour += 1;
  }

  return slots;
};

// Default initial schedule statuses for rooms (empty by default so all slots start as available)
export const INITIAL_ROOM_SCHEDULES: Record<
  string,
  Record<string, 'available' | 'booked' | 'expired'>
> = {};