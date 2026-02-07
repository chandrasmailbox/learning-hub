import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Users, UserPlus, CreditCard, ArrowRight, ShieldCheck, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { blink } from '../../lib/blink'
import { toast } from 'sonner'

export default function ParentDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState<any[]>([])
  const [studentEmail, setStudentEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchStudents()
  }, [user])

  const fetchStudents = async () => {
    try {
      const data = await blink.db.student_parents.list({ 
        where: { parent_id: user?.id } 
      })
      const enriched = await Promise.all(data.map(async (sp: any) => {
        const profile = await blink.db.profiles.get(sp.student_id)
        return { ...sp, profile }
      }))
      setStudents(enriched)
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Find student by email (assuming email is used as ID or we need to find profile)
      // For demo, we'll simulate finding a student
      toast.info(`Searching for student: ${studentEmail}`)
      
      setTimeout(async () => {
        try {
          // Mock successful link for demo
          const mockStudentId = `student_${Math.random().toString(36).substring(2, 9)}`
          
          await blink.db.student_parents.create({
            id: `sp_${Math.random().toString(36).substring(2, 9)}`,
            parent_id: user?.id,
            student_id: mockStudentId,
            status: 'linked'
          })
          
          toast.success('Student linked successfully!')
          setStudentEmail('')
          fetchStudents()
        } catch (err: any) {
          toast.error(err.message)
        } finally {
          setLoading(false)
        }
      }, 1000)
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Family Management</h1>
          <p className="text-muted-foreground">Link your students and manage their educational funds.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-sm font-bold">Secure Account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Linked Students List */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Linked Students</CardTitle>
              <CardDescription>Track progress and approve reward withdrawals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.length > 0 ? (
                  students.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-secondary/30 transition-all group">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {s.profile?.full_name?.charAt(0) || "S"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold">{s.profile?.full_name || "New Student"}</h4>
                        <p className="text-xs text-muted-foreground">Active Enrollments: 2 • Average: 92%</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase text-[10px]">
                        {s.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="group-hover:text-primary transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-border">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-sm text-muted-foreground font-medium">No students linked yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-border/50">
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 flex items-center gap-4">
                    <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Funded <span className="font-bold">Calculus II</span> for Leo</p>
                      <p className="text-xs text-muted-foreground">Feb {10 + i}, 2026 • $499.00</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Add Student Form */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" /> Link a Student
              </CardTitle>
              <CardDescription>Enter their registered email to link accounts.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLinkStudent}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Student Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="student-email" 
                      placeholder="student@example.com" 
                      className="pl-10" 
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90" type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Send Link Request
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="border-none shadow-md bg-foreground text-background">
            <CardHeader>
              <CardTitle className="text-white">Funding Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs text-background/60 font-bold uppercase">Total Invested</p>
                <p className="text-3xl font-bold tracking-tight">$1,497.00</p>
              </div>
              <div className="space-y-1 text-primary">
                <p className="text-xs text-background/60 font-bold uppercase">Expected Refund</p>
                <p className="text-3xl font-bold tracking-tight">$1,245.50</p>
              </div>
              <Button className="w-full bg-primary text-white hover:bg-primary/90">
                Manage Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
