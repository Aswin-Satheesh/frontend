import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm } from './components/login-form'
import { SignUpForm } from './components/signup-form'
import  LandingPage  from './pages/LandingPage'
import React from 'react'

function App() {
  return (
    <BrowserRouter>
      {/* <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6"> */}
        <div>
          <div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} /> 
            {/* <Route path="/" element={<Navigate to="/login" replace />} />  */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App


