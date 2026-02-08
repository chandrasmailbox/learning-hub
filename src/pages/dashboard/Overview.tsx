import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { blink } from '../../lib/blink'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { 
  Trophy, 
  BookOpen, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  Plus,
  Loader2
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import { toast } from 'sonner'

export default function Overview() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [deadlines, setDeadlines] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    enrolled: 0,
    averageScore: 0,
    totalRewards: 0,
    pendingAssignments: 0
  })

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const p = await blink.db.profiles.get(user.id)
          setProfile(p)
          
          if (p.role === 'student') {
            const enrolls = await blink.db.enrollments.list({ 
              where: { student_id: user.id } 
            })
            const enrichedEnrolls = await Promise.all(enrolls.map(async (e: any) => {
              const course = await blink.db.courses.get(e.course_id)
              return { ...e, course }
            }))
            setEnrollments(enrichedEnrolls)
            
            const courseIds = enrolls.map(e => e.course_id)
            if (courseIds.length > 0) {
              const allAssignments = await blink.db.assignments.list({
                where: { course_id: { in: courseIds } },
                limit: 5,
                orderBy: { created_at: 'desc' }
              })
              setDeadlines(allAssignments)
            }

            const rewardList = await blink.db.rewards.list({ where: { student_id: user.id, status: 'approved' } })
            const totalRewards = rewardList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
            const rewardPoints = rewardList.length > 0 
              ? rewardList.reduce((sum, r) => sum + (Number(r.points) || 0), 0) / rewardList.length 
              : 0

            setStats({
              enrolled: enrichedEnrolls.length,
              averageScore: Math.round(rewardPoints),
              totalRewards: totalRewards,
              pendingAssignments: 2
            })
          } else if (p.role === 'instructor') {
            const courses = await blink.db.courses.list({ where: { instructor_id: user.id } })
            const courseIds = courses.map(c => c.id)
            let totalStudents = 0
            if (courseIds.length > 0) {
              totalStudents = await blink.db.enrollments.count({ where: { course_id: { in: courseIds } } })
            }
            
            setStats({
              enrolled: courseIds.length,
              averageScore: totalStudents,
              totalRewards: 0, 
              pendingAssignments: 0
            })
          } else if (p.role === 'parent') {
            const linkedStudents = await blink.db.student_parents.list({ where: { parent_id: user.id } })
            setStats({
              enrolled: linkedStudents.length,
              averageScore: 0,
              totalRewards: 0,
              pendingAssignments: 0
            })
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [user])

  const handleSubmitAssignment = async (assignment: any) => {
    toast.info(`Submitting ${assignment.title}...`)
    setTimeout(async () => {
      try {
        await blink.db.submissions.create({
          id: `sub_${Math.random().toString(36).substring(2, 9)}`,
          assignment_id: assignment.id,
          student_id: user?.id,
          score: Math.floor(Math.random() * 20) + 80, // Mock score
          feedback: 'Great job on this assignment!'
        })
        toast.success('Assignment submitted and graded!')
      } catch (error: any) {
        toast.error(error.message || 'Submission failed')
      }
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <Card className="border-none shadow-md">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-xl font-bold">Profile Not Found</h3>
          <p className="text-muted-foreground">We couldn't find your profile. Please try logging out and back in.</p>
          <Button onClick={() => window.location.href = '/'}>Go Home</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Welcome back, {profile.full_name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your learning journey today.</p>
        </div>
        {profile.role === 'instructor' && (
          <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => window.location.href = '/dashboard/manage-courses'}>
            <Plus className="h-4 w-4" /> Create New Course
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Active</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {profile.role === 'instructor' ? 'Active Courses' : profile.role === 'parent' ? 'Linked Students' : 'Enrolled Courses'}
            </p>
            <h3 className="text-2xl font-bold">{stats.enrolled}</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Stable</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {profile.role === 'instructor' ? 'Total Students' : profile.role === 'parent' ? 'Avg. Performance' : 'Average Score'}
            </p>
            <h3 className="text-2xl font-bold">
              {profile.role === 'instructor' ? stats.averageScore : `${stats.averageScore}%`}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Trophy className="h-5 w-5" />
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => window.location.href = '/dashboard/rewards'}>
                View Wallet <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {profile.role === 'instructor' ? 'Total Earnings' : 'Total Rewards Earned'}
            </p>
            <h3 className="text-2xl font-bold">${stats.totalRewards}</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-destructive bg-destructive/5 px-2 py-1 rounded">Action Needed</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {profile.role === 'instructor' ? 'Pending Reviews' : 'Pending Tasks'}
            </p>
            <h3 className="text-2xl font-bold">{stats.pendingAssignments}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Recent Progress</CardTitle>
              <CardDescription>Track your academic trajectory across all courses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {enrollments.length > 0 ? (
                  enrollments.map((en) => (
                    <div key={en.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{en.course?.title || 'Unknown Course'}</span>
                        <span className="font-bold text-primary">85%</span>
                      </div>
                      <Progress value={85} className="h-2 bg-secondary" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No active courses yet.</p>
                    <Button variant="link" size="sm" onClick={() => window.location.href = '/dashboard/courses'}>
                      Browse Catalog
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Don't miss out on potential rewards.</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View Calendar</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deadlines.length > 0 ? (
                  deadlines.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer group">
                      <div className="h-12 w-12 rounded-lg bg-secondary flex flex-col items-center justify-center text-xs font-bold shrink-0">
                        <span className="text-primary">DUE</span>
                        <span>{a.due_date ? new Date(a.due_date).getDate() : '?'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate group-hover:text-primary transition-colors">{a.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {a.type} • {a.weight}% Weight
                        </p>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 h-8" onClick={() => handleSubmitAssignment(a)}>Submit</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
          <Card className="border-none shadow-md bg-primary text-primary-foreground overflow-hidden relative">
            <CardHeader className="relative z-10">
              <CardTitle className="text-white">Reward Goal</CardTitle>
              <CardDescription className="text-white/70">You're on track for a 90% refund!</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-4">$450.00</div>
              <p className="text-sm text-white/80 mb-6">Estimated earnings based on your current score.</p>
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90" onClick={() => window.location.href = '/dashboard/rewards'}>
                Calculator Detail
              </Button>
            </CardContent>
            {/* Decorative background shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all" onClick={() => window.location.href = '/dashboard/courses'}>
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-xs">Browse</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all" onClick={() => window.location.href = '/dashboard/rewards'}>
                <Trophy className="h-5 w-5 text-accent" />
                <span className="text-xs">Rewards</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all" onClick={() => window.location.href = '/dashboard/students'}>
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-xs">Connect</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all" onClick={() => window.location.href = '/dashboard/settings'}>
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs">Profile</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
