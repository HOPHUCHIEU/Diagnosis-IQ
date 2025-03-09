import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppSelector } from '@/redux/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetDoctorProfileQuery } from '@/redux/services/doctorApi'
import { bufferToHex } from '@/utils/utils'
import DoctorInfo from './components/DoctorInfo'
import PersonalInfo from '@/components/Dashboard/Form/PersonalInfo'

export default function ProfileDoctor() {
  const user = useAppSelector((state) => state.authState.user)
  const { data: doctorProfile, isFetching } = useGetDoctorProfileQuery(
    user?.doctorProfileId ? bufferToHex(user.doctorProfileId) : ''
  )

  return (
    <div>
      <Tabs defaultValue='personal' className='w-full'>
        <TabsList className='grid w-full grid-cols-2 max-w-[400px]'>
          <TabsTrigger value='personal'>Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value='doctor'>Thông tin bác sĩ</TabsTrigger>
        </TabsList>
        <TabsContent value='personal'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalInfo user={user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='doctor'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bác sĩ</CardTitle>
            </CardHeader>
            <CardContent>
              <DoctorInfo user={user} doctorProfile={doctorProfile?.data} loadingDoctorProfile={isFetching} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
