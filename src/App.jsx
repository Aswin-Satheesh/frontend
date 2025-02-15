import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom'
import { LoginForm } from './components/login-form'
import { SignUpForm } from './components/signup-form'
import LandingPage from './pages/LandingPage'
import { PatientDashboard } from './pages/patient-dashboard'
import { DoctorDashboard } from './pages/Doctor-dashboard'
import { AdminDashboard } from './pages/Admin'
import { Prescription } from './pages/Prescription'
import { Bill } from './pages/Bill'
import React from 'react'

function App() {
  return (
    <Router>
      <div>
        <div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/pd" element={<PatientDashboard />} />
            <Route path="/dd" element={<DoctorDashboard />} />
            <Route path="/ad" element={<AdminDashboard />} />
            <Route path="/prescription/:appointmentId" element={<Prescription />} />
            <Route path="/bill/:appointmentId" element={<Bill />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App


