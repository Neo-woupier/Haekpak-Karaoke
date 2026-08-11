// frontend/src/app/mockData.ts

import { Room, TimeSlot } from './types';

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Room 1 (Small)',
    type: 'small',
    capacity: 7,
    pricePerHour: 160,
    badgeText: 'ศุงสุด 7 คน',
  },
  {
    id: 'room-2',
    name: 'Room 2 (Small)',
    type: 'small',
    capacity: 7,
    pricePerHour: 160,
    badgeText: 'ศุงสุด 7 คน',
  },
  {
    id: 'room-3',
    name: 'Room 3 (Small)',
    type: 'small',
    capacity: 7,
    pricePerHour: 160,
    badgeText: 'ศุงสุด 7 คน',
  },
  {
    id: 'room-4',
    name: 'Room 4 (Large)',
    type: 'large',
    capacity: 12,
    pricePerHour: 160,
    badgeText: 'ศุงสุด 12 คน',
  },
  {
    id: 'room-5',
    name: 'Room 5 (Large)',
    type: 'large',
    capacity: 12,
    pricePerHour: 160,
    badgeText: 'ศุงสุด 12 คน',
  },
];

// Helper to generate 30-min incremental 1-hour slots starting from 13:30 to 23:30
export const GENERATE_TIME_SLOTS = (): Omit<TimeSlot, 'status'>[] => {
  const slots: Omit<TimeSlot, 'status'>[] = [];
  
  // Hours: 13 to 23
  // Start from 13:30 (minute 30) up to 23:30
  let currentHour = 13;
  let currentMinute = 30;

  while (currentHour < 23 || (currentHour === 23 && currentMinute <= 30)) {
    const startH = currentHour.toString().padStart(2, '0');
    const startM = currentMinute.toString().padStart(2, '0');
    const startTimeStr = `${startH}:${startM}`;

    // End time is 1 hour later
    let endHour = currentHour + 1;
    let endMinute = currentMinute;
    if (endHour >= 24) {
      endHour = endHour - 24;
    }
    const endH = endHour.toString().padStart(2, '0');
    const endM = endMinute.toString().padStart(2, '0');
    const endTimeStr = `${endH}:${endM}`;

    const slotId = `slot-${startH}${startM}`;
    const timeLabel = `${startTimeStr} - ${endTimeStr}`;

    slots.push({
      id: slotId,
      startTime: startTimeStr,
      endTime: endTimeStr,
      timeLabel: timeLabel,
    });

    // Advance 30 minutes
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }

  return slots;
};

// Default initial schedule statuses for rooms
export const INITIAL_ROOM_SCHEDULES: Record<string, Record<string, 'available' | 'booked' | 'expired'>> = {
  'room-1': {
    'slot-1330': 'expired',
    'slot-1400': 'expired',
    'slot-1430': 'expired',
    'slot-1500': 'booked',
    'slot-1530': 'booked',
    'slot-1800': 'booked',
    'slot-1830': 'booked',
    'slot-2000': 'booked',
  },
  'room-2': {
    'slot-1330': 'expired',
    'slot-1400': 'expired',
    'slot-1600': 'booked',
    'slot-1630': 'booked',
    'slot-1900': 'booked',
    'slot-1930': 'booked',
  },
  'room-3': {
    'slot-1330': 'expired',
    'slot-1400': 'expired',
    'slot-1430': 'expired',
    'slot-1730': 'booked',
    'slot-1800': 'booked',
    'slot-2100': 'booked',
  },
  'room-4': {
    'slot-1330': 'expired',
    'slot-1400': 'expired',
    'slot-1700': 'booked',
    'slot-1730': 'booked',
    'slot-2000': 'booked',
    'slot-2030': 'booked',
  },
  'room-5': {
    'slot-1330': 'expired',
    'slot-1400': 'expired',
    'slot-1530': 'booked',
    'slot-1600': 'booked',
    'slot-2200': 'booked',
    'slot-2230': 'booked',
  },
};
