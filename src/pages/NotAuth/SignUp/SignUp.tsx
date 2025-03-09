import Input from '@/components/Core/Input'
import { CustomNotification } from '@/components/CustomReactToastify'
import { Button } from '@/components/ui/button'
import { useRegisterAccountMutation } from '@/redux/services/authApi'
import { Schema, schema } from '@/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password' | 'firstName' | 'lastName' | 'phone'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password', 'firstName', 'lastName', 'phone'])

export default function SignUp() {
  const navigate = useNavigate()
  const [registerAccount, resultRegister] = useRegisterAccountMutation()

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(registerSchema) })

  const onSubmit = handleSubmit((data: FormData) => {
    registerAccount({
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      phone: data.phone,
      password: data.password
    })
  })

  useEffect(() => {
    if (resultRegister.data) {
      toast.success(CustomNotification, {
        data: {
          title: 'Đăng ký thành công!',
          content: 'Vui lòng xác thực email của bạn'
        }
      })
      navigate('/verify-email', {
        state: {
          email: getValues('email')
        }
      })
    }
    if (resultRegister.error) {
      const formError = (resultRegister.error as any)?.data?.message || resultRegister.error
      if (formError) {
        if (formError === 'EMAIL_ALREADY_EXISTS') {
          setError('email', {
            message: 'Email đã tồn tại',
            type: 'Server'
          })
        } else if (formError === 'PHONE_ALREADY_EXISTS') {
          setError('phone', {
            message: 'Số điện thoại đã được sử dụng',
            type: 'Server'
          })
        }
      }
    }
    console.log('resultRegister=>', resultRegister)
  }, [resultRegister])

  return (
    // <div className='flex mt-10'>
    //   <Helmet>
    //     <title>Đăng ký - Diagnosis</title>
    //     <meta
    //       name='description'
    //       content='Diagnosis IQ: Smart Clinical Decision Support System for Automated Hospital.'
    //     />
    //   </Helmet>
    //   <div className='flex items-center justify-center w-full bg-gray-100 --lg:w-1/2'>
    //     <div className='w-full max-w-md p-6 xl:max-w-xl'>
    //       <p className='mb-6 text-3xl font-semibold text-center text-black'>Đăng ký</p>
    //       <p className='mb-6 text-sm font-semibold text-center text-gray-700'>
    //         Tham gia Cộng đồng của chúng tôi với quyền truy cập mọi lúc và miễn phí{' '}
    //       </p>
    //       <form onSubmit={onSubmit} className='space-y-4'>
    //         <Input
    //           name='email'
    //           className='mt-6'
    //           placeholder='Email'
    //           register={register}
    //           type='email'
    //           errorMessage={errors.email?.message}
    //         />
    //         <Input
    //           name='phone'
    //           className='mt-6'
    //           placeholder='Phone Number'
    //           register={register}
    //           type='phone'
    //           errorMessage={errors.phone?.message}
    //         />
    //         <div className='grid grid-cols-2 gap-x-4'>
    //           <Input
    //             name='firstName'
    //             placeholder='First Name'
    //             register={register}
    //             errorMessage={errors.firstName?.message}
    //           />
    //           <Input
    //             name='lastName'
    //             placeholder='Last Name'
    //             register={register}
    //             errorMessage={errors.lastName?.message}
    //           />
    //         </div>
    //         <div className='grid grid-cols-2 mt-6 gap-x-4'>
    //           <Input
    //             name='password'
    //             placeholder='Password'
    //             register={register}
    //             type='password'
    //             errorMessage={errors.password?.message}
    //             autoComplete='on'
    //           />
    //           <Input
    //             name='confirm_password'
    //             placeholder='Confirm Password'
    //             register={register}
    //             type='password'
    //             autoComplete='on'
    //             errorMessage={errors.confirm_password?.message}
    //           />
    //         </div>
    //         <Button
    //           type='submit'
    //           className='flex items-center justify-center w-full p-2 text-white transition-colors duration-300 rounded-md bg-gradient-to-br to-blue-700 from-blue_app via-blue_app hover:bg-gradient-to-tl focus:outline-none focus:ring-2 focus:ring-offset-2'
    //           isLoading={resultRegister.isLoading}
    //           disabled={resultRegister.isLoading}
    //         >
    //           Đăng ký
    //         </Button>
    //       </form>
    //       <div className='mt-4 text-sm text-center text-gray-700'>
    //         <p>
    //           Đã có tài khoản?{' '}
    //           <Link to={'/sign-in'} className='text-black hover:underline'>
    //             Đăng nhập ngay
    //           </Link>
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-3xl p-8 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-center text-gray-800'>Register for a Participant Account</h2>
        <p className='mb-6 text-center text-gray-600'>Create your Account</p>

        <form onSubmit={onSubmit} className='space-y-4'>
          <Input
            name='email'
            className='mt-6'
            placeholder='Email'
            register={register}
            type='email'
            errorMessage={errors.email?.message}
          />
          <Input
            name='phone'
            className='mt-6'
            placeholder='Phone Number'
            register={register}
            type='phone'
            errorMessage={errors.phone?.message}
          />
          <div className='grid grid-cols-2 gap-x-4'>
            <Input
              name='firstName'
              placeholder='First Name'
              register={register}
              errorMessage={errors.firstName?.message}
            />
            <Input
              name='lastName'
              placeholder='Last Name'
              register={register}
              errorMessage={errors.lastName?.message}
            />
          </div>
          <div className='grid grid-cols-2 mt-6 gap-x-4'>
            <Input
              name='password'
              placeholder='Password'
              register={register}
              type='password'
              errorMessage={errors.password?.message}
              autoComplete='on'
            />
            <Input
              name='confirm_password'
              placeholder='Confirm Password'
              register={register}
              type='password'
              autoComplete='on'
              errorMessage={errors.confirm_password?.message}
            />
          </div>
          <Button
            type='submit'
            className='w-full'
            effect={'ringHover'}
            isLoading={resultRegister.isLoading}
            disabled={resultRegister.isLoading}
          >
            Đăng ký
          </Button>
        </form>
        <p className='mt-4 text-center text-gray-600'>
          Đã có tài khoản?
          <a href='/sign-in' className='ml-1 text-blue-600 hover:underline'>
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  )
}
