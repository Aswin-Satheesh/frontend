import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/login-form";


function App() {
  return (
    
    <Router>
      <div>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
    
        <Routes>
        
        
        </Routes>
     </div> 
    </Router>

  );
}

export default App;
