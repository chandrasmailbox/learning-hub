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
  Plus
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'

export default function Overview() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>({
    enrolled: 0,
    averageScore: 0,
    totalRewards: 0,
    pendingAssignments: 0
  })

  useEffect(() => {
    if (user) {
      blink.db.profiles.get(user.id).then(setProfile)
      // Mock stats for now
      setStats({
        enrolled: 3,
        averageScore: 88,
        totalRewards: 1250,
        pendingAssignments: 4
      })
    }
  }, [user])

  if (!profile) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Welcome back, {profile.full_name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your learning journey today.</p>
        </div>
        {profile.role === 'instructor' && (
          <Button className="bg-primary hover:bg-primary/90 gap-2">
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
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">+2 this month</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
            <h3 className="text-2xl font-bold">{stats.enrolled}</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">+5%</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Average Score</p>
            <h3 className="text-2xl font-bold">{stats.averageScore}%</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Trophy className="h-5 w-5" />
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                View Wallet <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Rewards Earned</p>
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
            <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Advanced Mathematics</span>
                    <span className="font-bold text-primary">92%</span>
                  </div>
                  <Progress value={92} className="h-2 bg-secondary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Python for Data Science</span>
                    <span className="font-bold text-primary">85%</span>
                  </div>
                  <Progress value={85} className="h-2 bg-secondary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Academic Writing</span>
                    <span className="font-bold text-primary">78%</span>
                  </div>
                  <Progress value={78} className="h-2 bg-secondary" />
                </div>
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
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer group">
                    <div className="h-12 w-12 rounded-lg bg-secondary flex flex-col items-center justify-center text-xs font-bold shrink-0">
                      <span className="text-primary">FEB</span>
                      <span>{12 + i}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate group-hover:text-primary transition-colors">Calculus Assignment #{i}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Due in {i * 2} days • 25 Points
                      </p>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 h-8">Submit</Button>
                  </div>
                ))}
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
              <p className="text-sm text-white/80 mb-6">Estimated earnings based on your current 88% average score.</p>
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">
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
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-xs">Browse</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all">
                <Trophy className="h-5 w-5 text-accent" />
                <span className="text-xs">Rewards</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-xs">Connect</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-auto py-4 gap-2 border-border/50 hover:border-primary hover:bg-primary/5 transition-all">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs">Profile</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
