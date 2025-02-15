import { useState } from "react"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Calendar, 
  LineChart, 
  Package, 
  FileText, 
  Pill,
  UserPlus,
  Search,
  Trash2,
  X
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-hot-toast"

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreatingDoctor, setIsCreatingDoctor] = useState(false)
  const [newDoctor, setNewDoctor] = useState({
    full_name: "",
    email: "",
    password: "",
    specialization: "",
    phone_number: "",
    available_from: "08:00:00",
    available_to: "20:00:00",
    upi_id: "",
    max_appointments: 10
  })

  // Example data
  const statistics = {
    totalPatients: 1250,
    totalDoctors: 45,
    totalAppointments: 180,
    totalRevenue: 52000
  }

  const recentUsers = [
    { id: 1, name: "John Doe", type: "Patient", date: "2024-03-21" },
    { id: 2, name: "Dr. Smith", type: "Doctor", date: "2024-03-20" },
    { id: 3, name: "Jane Wilson", type: "Staff", date: "2024-03-19" },
  ]

  // Example specializations
  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "General Physician",
    "Neurologist",
    "Pediatrician",
    "Psychiatrist",
    "Surgeon"
  ]

  const handleCreateDoctor = async (e) => {
    e.preventDefault()
    console.log("Form submitted", newDoctor)
    
    try {
      const token = JSON.parse(localStorage.getItem('jwt'))
      if (!token) {
        toast.error("Authentication required")
        console.log("Authentication required")
        return
      }

      console.log("Sending request with token:", token)

      const response = await fetch('http://localhost:8000/api/auth/create-doctor/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDoctor)
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Success response:", data)
        toast.success("Doctor account created successfully!")
        setIsCreatingDoctor(false)
        setNewDoctor({
          full_name: "",
          email: "",
          password: "",
          specialization: "",
          phone_number: "",
          available_from: "08:00:00",
          available_to: "20:00:00",
          upi_id: "",
          max_appointments: 10
        })
      } else {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.message || 'Failed to create doctor account')
      }
    } catch (error) {
      toast.error(error.message || "Failed to create doctor account")
      console.error('Error creating doctor:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Dialog open={isCreatingDoctor} onOpenChange={setIsCreatingDoctor}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Doctor Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Doctor Account</DialogTitle>
                <DialogDescription>
                  Enter the doctor's details to create their account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDoctor}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="full_name" className="text-right">
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      value={newDoctor.full_name}
                      onChange={(e) => setNewDoctor({ ...newDoctor, full_name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newDoctor.email}
                      onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newDoctor.password}
                      onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="specialization" className="text-right">
                      Specialization
                    </Label>
                    <Select
                      value={newDoctor.specialization}
                      onValueChange={(value) => setNewDoctor({ ...newDoctor, specialization: value })}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone_number" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone_number"
                      value={newDoctor.phone_number}
                      onChange={(e) => setNewDoctor({ ...newDoctor, phone_number: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="available_from" className="text-right">
                      Available From
                    </Label>
                    <Input
                      id="available_from"
                      type="time"
                      value={newDoctor.available_from}
                      onChange={(e) => setNewDoctor({ ...newDoctor, available_from: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="available_to" className="text-right">
                      Available To
                    </Label>
                    <Input
                      id="available_to"
                      type="time"
                      value={newDoctor.available_to}
                      onChange={(e) => setNewDoctor({ ...newDoctor, available_to: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="upi_id" className="text-right">
                      UPI ID
                    </Label>
                    <Input
                      id="upi_id"
                      value={newDoctor.upi_id}
                      onChange={(e) => setNewDoctor({ ...newDoctor, upi_id: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="max_appointments" className="text-right">
                      Max Appointments
                    </Label>
                    <Input
                      id="max_appointments"
                      type="number"
                      value={newDoctor.max_appointments}
                      onChange={(e) => setNewDoctor({ ...newDoctor, max_appointments: parseInt(e.target.value) })}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateDoctor}>Create Account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Patients
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalPatients}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Doctors
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalDoctors}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Appointments
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalAppointments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${statistics.totalRevenue}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.type}</TableCell>
                        <TableCell>{user.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* User management content */}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs will be implemented similarly */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Appointment management content */}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}