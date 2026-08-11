// frontend/src/app/mockData.ts

import { TimeSlot } from './types';

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