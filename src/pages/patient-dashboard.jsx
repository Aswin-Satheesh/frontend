import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar as CalendarIcon, CreditCard, FileText, History, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "react-hot-toast"
import { format } from "date-fns"

export function PatientDashboard() {
  const [date, setDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [profile, setProfile] = useState(null)
  const [bookingError, setBookingError] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    recentPayments: 0,
    medicalRecords: 0
  })
  const [prescriptions, setPrescriptions] = useState([])
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true)

  // Example time slots - In real app, fetch this from API based on selected date
  const timeSlots = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '02:00 PM', available: true },
    { id: '5', time: '03:00 PM', available: true },
    { id: '6', time: '04:00 PM', available: true },
  ]

  const handleDateSelect = (newDate) => {
    setDate(newDate)
    setSelectedSlot(null) // Reset selected slot when date changes
  }

  const handleBookAppointment = async () => {
    if (!date || !selectedSlot || !description || !selectedDoctor) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const token = JSON.parse(localStorage.getItem('jwt'))
      if (!token) {
        toast.error("Authentication required")
        return
      }

      // Format the date and time for the API
      const startTime = new Date(date)
      const [hours, minutes] = selectedSlot.time.split(' ')[0].split(':') // Handle "09:00 AM" format
      const isPM = selectedSlot.time.includes('PM')
      
      // Convert to 24-hour format
      let hour = parseInt(hours)
      if (isPM && hour !== 12) hour += 12
      if (!isPM && hour === 12) hour = 0
      
      startTime.setHours(hour, parseInt(minutes), 0)

      // Create end time (assuming 1-hour appointments)
      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + 1)

      // Format dates to match required format YYYY-MM-DDTHH:mm:ss
      const formatDate = (date) => {
        return date.toISOString().split('.')[0]
      }

      const appointmentData = {
        doctor_id: parseInt(selectedDoctor),
        start_time: formatDate(startTime),
        end_time: formatDate(endTime),
        description: description
      }

      console.log('Sending appointment data:', appointmentData) // Debug log

      const response = await fetch('http://localhost:8000/api/features/appointment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      })

      console.log('Response status:', response.status) // Debug log

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const text = await response.text() // Get raw response text
        console.error('Error response text:', text) // Debug log
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Response data:', data) // Debug log

      if (data.status === "appointment booked successfully") {
        toast.success("Appointment booked successfully!")
        console.log("Appointment details:", data["appointment data"])
        
        // Reset form
        setDate(null)
        setSelectedSlot(null)
        setDescription("")
        setSelectedDoctor(null)
        setShowBooking(false)
      } else {
        throw new Error(data.message || 'Failed to book appointment')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error(error.message || "Failed to book appointment")
      setBookingError(error.message)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'))
        console.log("Token:", token)
        
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await fetch('http://localhost:8000/api/auth/user/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log("Profile data:", data)
          setProfile(data)
        } else {
          const errorData = await response.json()
          console.error("Error response:", errorData)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'))
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await fetch('http://localhost:8000/api/auth/doctors/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch doctors')
        }

        const data = await response.json()
        console.log('Doctors data:', data)
        setDoctors(data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
        toast.error("Failed to load doctors")
      } finally {
        setLoadingDoctors(false)
      }
    }

    fetchDoctors()
  }, [])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'))
        if (!token) {
          console.error('No token found')
          return
        }

        // Get the patient ID from the profile
        const patientId = profile?.id
        if (!patientId) {
          console.error('No patient ID found')
          return
        }

        const response = await fetch(`http://localhost:8000/api/features/appointment/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }

        const data = await response.json()
        // Filter appointments for the current patient
        const patientAppointments = Array.isArray(data) 
          ? data.filter(apt => apt.patient === patientId)
          : [data]
        setAppointments(patientAppointments)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        toast.error("Failed to load appointments")
      } finally {
        setLoadingAppointments(false)
      }
    }

    // Only fetch appointments if we have the profile
    if (profile?.id) {
      fetchAppointments()
    }
  }, [profile]) // Depend on profile to ensure we have the patient ID

  useEffect(() => {
    if (appointments.length > 0) {
      const now = new Date()
      const upcomingCount = appointments.filter(apt => {
        const aptDate = new Date(apt.start_time)
        return aptDate > now && apt.status !== 'cancelled'
      }).length

      setStats(prev => ({
        ...prev,
        upcomingAppointments: upcomingCount
      }))
    }
  }, [appointments])

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'))
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await fetch('http://localhost:8000/api/features/prescription/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch prescriptions')
        }

        const data = await response.json()
        console.log('Prescriptions data:', data)
        setPrescriptions(data)
        
        // Update stats for active prescriptions
        const activePrescriptions = data.filter(prescription => 
          prescription.medications.some(med => med.days > 0)
        ).length
        
        setStats(prev => ({
          ...prev,
          activePrescriptions
        }))
      } catch (error) {
        console.error('Error fetching prescriptions:', error)
        toast.error("Failed to load prescriptions")
      } finally {
        setLoadingPrescriptions(false)
      }
    }

    fetchPrescriptions()
  }, [])

  // Helper function to format date
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString()
    }
  }

  // Helper function to format time
  const formatAppointmentTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-8">
        <div className="flex items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-4 cursor-pointer hover:bg-accent p-2 rounded-lg transition-colors duration-200">
                  <Avatar className="h-16 w-16 ring-2 ring-primary ring-offset-2">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || 'Loading...'}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                      Patient ID: {profile?.id || 'Loading...'}
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="p-6 w-80 bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/85 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile?.full_name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{profile?.full_name || 'N/A'}</h4>
                      <p className="text-sm text-muted-foreground">{profile?.user_type || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      <p className="text-foreground">{profile?.email || 'N/A'}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <p className="text-foreground">{profile?.phone_number || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Account Status</span>
                      <span className="inline-flex items-center gap-1 text-green-500">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Dashboard Content */}
        <div className="mt-8">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="book">Book Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Appointments
                    </CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.upcomingAppointments === 0 ? 'No upcoming appointments' : 
                       stats.upcomingAppointments === 1 ? '1 scheduled visit' : 
                       `${stats.upcomingAppointments} scheduled visits`}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Prescriptions
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activePrescriptions}</div>
                    <p className="text-xs text-muted-foreground mt-1">Current medications</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Recent Payments
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.recentPayments}</div>
                    <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Medical Records
                    </CardTitle>
                    <History className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.medicalRecords}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total documents</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loadingAppointments ? (
                        <div className="flex items-center justify-center p-4">
                          <span className="loading loading-spinner loading-md"></span>
                        </div>
                      ) : appointments.length > 0 ? (
                        appointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">Dr. {appointment.doctor_name}</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  appointment.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {appointment.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{appointment.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">Token: {appointment.token_no}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatAppointmentDate(appointment.start_time)}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatAppointmentTime(appointment.start_time)} - {formatAppointmentTime(appointment.end_time)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground">No upcoming appointments</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-4">
              {/* Appointments content */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add appointment list/calendar here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingPrescriptions ? (
                    <div className="flex items-center justify-center p-4">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  ) : prescriptions.length > 0 ? (
                    <div className="space-y-4">
                      {prescriptions.map((prescription) => (
                        <div 
                          key={prescription.id} 
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Dr. {prescription.doctor_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Prescribed on: {format(new Date(prescription.created_at), 'PPP')}
                              </p>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    Appointment #{prescription.appointment}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Appointment Reference Number</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm font-medium">Diagnosis & Description:</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {prescription.description}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">Prescribed Medications:</p>
                            <div className="grid gap-2">
                              {prescription.medications.map((medication) => (
                                <div 
                                  key={medication.id}
                                  className="flex items-center justify-between p-2 bg-accent/50 rounded-md"
                                >
                                  <div>
                                    <p className="font-medium">{medication.medicine_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Dosage: {medication.dosage}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm">
                                    <p>Quantity: {medication.quantity}</p>
                                    <p className="text-muted-foreground">
                                      Duration: {medication.days} days
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>Prescription #{prescription.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-lg mb-2">No Prescriptions Found</h3>
                      <p className="text-sm text-muted-foreground">
                        You don't have any prescriptions yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              {/* Medical Records content */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add medical records here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              {/* Payments content */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add payment history here */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="book" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Book Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Doctor Selection */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Select Doctor</h3>
                      {loadingDoctors ? (
                        <div className="flex items-center justify-center p-4">
                          <span className="loading loading-spinner loading-md"></span>
                        </div>
                      ) : doctors.length > 0 ? (
                        <RadioGroup onValueChange={setSelectedDoctor} value={selectedDoctor}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {doctors.map((doctor) => (
                              <div key={doctor.user.id} className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value={doctor.user.id.toString()} 
                                  id={`doctor-${doctor.user.id}`}
                                />
                                <Label htmlFor={`doctor-${doctor.user.id}`} className="w-full">
                                  <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 w-full">
                                    <div className="flex items-center space-x-4">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src="/avatar.png" />
                                        <AvatarFallback>
                                          {doctor.user.full_name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">DR. {doctor.user.full_name.toUpperCase()}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {doctor.specialization || 'General Physician'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="12 6 12 12 16 14"/>
                                          </svg>
                                          Available: {doctor.available_from} - {doctor.available_to}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground flex flex-col items-end">
                                      <p>ID: {doctor.user.id}</p>
                                      <p className="mt-1">Max: {doctor.max_appointments}/day</p>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          No doctors available at the moment
                        </div>
                      )}
                    </div>

                    {selectedDoctor && (
                      <>
                        {/* Calendar and Time Slots */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium mb-4">Select Date</h3>
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={handleDateSelect}
                              className="rounded-md border"
                              disabled={(date) => date < new Date()}
                            />
                          </div>

                          <div>
                            <h3 className="font-medium mb-4">Available Time Slots</h3>
                            {date ? (
                              <div className="grid grid-cols-2 gap-2">
                                {timeSlots.map((slot) => (
                                  <Button
                                    key={slot.id}
                                    variant={selectedSlot === slot ? "default" : "outline"}
                                    onClick={() => setSelectedSlot(slot)}
                                    className="w-full"
                                    disabled={!slot.available}
                                  >
                                    {slot.time}
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">Please select a date first</p>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label htmlFor="description">Appointment Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Please describe your symptoms or reason for visit..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>

                        {bookingError && (
                          <p className="text-red-500 text-sm">{bookingError}</p>
                        )}

                        {/* Book Button */}
                        <Button 
                          className="w-full"
                          disabled={!date || !selectedSlot || !description}
                          onClick={handleBookAppointment}
                        >
                          Confirm Booking
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}