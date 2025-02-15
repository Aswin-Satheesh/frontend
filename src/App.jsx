import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import { LoginForm } from './components/login-form'
import { SignUpForm } from './components/signup-form'
import  LandingPage  from './pages/LandingPage'
import {PatientDashboard} from './pages/patient-dashboard'
import { DoctorDashboard } from './pages/Doctor-dashboard'
import { AdminDashboard } from './pages/Admin'
import React from 'react'

function App() {
  return (
    <BrowserRouter>
      {/* <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6"> */}
        <div>
          {/* <header className='h-12 max-w-7xl m-auto bg-blue-200 flex justify-between'>
            <p className='font-semibold mx-4 my-auto'>DOC +</p>
            <NavLink className="my-auto \">
              <Link to="/" className='mx-2'>Home</Link>
              <Link to="login" className='mx-2'>Login</Link>
              <Link to="signup" className='mx-2'>Sign Up</Link>
            </NavLink>
            <div className='my-auto mx-4'>
              Welcome back, aswin...
            </div>
          </header> */}
          <div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} /> 
            <Route path="/pd" element={<PatientDashboard/>} />
            <Route path="/dd" element={<DoctorDashboard/>} /> 
            <Route path="/ad" element={<AdminDashboard/>} /> 
            {/* <Route path="/" element={<Navigate to="/login" replace />} />  */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App


