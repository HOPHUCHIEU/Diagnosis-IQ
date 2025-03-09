import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useVerifyEmailMutation, useResendVerifyEmailMutation } from '@/redux/services/authApi'
import { toast } from 'react-toastify'
import { CustomNotification } from '@/components/CustomReactToastify'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Forward, Loader, RotateCcw, Send, SendToBack } from 'lucide-react'

const schema = yup.object({
  code: yup.string().required('Vui lòng nhập mã xác thực').min(6, 'Mã xác thực phải có 6 ký tự')
})

type FormData = yup.InferType<typeof schema>

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const [countdown, setCountdown] = useState(300)

  const [verifyEmail, verifyResult] = useVerifyEmailMutation()
  const [resendCode, resendResult] = useResendVerifyEmailMutation()

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      code: ''
    }
  })

  useEffect(() => {
    if (!email) {
      navigate('/sign-in')
    }
  }, [email, navigate])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const onSubmit = (data: FormData) => {
    verifyEmail({ email, code: data.code })
  }

  const handleResendCode = () => {
    resendCode({ email })
    setCountdown(300)
  }

  useEffect(() => {
    if (verifyResult.data) {
      toast.success(CustomNotification, {
        data: {
          title: `${email} đã được xác thực!`,
          content: 'Bạn có thể đăng nhập ngay bây giờ'
        }
      })
      navigate('/sign-in', {
        state: {
          email,
          verified: true // Thêm flag để đánh dấu email đã verify
        }
      })
    }
  }, [verifyResult, email, navigate])

  useEffect(() => {
    if (resendResult.data) {
      toast.success('Đã gửi lại mã xác thực')
    }
    if (resendResult.error) {
      toast.error('Không thể gửi lại mã. Vui lòng thử lại sau')
    }
  }, [resendResult])

  return (
    <div className='flex justify-center items-center min-h-[80vh]'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <h2 className='mb-6 text-2xl font-bold text-center'>Xác thực email</h2>
        <p className='mb-6 text-center text-gray-600'>
          Chúng tôi đã gửi mã xác thực đến email {email}.<br />
          Vui lòng kiểm tra và nhập mã xác thực
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem className='w-full space-y-4 text-center'>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className='justify-center w-full gap-2'>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-center'>
              <Button
                type='submit'
                effect={'ringHover'}
                className='rounded-full min-w-[120px]'
                isLoading={verifyResult.isLoading}
                disabled={verifyResult.isLoading}
              >
                Xác thực
              </Button>
            </div>
          </form>
        </Form>

        <div className='mt-4 text-center'>
          <Button
            className='font-medium'
            onClick={handleResendCode}
            disabled={countdown > 0 || resendResult.isLoading}
            effect={'hoverUnderline'}
            variant='link'
          >
            {countdown > 0
              ? `Gửi lại mã (${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')})`
              : 'Gửi lại mã'}
          </Button>
        </div>
      </div>
    </div>
  )
}
