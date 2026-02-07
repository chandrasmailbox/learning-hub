import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-serif text-primary">LearnHub</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/courses" className="text-sm font-medium hover:text-primary transition-colors">Courses</Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Button onClick={logout} variant="outline" size="sm">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
