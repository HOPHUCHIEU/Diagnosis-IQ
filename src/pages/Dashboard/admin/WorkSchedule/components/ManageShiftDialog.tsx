import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { DaySchedule, SHIFTS, Shift } from '@/types/workSchedule.type'
import { mockDoctors } from '../mockData'
import { User } from '@/types/user.type'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
  day: DaySchedule
  onClose: () => void
}

export default function ManageShiftDialog({ day, onClose }: Props) {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [selectedDoctors, setSelectedDoctors] = useState<User[]>([])

  const handleShiftSelect = (shift: Shift) => {
    setSelectedShift(shift)
    // Reset selected doctors when changing shift
    setSelectedDoctors([])
  }

  const handleDoctorSelect = (doctor: User) => {
    if (selectedDoctors.find((d) => d._id === doctor._id)) {
      setSelectedDoctors(selectedDoctors.filter((d) => d._id !== doctor._id))
    } else {
      setSelectedDoctors([...selectedDoctors, doctor])
    }
  }

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving doctors for shift:', {
      date: day.date,
      shift: selectedShift,
      doctors: selectedDoctors
    })
    onClose()
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold'>Quản lý lịch làm việc ngày {format(new Date(day.date), 'dd/MM/yyyy')}</h2>

      <div className='grid grid-cols-2 gap-4'>
        {/* Left side - Shifts */}
        <div className='space-y-2'>
          <h3 className='mb-4 font-medium'>Chọn ca làm việc</h3>
          {SHIFTS.map((shift) => {
            const currentDoctors = day.shifts.find((s) => s.shift === shift.value)?.doctors || []
            return (
              <Button
                key={shift.value}
                variant={selectedShift === shift.value ? 'default' : 'outline'}
                className='justify-start w-full'
                onClick={() => handleShiftSelect(shift.value)}
              >
                {shift.label}
                <span className='ml-2 text-sm'>({currentDoctors.length} bác sĩ)</span>
              </Button>
            )
          })}
        </div>

        {/* Right side - Doctors */}
        <div>
          <h3 className='mb-4 font-medium'>Danh sách bác sĩ</h3>
          {selectedShift ? (
            <ScrollArea className='h-[400px] pr-4'>
              <div className='space-y-2'>
                {mockDoctors.map((doctor) => (
                  <Button
                    key={doctor._id}
                    variant={selectedDoctors.find((d) => d._id === doctor._id) ? 'default' : 'outline'}
                    className='justify-start w-full'
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    {doctor.profile.fullName}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className='text-center text-gray-500'>Vui lòng chọn ca làm việc</div>
          )}
        </div>
      </div>

      <div className='flex justify-end gap-2 mt-4'>
        <Button variant='outline' onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSave} disabled={!selectedShift || selectedDoctors.length === 0}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}
