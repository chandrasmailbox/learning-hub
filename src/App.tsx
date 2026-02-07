import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Overview from './pages/dashboard/Overview'
import CourseBuilder from './pages/dashboard/CourseBuilder'
import CourseCatalog from './pages/dashboard/CourseCatalog'
import Performance from './pages/dashboard/Performance'
import ParentDashboard from './pages/dashboard/ParentDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import Wallet from './pages/dashboard/Wallet'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { useAuth } from './hooks/useAuth'
import { Loader2 } from 'lucide-react'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <DashboardLayout>{children}</DashboardLayout>
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/manage-courses" 
          element={
            <PrivateRoute>
              <CourseBuilder />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/courses" 
          element={
            <PrivateRoute>
              <CourseCatalog />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/analytics" 
          element={
            <PrivateRoute>
              <Performance />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/students" 
          element={
            <PrivateRoute>
              <ParentDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/rewards" 
          element={
            <PrivateRoute>
              <Wallet />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/*" 
          element={
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          } 
        />
      </Routes>
      <Toaster position="top-center" richColors />
    </Router>
  )
}

export default App
