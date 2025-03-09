import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { UpdateInfoUserInput, User } from '@/types/user.type'
import { useForm } from 'react-hook-form'
import { useAdminUpdateUserMutation, useGetAllUserQuery } from '@/redux/services/userApi'
import { toast } from 'react-toastify'
import { CustomNotification } from '@/components/CustomReactToastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import { adminUpdateUserSchema, type AdminUpdateUserSchema } from '@/utils/rules'
import { bufferToHex } from '@/utils/utils'

interface Props {
  user: User
  onClose?: () => void
}

const GENDERS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' }
] as const

const ROLES = [
  { value: 'admin', label: 'Admin', disable: true },
  { value: 'user', label: 'Người dùng', disable: false },
  { value: 'doctor', label: 'Bác sĩ', disable: false }
] as const

export default function Information({ user, onClose }: Props) {
  const { refetch: refetchGetAllUserQuery } = useGetAllUserQuery(null)
  const [updateUser, { isLoading }] = useAdminUpdateUserMutation()
  const form = useForm<AdminUpdateUserSchema>({
    resolver: yupResolver(adminUpdateUserSchema),
    defaultValues: {
      firstName: user?.profile?.firstName,
      lastName: user?.profile?.lastName,
      phone: user?.profile?.phone,
      gender: user?.profile?.gender,
      birth: user?.profile?.birth ? new Date(user?.profile?.birth) : null,
      address: user?.profile?.address,
      role: user.role,
      disabled: user.disabled,
      isVerified: user.isVerified
    }
  })

  const onSubmit = async (data: AdminUpdateUserSchema) => {
    try {
      const userData: UpdateInfoUserInput = {
        ...data,
        birth: data.birth ? format(data.birth, 'yyyy-MM-dd') : '',
        address: '',
        avatar: '',
        disabled: data.disabled,
        isVerified: data.isVerified,
        role: data.role as 'user' | 'doctor',
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.lastName} ${data.firstName}`,
        gender: data.gender as 'male' | 'female',
        phone: data.phone
      }
      await updateUser({
        id: bufferToHex(user._id),
        data: userData
      }).unwrap()

      toast.success(CustomNotification, {
        data: {
          title: 'Thành công!',
          content: 'Cập nhật thông tin thành công'
        }
      })
      refetchGetAllUserQuery()
      onClose?.()
    } catch (error: any) {
      console.log('error', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        {/* Email field (disabled) */}
        <FormItem>
          <FormLabel>Email</FormLabel>
          <Input value={user.email} disabled />
        </FormItem>

        <div className='grid grid-cols-2 gap-4'>
          {/* First Name & Last Name */}
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ & Tên lót</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='birth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input
                    type='date'
                    {...field}
                    value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn giới tính' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vai trò</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn vai trò' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((g) => (
                      <SelectItem key={g.value} value={g.value} disabled={g.disable}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='disabled'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn trạng thái' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='false'>Hoạt động</SelectItem>
                    <SelectItem value='true'>Khóa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isVerified'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác thực</FormLabel>
                <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Trạng thái xác thực' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='true'>Đã xác thực</SelectItem>
                    <SelectItem value='false'>Chưa xác thực</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormItem>
            <FormLabel>Ngày tạo</FormLabel>
            <Input className='!mt-1' value={format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')} disabled />
          </FormItem>
          <FormItem>
            <FormLabel>Cập nhật lần cuối</FormLabel>
            <Input className='!mt-1' value={format(new Date(user.updatedAt), 'dd/MM/yyyy HH:mm')} disabled />
          </FormItem>
        </div>

        <div className='flex !justify-center !mt-12'>
          <Button effect={'ringHover'} className='min-w-[150px]' type='submit' disabled={isLoading}>
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
