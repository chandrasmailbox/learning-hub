import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { GraduationCap, ArrowLeft, Loader2, User, Users, GraduationCap as StudentIcon, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { blink } from '../lib/blink'
import { toast } from 'sonner'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'parent' | 'student' | 'instructor' | 'admin'>('student')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Sign up with Blink Auth
      const { user } = await signUp(email, password, { role, fullName })
      
      if (user) {
        // 2. Create profile in DB
        await blink.db.profiles.create({
          user_id: user.id,
          full_name: fullName,
          email: email,
          role: role,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
        })
        
        toast.success('Account created successfully')
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="absolute top-8 left-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-none my-8">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif font-bold">Create an Account</CardTitle>
          <CardDescription>
            Join LearnHub today and start your educational journey
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Select your role</Label>
              <RadioGroup value={role} onValueChange={(v: any) => setRole(v)} className="grid grid-cols-2 gap-4">
                <Label
                  htmlFor="student"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all ${role === 'student' ? 'border-primary bg-primary/5' : ''}`}
                >
                  <RadioGroupItem value="student" id="student" className="sr-only" />
                  <StudentIcon className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Student</span>
                </Label>
                <Label
                  htmlFor="parent"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all ${role === 'parent' ? 'border-primary bg-primary/5' : ''}`}
                >
                  <RadioGroupItem value="parent" id="parent" className="sr-only" />
                  <Users className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Parent</span>
                </Label>
                <Label
                  htmlFor="instructor"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all ${role === 'instructor' ? 'border-primary bg-primary/5' : ''}`}
                >
                  <RadioGroupItem value="instructor" id="instructor" className="sr-only" />
                  <User className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Instructor</span>
                </Label>
                <Label
                  htmlFor="admin"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all ${role === 'admin' ? 'border-primary bg-primary/5' : ''}`}
                >
                  <RadioGroupItem value="admin" id="admin" className="sr-only" />
                  <ShieldCheck className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Admin</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-11 bg-primary hover:bg-primary/90" type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
