import { memo, useMemo } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import { useAppSelector } from './redux/store'
import DefaultLayout from './layouts/DefaultLayout'
import DashboardLayout from './layouts/DashboardLayout'
import { SignIn, SignUp, VerifyEmail } from './pages/NotAuth'
import { Page_404 } from './pages/NotFound'
import { About, Landing } from './pages/Landing'
import { Profile } from './pages/Dashboard/user'
import { DashboardDoctor, ProfileDoctor, SettingsDoctor, WorkScheduleDoctor } from './pages/Dashboard/doctor'
import { DashboardAdmin, ProfileAdmin, SettingsAdmin, UserManage, WorkSchedule } from './pages/Dashboard/admin'

type ProtectedRouteProps = {
  allowedRole: 'user' | 'admin' | 'doctor'
}

function useAuth() {
  const { isAuthenticated, role: roleUser } = useAppSelector((state) => state.authState)

  const isAdmin = isAuthenticated && roleUser === 'admin'
  const isDoctor = isAuthenticated && roleUser === 'doctor'
  const isUser = isAuthenticated && roleUser === 'user'
  const isAuth = isAuthenticated && (isAdmin || isUser || isDoctor)

  return { isAuthenticated, roleUser, isAdmin, isDoctor, isUser, isAuth }
}

const rejectedRoutes = [
  {
    path: path.signin,
    element: <SignIn />
  },
  {
    path: path.register,
    element: <SignUp />
  },
  {
    path: path.verifyEmail,
    element: <VerifyEmail />
  }
]

const publicRoutes = [
  {
    path: path.about,
    element: <About />
  }
]

const userRoutes = [
  {
    path: path.profile,
    element: (
      <div className='max-w-screen-xl pt-8 mx-auto'>
        <Profile />
      </div>
    )
  }
]

const adminRoutes = [
  {
    path: path.dashboard_admin,
    element: <DashboardAdmin />
  },
  {
    path: path.userManage,
    element: <UserManage />
  },
  {
    path: path.workSchedule,
    element: <WorkSchedule />
  },
  {
    path: path.profileAdmin,
    element: <ProfileAdmin />
  },
  {
    path: path.settingsAdmin,
    element: <SettingsAdmin />
  }
]

const doctorRoutes = [
  {
    path: path.dashboard,
    element: <DashboardDoctor />
  },
  {
    path: path.profileDoctor,
    element: <ProfileDoctor />
  },
  {
    path: path.workScheduleDoctor,
    element: <WorkScheduleDoctor />
  },
  {
    path: path.settings,
    element: <SettingsDoctor />
  }
]

const ProtectedRouteComponent = memo(({ allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, roleUser } = useAuth()
  const isAllowed = isAuthenticated && roleUser === allowedRole

  if (!isAllowed) {
    return <Navigate to={allowedRole === 'user' ? path.signin : path.landing} replace />
  }

  const Layout = allowedRole === 'user' ? DefaultLayout : DashboardLayout
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
})

const RejectedRouteComponent = memo(() => {
  const { isAuth } = useAuth()
  if (isAuth) return <Navigate to={path.landing} />

  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  )
})

const PublicRouteComponent = memo(() => (
  <DefaultLayout>
    <Outlet />
  </DefaultLayout>
))

const UseRouteElements = () => {
  const routes = useMemo(
    () => [
      {
        path: '',
        element: <RejectedRouteComponent />,
        children: rejectedRoutes
      },
      {
        path: '',
        index: true,
        element: (
          <DefaultLayout>
            <Landing />
          </DefaultLayout>
        )
      },
      {
        path: '',
        element: <PublicRouteComponent />,
        children: publicRoutes
      },
      {
        path: '',
        element: <ProtectedRouteComponent allowedRole='user' />,
        children: userRoutes
      },
      {
        path: '',
        element: <ProtectedRouteComponent allowedRole='admin' />,
        children: adminRoutes
      },
      {
        path: '',
        element: <ProtectedRouteComponent allowedRole='doctor' />,
        children: doctorRoutes
      },
      {
        path: '*',
        element: (
          <DefaultLayout>
            <Page_404 />
          </DefaultLayout>
        )
      }
    ],
    []
  )
  return useRoutes(routes)
}

export default UseRouteElements
