import path from '@/constants/path'
import { CalendarDays, CircleUserRound, LayoutDashboard, UsersRound } from 'lucide-react'

export const sidebarAdmin = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className='flex-shrink-0 w-5 h-5' />,
    href: path.dashboard_admin
  },
  {
    label: 'Quản lý người dùng',
    icon: <UsersRound className='flex-shrink-0 w-5 h-5' />,
    href: path.userManage
  },
  {
    label: 'Lịch làm việc',
    icon: <CalendarDays className='flex-shrink-0 w-5 h-5' />,
    href: path.workSchedule
  },
  {
    label: 'Profile',
    icon: <CircleUserRound className='flex-shrink-0 w-5 h-5' />,
    href: path.profileAdmin
  }
]
export const sidebarDoctor = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className='flex-shrink-0 w-5 h-5' />,
    href: path.dashboard
  },
  {
    label: 'Lịch làm việc',
    icon: <CalendarDays className='flex-shrink-0 w-5 h-5' />,
    href: path.workScheduleDoctor
  },
  {
    label: 'Profile',
    icon: <CircleUserRound className='flex-shrink-0 w-5 h-5' />,
    href: path.profileDoctor
  }
]
