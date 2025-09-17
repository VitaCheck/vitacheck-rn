// src/types/alarm.ts
export type DayOfWeek = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export type Schedule = {
  dayOfWeek: DayOfWeek;
  time: string; // "HH:mm"
};

export type Supplement = {
  notificationRoutineId: number;
  supplementId?: number;
  supplementName: string;
  supplementImageUrl?: string;
  times?: string[];
  daysOfWeek?: DayOfWeek[];
  isTaken: boolean;
  schedules?: Schedule[];
};
