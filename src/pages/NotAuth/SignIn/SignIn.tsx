import { useLoginUserMutation } from '@/redux/services/authApi'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from '@/utils/rules'
import Input from '@/components/Core/Input'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import GoogleOAuthClient from '@/components/Auth/GoogleOAuthClient'
import { Helmet } from 'react-helmet-async'
import { CustomNotification } from '@/components/CustomReactToastify'
import { Button } from '@/components/ui/button'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loginUser, resultLogin] = useLoginUserMutation()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) })

  const onSubmit = handleSubmit((data) => {
    loginUser({
      email: data.email,
      password: data.password
    })
  })

  useEffect(() => {
    if (resultLogin.data) {
      toast.dismiss()
      toast(CustomNotification, {
        data: {
          title: 'Welcome back!',
          content: `⭐ Hi,  ${getValues('email')} `
        }
      })

      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
      navigate(redirectPath)
      sessionStorage.removeItem('redirectAfterLogin')
    }
    if (resultLogin.error) {
      const formError = (resultLogin.error as any)?.data?.message || resultLogin.error
      if (formError) {
        if (formError === 'USER_NOT_FOUND') {
          setError('email', {
            message: 'Email không tồn tại',
            type: 'Server'
          })
        }
      }
    }
  }, [resultLogin])

  useEffect(() => {
    // Xử lý email từ state khi chuyển hướng từ trang verify hoặc signup
    if (location.state?.email) {
      setValue('email', location.state.email)

      // Nếu email đã được verify, hiển thị thông báo
      if (location.state?.verified) {
        toast.success(CustomNotification, {
          data: {
            title: 'Email đã xác thực thành công!',
            content: 'Bạn có thể đăng nhập ngay bây giờ'
          }
        })
      }
    }
  }, [location.state, setValue])

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='relative flex w-3/4 overflow-hidden rounded-lg shadow-lg'>
        {/* Left Side - Image */}
        <div className='w-1/2 bg-gray-100'>
          <img src='./dk.svg' alt='Lab Background' className='object-cover w-full h-full' />
        </div>

        {/* Right Side - Login Form */}
        <div className='relative flex items-center justify-center w-1/2 p-10 bg-white shadow-lg'>
          {/* Logo - Diagnosis IQ */}
          <div className='absolute flex items-center space-x-1 top-6 right-6'>
            <img src='./DAIQ.svg' alt='...' className='w-40 h-10' />
          </div>

          <div className='w-full max-w-md'>
            <h2 className='mt-5 mb-6 text-2xl font-semibold text-center text-gray-900'>Log in to your account</h2>

            <form onSubmit={onSubmit} className='space-y-4'>
              <Input
                label={'Email'}
                name='email'
                className='mt-6'
                placeholder='Email'
                register={register}
                type='email'
                errorMessage={errors.email?.message}
              />
              <Input
                label={'Password'}
                name='password'
                className='mt-3'
                placeholder='Password'
                register={register}
                type='password'
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <Button
                type='submit'
                className='w-full'
                effect={'ringHover'}
                isLoading={resultLogin.isLoading}
                disabled={resultLogin.isLoading}
              >
                Đăng nhập
              </Button>
            </form>

            <p className='mt-4 text-center text-gray-600'>
              Don't have an account?
              <a href='/register' className='ml-1 text-blue-600 hover:underline'>
                Register Now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
