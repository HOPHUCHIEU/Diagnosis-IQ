import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { generateMockSchedule } from './mockData'
import { DaySchedule } from '@/types/workSchedule.type'
import ManageShiftDialog from './components/ManageShiftDialog'
import { MonthPickerPopover } from '@/components/ui/month-picker-popover'

export default function WorkSchedule() {
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedule, setSchedule] = useState<DaySchedule[]>(generateMockSchedule())

  useEffect(() => {
    setSchedule(generateMockSchedule(currentDate))
  }, [currentDate])

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date)
  }

  const handleDayClick = (day: DaySchedule) => {
    setSelectedDay(day)
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý lịch làm việc</h1>
        <MonthPickerPopover date={currentDate} onDateChange={handleMonthChange} />
      </div>

      <div className='grid grid-cols-7 gap-4'>
        {/* Render calendar header */}
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
          <div key={day} className='p-2 font-medium text-center'>
            {day}
          </div>
        ))}

        {/* Render empty cells for days before the first day of the month */}
        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map(
          (_, index) => (
            <div key={`empty-${index}`} className='h-32' />
          )
        )}

        {/* Render schedule */}
        {schedule.map((day) => (
          <Card
            key={day.date}
            className='h-32 transition-shadow cursor-pointer hover:shadow-lg'
            onClick={() => handleDayClick(day)}
          >
            <CardContent className='p-2'>
              <div className='text-center'>
                <div className='text-sm font-medium'>{format(new Date(day.date), 'EEEE', { locale: vi })}</div>
                <div className='text-xl font-bold'>{format(new Date(day.date), 'd')}</div>
                {day.shifts.length > 0 ? (
                  <div className='mt-1 text-xs text-gray-600'>
                    {day.shifts.map((shift) => (
                      <div key={shift.id} className='mb-0.5'>
                        {shift.shift === 'morning' && 'Sáng'}
                        {shift.shift === 'afternoon' && 'Chiều'}
                        {shift.shift === 'evening' && 'Tối'}: {shift.doctors.length}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='mt-1 text-xs text-gray-400'>Chưa có lịch</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className='max-w-4xl'>
          {selectedDay && <ManageShiftDialog day={selectedDay} onClose={() => setSelectedDay(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
