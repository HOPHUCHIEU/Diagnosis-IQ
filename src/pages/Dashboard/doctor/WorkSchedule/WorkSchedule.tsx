import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { DaySchedule, Shift } from '@/types/workSchedule.type'
import { MonthPickerPopover } from '@/components/ui/month-picker-popover'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import CreateScheduleDialog from './components/CreateScheduleDialog'

export default function WorkSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  // Trong thực tế sẽ fetch từ API
  const [schedule, setSchedule] = useState<DaySchedule[]>([])

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date)
    // Fetch schedule for new month
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Lịch làm việc</h1>
        <div className='flex items-center gap-4'>
          <MonthPickerPopover date={currentDate} onDateChange={handleMonthChange} />
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Tạo lịch làm việc
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-7 gap-4'>
        {/* Calendar header */}
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
          <div key={day} className='p-2 font-medium text-center'>
            {day}
          </div>
        ))}

        {/* Empty cells */}
        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map(
          (_, index) => (
            <div key={`empty-${index}`} className='h-32' />
          )
        )}

        {/* Calendar days */}
        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map(
          (_, index) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1)
            const daySchedule = schedule.find((s) => s.date === format(date, 'yyyy-MM-dd'))

            return (
              <Card key={index} className='h-32'>
                <CardContent className='p-2'>
                  <div className='text-center'>
                    <div className='text-sm font-medium'>{format(date, 'EEEE', { locale: vi })}</div>
                    <div className='text-xl font-bold'>{format(date, 'd')}</div>
                    {daySchedule?.shifts.length ? (
                      <div className='mt-1 text-xs text-gray-600'>
                        {daySchedule.shifts.map((shift) => (
                          <div key={shift.id} className='mb-0.5 px-2 py-0.5 rounded bg-green-50'>
                            {shift.shift === 'morning' && 'Sáng'}
                            {shift.shift === 'afternoon' && 'Chiều'}
                            {shift.shift === 'evening' && 'Tối'}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )
          }
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className='max-w-xl'>
          <CreateScheduleDialog onClose={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
