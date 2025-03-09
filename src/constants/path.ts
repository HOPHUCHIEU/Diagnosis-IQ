const path = {
  landing: '/',
  about: '/about',
  signin: '/sign-in',
  register: '/register',
  services: '/services',
  contact: '/contact',
  verifyEmail: '/verify-email',
  logout: '/logout',
  // User
  profile: '/profile',
  payment: '/payment',
  booking: '/booking',
  // Doctor
  dashboard: '/dashboard',
  profileDoctor: '/profile-doctor',
  settings: '/settings',
  workScheduleDoctor: '/doctor-work-schedule',

  // Admin
  dashboard_admin: '/dashboard-admin',
  userManage: '/user-manage',
  profileAdmin: '/profile-admin',
  settingsAdmin: '/settings-admin',
  workSchedule: '/work-schedule'
} as const
export default path
