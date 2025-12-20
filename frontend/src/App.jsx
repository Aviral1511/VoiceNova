import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext'
import Customize2 from './pages/Customize2'

function App() {
  const { userData } = useContext(userDataContext);

  // 🚨 VERY IMPORTANT: wait for userData to load
  if (userData === null) {
    return <div>Loading...</div>; // or spinner
  }

  const isCustomized =
    userData?.assistantImage && userData?.assistantName;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isCustomized ? <HomePage /> : <Navigate to="/customize" replace />} />
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/customize" element={userData ? <Customize /> : <Navigate to="/login" replace />} />
        <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
