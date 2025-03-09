import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { WeekSchedule, DayShift, Shift, ShiftTime } from '@/types/workSchedule.type'
import { format, addDays, startOfWeek, addWeeks } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppSelector } from '@/redux/store'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DEFAULT_SHIFTS: DayShift = {
  morning: false,
  morningStart: '08:00',
  morningEnd: '12:00',
  afternoon: false,
  afternoonStart: '13:00',
  afternoonEnd: '17:00',
  evening: false,
  eveningStart: '18:00',
  eveningEnd: '21:00'
}

const TIME_OPTIONS = Array.from({ length: 24 * 2 }).map((_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${minute}`
})

interface Props {
  onClose: () => void
}

type ShiftTimeKey = keyof ShiftTime

export default function CreateScheduleDialog({ onClose }: Props) {
  // const { _id: doctorId } = useAppSelector((state) => state.authState)
  const doctorId = ''
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { locale: vi }))
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: { ...DEFAULT_SHIFTS },
    tuesday: { ...DEFAULT_SHIFTS },
    wednesday: { ...DEFAULT_SHIFTS },
    thursday: { ...DEFAULT_SHIFTS },
    friday: { ...DEFAULT_SHIFTS },
    saturday: { ...DEFAULT_SHIFTS },
    sunday: { ...DEFAULT_SHIFTS }
  })

  const handlePreviousWeek = () => {
    setWeekStart((prev) => addWeeks(prev, -1))
  }

  const handleNextWeek = () => {
    setWeekStart((prev) => addWeeks(prev, 1))
  }

  const handleShiftToggle = (day: keyof WeekSchedule, shift: Shift) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [shift]: !prev[day][shift]
      }
    }))
  }

  const handleTimeChange = (day: keyof WeekSchedule, shift: Shift, type: 'Start' | 'End', value: string) => {
    const timeKey = `${shift}${type}` as keyof ShiftTime
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeKey]: value
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        doctorId,
        initialSchedule: {
          weekStart: weekStart.toISOString(),
          weekEnd: addDays(weekStart, 6).toISOString(),
          dailySchedules: schedule
        },
        defaultConsultationDuration: 30
      }
      console.log('Creating schedule:', payload)
      // Call API here
      onClose()
    } catch (error) {
      console.error('Error creating schedule:', error)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold'>Tạo lịch làm việc</h2>
        <div className='flex items-center justify-between mt-2'>
          <Button variant='outline' size='icon' onClick={handlePreviousWeek}>
            <ChevronLeft className='w-4 h-4' />
          </Button>
          <p className='text-sm text-gray-500'>
            Tuần từ {format(weekStart, 'dd/MM/yyyy')} đến {format(addDays(weekStart, 6), 'dd/MM/yyyy')}
          </p>
          <Button variant='outline' size='icon' onClick={handleNextWeek}>
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      </div>

      <ScrollArea className='h-[60vh]'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {Object.entries(schedule).map(([day, shifts]) => (
            <div key={day} className='p-4 border rounded-lg'>
              <h3 className='mb-4 font-medium capitalize'>
                {format(
                  addDays(
                    weekStart,
                    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(day)
                  ),
                  'EEEE, dd/MM',
                  { locale: vi }
                )}
              </h3>

              <div className='space-y-4'>
                {['morning', 'afternoon', 'evening'].map((shiftType) => {
                  const shift = shiftType as Shift
                  const startKey = `${shift}Start` as keyof ShiftTime
                  const endKey = `${shift}End` as keyof ShiftTime

                  return (
                    <div key={shift} className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Switch
                          checked={shifts[shift]}
                          onCheckedChange={() => handleShiftToggle(day as keyof WeekSchedule, shift)}
                        />
                        <span className='capitalize'>
                          {shift === 'morning' ? 'Sáng' : shift === 'afternoon' ? 'Chiều' : 'Tối'}
                        </span>
                      </div>

                      {shifts[shift] && (
                        <div className='grid grid-cols-2 gap-2 pl-8'>
                          <Select
                            value={shifts[startKey]}
                            onValueChange={(value) =>
                              handleTimeChange(day as keyof WeekSchedule, shift, 'Start', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Bắt đầu' />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={shifts[endKey]}
                            onValueChange={(value) => handleTimeChange(day as keyof WeekSchedule, shift, 'End', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Kết thúc' />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className='flex justify-end gap-2 pt-4'>
        <Button variant='outline' onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSubmit}>Tạo lịch</Button>
      </div>
    </div>
  )
}
