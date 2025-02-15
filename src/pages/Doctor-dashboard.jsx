import { Search, FileText, CreditCard } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, isValid, parseISO } from 'date-fns'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function DoctorDashboard() {  // Renamed from PatientDashboard
  const [searchTerm, setSearchTerm] = useState("")
  const [medications, setMedications] = useState([])
  const [selectedMedications, setSelectedMedications] = useState([])
  const [profile, setProfile] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [bills, setBills] = useState([])
  const [loadingBills, setLoadingBills] = useState(true)
  const [pharmacyOrders, setPharmacyOrders] = useState([])
  const [loadingPharmacyOrders, setLoadingPharmacyOrders] = useState(true)
  const [appointmentId, setAppointmentId] = useState(null)
  const [prescriptionDescription, setPrescriptionDescription] = useState("")
  const [loadingMedications, setLoadingMedications] = useState(true)
  const navigate = useNavigate()

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
    console.log("Current profile state:", profile)
  }, [profile])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'))
        
        if (!token) {
          console.error('No token found')
          return
        }

        const formattedDate = format(selectedDate, 'yyyy-MM-dd')
        console.log("Fetching appointments for date:", formattedDate)

        const response = await fetch(`http://localhost:8000/api/features/appointment/?date=${formattedDate}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }

        const data = await response.json()
        console.log("Appointments data:", data)
        
        const doctorAppointments = Array.isArray(data) 
          ? data.filter(apt => apt.doctor_name.toLowerCase() === profile?.user?.full_name.toLowerCase())
          : data.doctor_name.toLowerCase() === profile?.user?.full_name.toLowerCase() ? [data] : []
        
        const sortedAppointments = doctorAppointments.sort((a, b) => 
          parseInt(a.token_no) - parseInt(b.token_no)
        )
        
        setAppointments(sortedAppointments)
        console.log("Filtered appointments for doctor:", profile?.user?.full_name, sortedAppointments)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        toast.error("Failed to load appointments")
      } finally {
        setLoadingAppointments(false)
      }
    }

    if (profile?.user?.full_name) {
      fetchAppointments()
    }
  }, [selectedDate, profile])

  useEffect(() => {
    console.log("Current doctor profile:", profile)
  }, [profile])

  const formatDate = (dateString) => {
    try {
      console.log("Formatting date string:", dateString)
      if (!dateString) {
        console.log("Date string is empty or null")
        return 'No date'
      }

      const date = parseISO(dateString)
      console.log("Parsed date:", date)

      if (!isValid(date)) {
        console.log("Invalid date after parsing")
        return 'Invalid Date'
      }

      const formatted = format(date, 'PPP')
      console.log("Formatted date:", formatted)
      return formatted
    } catch (error) {
      console.error('Error formatting date:', error, "for date string:", dateString)
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString) => {
    try {
      if (!dateString) {
        console.log("Time string is empty or null")
        return 'No time'
      }

      const date = parseISO(dateString)
      console.log("Parsed time:", date)

      if (!isValid(date)) {
        console.log("Invalid time after parsing")
        return 'Invalid Time'
      }

      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      console.error('Error formatting time:', error, "for time string:", dateString)
      return 'Invalid Time'
    }
  }

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'))
        
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await fetch('http://localhost:8000/api/features/bills/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch bills')
        }

        const data = await response.json()
        console.log("Raw bills data:", data)
        
        const doctorBills = Array.isArray(data) 
          ? data.filter(bill => bill.doctor_name.toLowerCase() === profile?.user?.full_name.toLowerCase())
          : data.doctor_name.toLowerCase() === profile?.user?.full_name.toLowerCase() ? [data] : []
        
        const sortedBills = doctorBills.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )
        
        setBills(sortedBills)
      } catch (error) {
        console.error('Error fetching bills:', error)
        toast.error("Failed to load bills")
      } finally {
        setLoadingBills(false)
      }
    }

    if (profile?.user?.full_name) {
      fetchBills()
    }
  }, [profile])

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'))
        if (!token) {
          console.error('No token found')
          return
        }

        const response = await fetch('http://localhost:8000/api/features/medicines/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch medications')
        }

        const data = await response.json()
        console.log('Medications data:', data)
        setMedications(data)
      } catch (error) {
        console.error('Error fetching medications:', error)
        toast.error("Failed to load medications")
      } finally {
        setLoadingMedications(false)
      }
    }

    fetchMedications()
  }, [])

  useEffect(() => {
    const fetchPharmacyOrders = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'));
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:8000/api/features/pharmacy-orders/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pharmacy orders');
        }

        const data = await response.json();
        setPharmacyOrders(data);
      } catch (error) {
        console.error('Error fetching pharmacy orders:', error);
        toast.error("Failed to load pharmacy orders");
      } finally {
        setLoadingPharmacyOrders(false);
      }
    };

    fetchPharmacyOrders();
  }, []);

  const handleDurationChange = (medicineId, value) => {
    const duration = parseInt(value) || 1
    setSelectedMedications(prev =>
      prev.map(med =>
        med.id === medicineId
          ? { 
              ...med, 
              duration,
              quantity: duration
            }
          : med
      )
    )
  }

  const handleRemoveMedicine = (medicineId) => {
    setSelectedMedications(prev => prev.filter(med => med.id !== medicineId))
  }

  const handleDosageChange = (medicineId, value) => {
    setSelectedMedications(prev =>
      prev.map(med =>
        med.id === medicineId
          ? { ...med, dosage: value }
          : med
      )
    )
  }

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const createPrescription = async (appointmentId) => {
    try {
      const token = JSON.parse(localStorage.getItem('jwt'))
      if (!token) {
        toast.error('Authentication required')
        return
      }

      const formattedMedications = selectedMedications.map(med => ({
        medicine: parseInt(med.id),
        dosage: med.dosage,
        quantity: parseInt(med.duration),
        days: parseInt(med.duration)
      }))

      const payload = {
        description: prescriptionDescription.trim(),
        medications: formattedMedications
      }

      console.log('Sending prescription payload:', payload)

      const response = await fetch(`http://localhost:8000/api/features/prescription/${appointmentId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create prescription')
      }

      const data = await response.json()
      console.log('Prescription created:', data)

      toast.success(
        <div>
          <p>Prescription created successfully</p>
          <p className="text-sm text-gray-500">Patient: {data.patient_name}</p>
          <p className="text-sm text-gray-500">Medications: {data.medications.length}</p>
        </div>
      )

      setSelectedMedications([])
      setPrescriptionDescription("")
      setAppointmentId(null)
      
      return data
    } catch (error) {
      console.error('Error creating prescription:', error)
      toast.error(error.message || 'Failed to create prescription')
      return null
    }
  }

  const createBill = async (appointmentId) => {
    try {
      const token = JSON.parse(localStorage.getItem('jwt'))
      if (!token) {
        toast.error('Authentication required')
        return
      }

      const response = await fetch(`http://localhost:8000/api/features/bill/${appointmentId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create bill')
      }

      const data = await response.json()
      console.log('Bill created:', data)

      toast.success(
        <div>
          <p>Bill created successfully</p>
          <p className="text-sm text-gray-500">Amount: ₹{data.amount}</p>
          <p className="text-sm text-gray-500">Patient: {data.patient_name}</p>
        </div>
      )

      fetchBills()
      
      return data
    } catch (error) {
      console.error('Error creating bill:', error)
      toast.error(error.message || 'Failed to create bill')
      return null
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = JSON.parse(localStorage.getItem('jwt'));
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/features/appointment/cancel/${appointmentId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel appointment');
      }

      toast.success('Appointment cancelled successfully');
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.message || 'Failed to cancel appointment');
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-4 cursor-pointer hover:bg-accent p-2 rounded-lg transition-colors duration-200">
                <Avatar className="h-16 w-16 ring-2 ring-primary ring-offset-2">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile?.user?.full_name?.charAt(0).toUpperCase() || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">Dr. {profile?.user?.full_name || 'Loading...'}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                    {profile?.specialization || 'Loading...'}
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
                      {profile?.user?.full_name?.charAt(0) || 'D'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">Dr. {profile?.user?.full_name || 'N/A'}</h4>
                    <p className="text-sm text-muted-foreground">{profile?.specialization || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <p className="text-foreground">{profile?.user?.email || 'N/A'}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <p className="text-foreground">{profile?.user?.phone_number || 'N/A'}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <p className="text-foreground">Available: {profile?.available_from || 'N/A'} - {profile?.available_to || 'N/A'}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
                    </svg>
                    <p className="text-foreground">UPI: {profile?.upi_id || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Max Appointments</span>
                    <span className="text-foreground font-medium">{profile?.max_appointments || 'N/A'} per day</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Status</span>
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
      </div>

      <Tabs defaultValue="appointments">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="pharmacy-orders">Pharmacy Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="bills">Past Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Appointments for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
                <div className="flex items-center gap-4">
                  <Input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-auto"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <div className="flex items-center justify-center p-4">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {appointment.patient_name?.charAt(0)?.toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{appointment.patient_name || 'Unknown Patient'}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(appointment.start_time)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {formatTime(appointment.start_time)}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Token: {appointment.token_no || 'N/A'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              appointment.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : appointment.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {appointment.status || 'pending'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  navigate(`/prescription/${appointment.id}`)
                                }}
                              >
                                Start Consultation
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No appointments found for this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescribe" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Prescribe Medications</CardTitle>
                <Select 
                  onValueChange={(value) => setAppointmentId(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointments
                      .filter(apt => apt.status === 'pending')
                      .map(apt => (
                        <SelectItem key={apt.id} value={apt.id.toString()}>
                          {apt.patient_name} - Token {apt.token_no}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Diagnosis & Description
                </label>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
                  placeholder="Enter patient's diagnosis and prescription details..."
                  value={prescriptionDescription}
                  onChange={(e) => setPrescriptionDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Search Medicines</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search medicines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 min-h-[200px] space-y-2">
                    {loadingMedications ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <span className="loading loading-spinner loading-md"></span>
                      </div>
                    ) : medications.length > 0 ? (
                      medications
                        .filter(med => 
                          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          med.category.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(medicine => (
                          <div
                            key={medicine.id}
                            className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                            onClick={() => {
                              if (!selectedMedications.some(m => m.id === medicine.id)) {
                                setSelectedMedications(prev => [...prev, { 
                                  ...medicine, 
                                  duration: 1,
                                  dosage: "1 tablet"
                                }])
                              }
                            }}
                          >
                            <div>
                              <p className="font-medium">{medicine.name}</p>
                              <p className="text-sm text-muted-foreground">{medicine.category}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!selectedMedications.some(m => m.id === medicine.id)) {
                                  setSelectedMedications(prev => [...prev, { 
                                    ...medicine, 
                                    duration: 1,
                                    dosage: "1 tablet"
                                  }])
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">No Medications Found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm ? "No medications match your search" : "No medications available"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium mb-4">Selected Medicines</h3>
                  <div className="border rounded-lg p-4 min-h-[200px] space-y-2">
                    {selectedMedications.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="flex items-center justify-between p-2 bg-accent/50 rounded-md"
                      >
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">{medicine.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-sm">Days:</label>
                            <Input
                              type="number"
                              min="1"
                              value={medicine.duration}
                              onChange={(e) => handleDurationChange(medicine.id, e.target.value)}
                              className="w-16 h-8"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm">Dosage:</label>
                            <Select
                              value={medicine.dosage || "1 tablet"}
                              onValueChange={(value) => handleDosageChange(medicine.id, value)}
                              className="w-32"
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1 tablet">1 tablet</SelectItem>
                                <SelectItem value="2 tablets">2 tablets</SelectItem>
                                <SelectItem value="5 ml">5 ml</SelectItem>
                                <SelectItem value="10 ml">10 ml</SelectItem>
                                <SelectItem value="15 ml">15 ml</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            onClick={() => handleRemoveMedicine(medicine.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    {selectedMedications.length === 0 && (
                      <div className="text-center text-muted-foreground py-4">
                        No medicines selected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPrescriptionDescription("")
                    setSelectedMedications([])
                  }}
                >
                  Clear All
                </Button>
                <Button
                  disabled={selectedMedications.length === 0 || !prescriptionDescription.trim() || !appointmentId}
                  onClick={() => {
                    if (!appointmentId) {
                      toast.error('Please select an appointment')
                      return
                    }
                    createPrescription(appointmentId)
                  }}
                >
                  Create Prescription
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 mb-2" />
                  Medical Certificate
                </Button>
                <Button className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 mb-2" />
                  Discharge Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Bills</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBills ? (
                <div className="flex items-center justify-center p-4">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : bills.length > 0 ? (
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <div 
                      key={bill.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {bill.patient_name?.charAt(0)?.toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{bill.patient_name || 'Unknown Patient'}</p>
                          <p className="text-sm text-muted-foreground">
                            Bill #{bill.id} • {formatDate(bill.bill_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-green-600">₹{bill.total_amount || 0}</p>
                          <p className="text-sm text-muted-foreground">
                            {bill.payment_type}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="ml-4"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Bills Found</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't created any bills yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacy-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPharmacyOrders ? (
                <div className="flex items-center justify-center p-4">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : pharmacyOrders.length > 0 ? (
                <div className="space-y-4">
                  {pharmacyOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {order.patient_name?.charAt(0)?.toUpperCase() || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{order.patient_name || 'Unknown Patient'}</p>
                          <p className="text-sm text-muted-foreground">
                            Pharmacy: {order.pharmacy_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            OTP: {order.otp}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pharmacy orders found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}