import { DaySchedule, ShiftDetail, Shift } from '@/types/workSchedule.type'
import { addDays, format, getDaysInMonth } from 'date-fns'

export const generateMockSchedule = (startDate: Date = new Date()): DaySchedule[] => {
  const schedule: DaySchedule[] = []
  const daysInMonth = getDaysInMonth(startDate)
  const firstDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

  for (let i = 0; i < daysInMonth; i++) {
    const currentDate = addDays(firstDayOfMonth, i)
    const dateStr = format(currentDate, 'yyyy-MM-dd')

    // Random có hoặc không có ca làm việc
    const hasShifts = Math.random() > 0.3

    const shifts: ShiftDetail[] = hasShifts
      ? [
          {
            id: `morning-${dateStr}`,
            shift: 'morning' as Shift,
            date: dateStr,
            doctors: []
          },
          {
            id: `afternoon-${dateStr}`,
            shift: 'afternoon' as Shift,
            date: dateStr,
            doctors: []
          },
          {
            id: `evening-${dateStr}`,
            shift: 'evening' as Shift,
            date: dateStr,
            doctors: []
          }
        ]
      : []

    schedule.push({
      date: dateStr,
      shifts
    })
  }

  return schedule
}

// Mock danh sách bác sĩ
export const mockDoctors = [
  {
    _id: '1',
    email: 'doctor1@example.com',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      avatar: '',
      gender: 'male'
    },
    role: 'doctor'
  },
  {
    _id: '2',
    email: 'doctor2@example.com',
    profile: {
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      avatar: '',
      gender: 'female'
    },
    role: 'doctor'
  }
  // Thêm các bác sĩ khác...
] as any[]
