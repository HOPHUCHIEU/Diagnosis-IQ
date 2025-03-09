import { User } from './user.type'

export type Shift = 'morning' | 'afternoon' | 'evening'

export interface ShiftDetail {
  id: string
  shift: Shift
  doctors: User[]
  date: string
}

export interface DaySchedule {
  date: string
  shifts: ShiftDetail[]
}

export interface DoctorScheduleRequest {
  _id?: string
  doctorId: string
  date: string
  shifts: Shift[]
  status: 'pending' | 'approved' | 'rejected'
  note?: string
}

export const SHIFTS: { label: string; value: Shift }[] = [
  { label: 'Ca sáng (7:00 - 11:00)', value: 'morning' },
  { label: 'Ca chiều (13:00 - 17:00)', value: 'afternoon' },
  { label: 'Ca tối (18:00 - 21:00)', value: 'evening' }
]

export type ShiftStartEnd = {
  [K in Shift as `${K}Start`]?: string
} & {
  [K in Shift as `${K}End`]?: string
}

export type ShiftStatus = {
  [K in Shift]: boolean
}

export type ShiftTime = ShiftStatus & ShiftStartEnd

export type DayShift = ShiftTime

export type WeekSchedule = {
  monday: DayShift
  tuesday: DayShift
  wednesday: DayShift
  thursday: DayShift
  friday: DayShift
  saturday: DayShift
  sunday: DayShift
}

export interface CreateScheduleRequest {
  doctorId: string
  initialSchedule: {
    weekStart: string
    weekEnd: string
    dailySchedules: WeekSchedule
  }
  defaultConsultationDuration: number
}
