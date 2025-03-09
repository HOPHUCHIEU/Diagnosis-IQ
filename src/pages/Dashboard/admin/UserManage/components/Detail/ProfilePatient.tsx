import { useState, useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  useGetPatientRecordQuery,
  useCreatePatientRecordMutation,
  useUpdatePatientRecordMutation
} from '@/redux/services/patientApi'
import { toast } from 'react-toastify'
import { CustomNotification } from '@/components/CustomReactToastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import { User } from '@/types/user.type'
import { patientRecordSchema, type PatientRecordSchema } from '@/utils/rules'
import { bufferToHex } from '@/utils/utils'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Pencil } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { BLOOD_TYPES, RELATIONSHIPS, INSURANCE_PROVIDERS } from '@/constants/schedules.patient'
import { useGetAllUserQuery } from '@/redux/services/userApi'
import { CreatePatientRecordInput, UpdatePatientRecordInput } from '@/types/patient.type'

interface Props {
  user: User
  onClose?: () => void
}

export default function ProfilePatient({ user, onClose }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const { refetch: refetchGetAllUser } = useGetAllUserQuery(null)
  const {
    data: patientRecord,
    isLoading,
    refetch: refetchGetPatientRecord
  } = useGetPatientRecordQuery(user?.patientId ? bufferToHex(user.patientId) : '', { skip: !user?.patientId })
  const [createRecord, { isLoading: isCreating }] = useCreatePatientRecordMutation()
  const [updateRecord, { isLoading: isUpdating }] = useUpdatePatientRecordMutation()

  const form = useForm<PatientRecordSchema>({
    resolver: yupResolver(patientRecordSchema),
    defaultValues: {
      occupation: '',
      bloodType: 'A+',
      height: 0,
      weight: 0,
      allergies: [],
      chronicDiseases: [],
      familyHistory: '',
      surgeryHistory: '',
      isPregnant: false,
      currentMedications: [],
      lifestyle: {
        smoking: false,
        alcohol: false,
        exercise: '',
        diet: ''
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: 'Khác'
      },
      insurance: {
        number: '',
        provider: 'Bảo hiểm y tế nhà nước',
        expired: new Date().toISOString()
      }
    }
  })

  // Reset form with patient data when entering edit mode or when data changes
  useEffect(() => {
    if (isEditing && patientRecord?.data) {
      form.reset({
        occupation: patientRecord.data.occupation,
        bloodType: patientRecord.data.bloodType,
        height: patientRecord.data.height,
        weight: patientRecord.data.weight,
        allergies: patientRecord.data.allergies,
        chronicDiseases: patientRecord.data.chronicDiseases,
        familyHistory: patientRecord.data.familyHistory,
        surgeryHistory: patientRecord.data.surgeryHistory,
        isPregnant: patientRecord.data.isPregnant,
        currentMedications: patientRecord.data.currentMedications,
        lifestyle: {
          smoking: patientRecord.data.lifestyle.smoking,
          alcohol: patientRecord.data.lifestyle.alcohol,
          exercise: patientRecord.data.lifestyle.exercise,
          diet: patientRecord.data.lifestyle.diet
        },
        emergencyContact: {
          name: patientRecord.data.emergencyContact.name,
          phone: patientRecord.data.emergencyContact.phone,
          relationship: patientRecord.data.emergencyContact.relationship
        },
        insurance: {
          number: patientRecord.data.insurance.number,
          provider: patientRecord.data.insurance.provider,
          expired: patientRecord.data.insurance.expired
        }
      })
    }
  }, [isEditing, patientRecord?.data, form])

  const onSubmit = async (data: PatientRecordSchema) => {
    try {
      if (patientRecord?.data) {
        const formData = { ...data, patient: bufferToHex(user._id) }

        await updateRecord({
          data: formData as UpdatePatientRecordInput
        }).unwrap()
        refetchGetPatientRecord()
        toast.success(CustomNotification, {
          data: { title: 'Thành công!', content: 'Cập nhật hồ sơ bệnh nhân thành công' }
        })
      } else {
        await createRecord({
          ...(data as CreatePatientRecordInput),
          patient: bufferToHex(user._id)
        }).unwrap()
        refetchGetAllUser()
        toast.success(CustomNotification, {
          data: { title: 'Thành công!', content: 'Tạo hồ sơ bệnh nhân thành công' }
        })
        onClose && onClose()
      }
      setIsEditing(false)
    } catch (error: any) {
      console.log('Error:', error)
    }
  }

  if (!user?.patientId && !isEditing) {
    return (
      <div className='flex flex-col items-center justify-center p-8 space-y-4'>
        <p className='text-gray-500'>Chưa có hồ sơ bệnh nhân</p>
        <Button variant='outline' onClick={() => setIsEditing(true)}>
          <Pencil className='w-4 h-4 mr-2' />
          Tạo hồ sơ
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <div className='w-8 h-8 border-b-2 rounded-full animate-spin border-primary'></div>
      </div>
    )
  }

  const renderField = (label: string, value: string | number | boolean) => {
    return (
      <div className='py-2'>
        <div className='text-sm text-gray-500'>{label}</div>
        <div className='mt-1'>{typeof value === 'boolean' ? (value ? 'Có' : 'Không') : value || '—'}</div>
      </div>
    )
  }

  const renderArrayField = (label: string, items: string[] = []) => {
    return (
      <div className='py-2'>
        <div className='text-sm text-gray-500'>{label}</div>
        <div className='flex flex-wrap gap-2 mt-1'>
          {items.length > 0
            ? items.map((item, index) => (
                <div key={index} className='px-3 py-1 text-sm bg-gray-100 rounded-full'>
                  {item}
                </div>
              ))
            : '—'}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button variant='outline' size='sm' onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            'Hủy'
          ) : (
            <>
              <Pencil className='w-4 h-4 mr-2' />
              Chỉnh sửa
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='occupation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghề nghiệp</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bloodType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhóm máu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn nhóm máu' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BLOOD_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Physical Measurements */}
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='height'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều cao (cm)</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(e) => field.onChange(+e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cân nặng (kg)</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} onChange={(e) => field.onChange(+e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Arrays Sections */}
            <div className='grid gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='allergies'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dị ứng</FormLabel>
                    <FormControl>
                      <div className='space-y-2'>
                        <Input
                          placeholder='Nhập dị ứng và nhấn Enter để thêm'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const target = e.target as HTMLInputElement
                              if (target.value.trim()) {
                                field.onChange([...field.value, target.value.trim()])
                                target.value = ''
                              }
                            }
                          }}
                        />
                        <div className='flex flex-wrap gap-2'>
                          {field.value?.map((item, index) => (
                            <Button
                              key={index}
                              variant='secondary'
                              size='sm'
                              onClick={() => {
                                const newItems = [...field.value]
                                newItems.splice(index, 1)
                                field.onChange(newItems)
                              }}
                            >
                              {item} ×
                            </Button>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='chronicDiseases'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bệnh mãn tính</FormLabel>
                    <FormControl>
                      <div className='space-y-2'>
                        <Input
                          placeholder='Nhập bệnh và nhấn Enter để thêm'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const target = e.target as HTMLInputElement
                              if (target.value.trim()) {
                                field.onChange([...field.value, target.value.trim()])
                                target.value = ''
                              }
                            }
                          }}
                        />
                        <div className='flex flex-wrap gap-2'>
                          {field.value?.map((item, index) => (
                            <Button
                              key={index}
                              variant='secondary'
                              size='sm'
                              onClick={() => {
                                const newItems = [...field.value]
                                newItems.splice(index, 1)
                                field.onChange(newItems)
                              }}
                            >
                              {item} ×
                            </Button>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Medical History */}
            <FormField
              control={form.control}
              name='familyHistory'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiền sử gia đình</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='surgeryHistory'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiền sử phẫu thuật</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lifestyle Section */}
            <Card>
              <CardContent className='pt-6'>
                <h3 className='mb-4 text-lg font-semibold'>Lối sống</h3>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='lifestyle.smoking'
                    render={({ field }) => (
                      <FormItem className='flex items-center justify-between'>
                        <FormLabel>Hút thuốc</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='lifestyle.alcohol'
                    render={({ field }) => (
                      <FormItem className='flex items-center justify-between'>
                        <FormLabel>Uống rượu</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='lifestyle.exercise'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tập thể dục</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder='Mô tả chế độ tập luyện...' />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='lifestyle.diet'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chế độ ăn</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder='Mô tả chế độ ăn uống...' />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardContent className='pt-6'>
                <h3 className='mb-4 text-lg font-semibold'>Liên hệ khẩn cấp</h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='emergencyContact.name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên người liên hệ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='emergencyContact.phone'
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

                  <FormField
                    control={form.control}
                    name='emergencyContact.relationship'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mối quan hệ</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn mối quan hệ' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RELATIONSHIPS.map((rel) => (
                              <SelectItem key={rel} value={rel}>
                                {rel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Insurance Information */}
            <Card>
              <CardContent className='pt-6'>
                <h3 className='mb-4 text-lg font-semibold'>Thông tin bảo hiểm</h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='insurance.number'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số bảo hiểm</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='insurance.provider'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhà cung cấp</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn nhà cung cấp' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INSURANCE_PROVIDERS.map((provider) => (
                              <SelectItem key={provider} value={provider}>
                                {provider}
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
                    name='insurance.expired'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày hết hạn</FormLabel>
                        <FormControl>
                          <Input
                            type='date'
                            {...field}
                            value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className='flex justify-end gap-4'>
              <Button effect='ringHover' type='submit' disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? 'Đang xử lý...' : patientRecord?.data ? 'Cập nhật' : 'Tạo hồ sơ'}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className='space-y-6'>
          <Card>
            <CardContent className='pt-6'>
              <h3 className='mb-2 text-lg font-semibold'>Thông tin cơ bản</h3>
              {renderField('Nghề nghiệp', patientRecord?.data?.occupation || '—')}
              {renderField('Nhóm máu', patientRecord?.data?.bloodType || '—')}
              {renderField('Chiều cao', `${patientRecord?.data?.height} cm`)}
              {renderField('Cân nặng', `${patientRecord?.data?.weight} kg`)}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <h3 className='mb-2 text-lg font-semibold'>Tiền sử bệnh</h3>
              {renderArrayField('Dị ứng', patientRecord?.data?.allergies)}
              {renderArrayField('Bệnh mãn tính', patientRecord?.data?.chronicDiseases)}
              {renderField('Tiền sử gia đình', patientRecord?.data?.familyHistory || '—')}
              {renderField('Tiền sử phẫu thuật', patientRecord?.data?.surgeryHistory || '—')}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <h3 className='mb-2 text-lg font-semibold'>Lối sống</h3>
              {renderField('Hút thuốc', patientRecord?.data?.lifestyle?.smoking || false)}
              {renderField('Uống rượu', patientRecord?.data?.lifestyle?.alcohol || false)}
              {renderField('Tập thể dục', patientRecord?.data?.lifestyle?.exercise || '—')}
              {renderField('Chế độ ăn', patientRecord?.data?.lifestyle?.diet || '—')}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <h3 className='mb-2 text-lg font-semibold'>Liên hệ khẩn cấp</h3>
              {renderField('Tên người liên hệ', patientRecord?.data?.emergencyContact?.name || '—')}
              {renderField('Số điện thoại', patientRecord?.data?.emergencyContact?.phone || '—')}
              {renderField('Mối quan hệ', patientRecord?.data?.emergencyContact?.relationship || '—')}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <h3 className='mb-2 text-lg font-semibold'>Thông tin bảo hiểm</h3>
              {renderField('Số bảo hiểm', patientRecord?.data?.insurance?.number || '—')}
              {renderField('Nhà cung cấp', patientRecord?.data?.insurance?.provider || '—')}
              {renderField(
                'Ngày hết hạn',
                format(new Date(patientRecord?.data?.insurance?.expired || new Date()), 'dd/MM/yyyy')
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
