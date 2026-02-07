import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { Badge } from '../../components/ui/badge'
import { Trophy, Target, Zap, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { blink } from '../../lib/blink'

export default function Performance() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)

  useEffect(() => {
    if (user) {
      blink.db.enrollments.list({ 
        where: { student_id: user.id },
        select: ['id', 'course_id', 'status', 'paid_amount']
      }).then(async (data) => {
        const enriched = await Promise.all(data.map(async (e: any) => {
          const course = await blink.db.courses.get(e.course_id)
          return { ...e, course }
        }))
        setEnrollments(enriched)
        if (enriched.length > 0) setSelectedCourse(enriched[0])
      })
    }
  }, [user])

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-20">
        <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
        <h2 className="text-2xl font-serif font-bold">No Active Courses</h2>
        <p className="text-muted-foreground">Enroll in a course to start tracking your performance.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">Detailed breakdown of your academic metrics and rewards.</p>
        </div>
        <select 
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[240px]"
          onChange={(e) => setSelectedCourse(enrollments.find(en => en.id === e.target.value))}
          value={selectedCourse?.id}
        >
          {enrollments.map((en) => (
            <option key={en.id} value={en.id}>{en.course.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Breakdown */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Metric Breakdown</CardTitle>
              <CardDescription>How your points are calculated for this course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Homework Completion</p>
                      <p className="text-xs text-muted-foreground">Weight: 25%</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">95/100</span>
                </div>
                <Progress value={95} className="h-2 bg-secondary" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Test/Quiz Scores</p>
                      <p className="text-xs text-muted-foreground">Weight: 40%</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">82/100</span>
                </div>
                <Progress value={82} className="h-2 bg-secondary" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-purple-50 flex items-center justify-center text-purple-500">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Engagement</p>
                      <p className="text-xs text-muted-foreground">Weight: 15%</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">100/100</span>
                </div>
                <Progress value={100} className="h-2 bg-secondary" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-amber-50 flex items-center justify-center text-amber-500">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Improvement Trajectory</p>
                      <p className="text-xs text-muted-foreground">Weight: 20%</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">88/100</span>
                </div>
                <Progress value={88} className="h-2 bg-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Achievement Badges</CardTitle>
              <CardDescription>Special recognition for your efforts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 w-28 text-center group transition-all hover:bg-primary/10 cursor-pointer border border-transparent hover:border-primary/20">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Fast Starter</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 w-28 text-center group transition-all hover:bg-primary/10 cursor-pointer border border-transparent hover:border-primary/20">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Perfect HW</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 w-28 text-center opacity-40 grayscale group cursor-not-allowed">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Top 1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Reward Calculator
                <Badge variant="outline" className="text-[10px] border-white/20 text-white uppercase tracking-tighter">Live Estimate</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="text-center py-4">
                <div className="text-sm text-white/70 mb-1 font-medium">Total Performance Score</div>
                <div className="text-6xl font-bold tracking-tighter">89.2</div>
                <div className="text-xs text-white/60 mt-2 font-bold uppercase">Points (Out of 100)</div>
              </div>
              
              <div className="space-y-3 bg-black/10 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Original Fee</span>
                  <span className="font-bold">${selectedCourse?.paid_amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Refund Rate</span>
                  <span className="font-bold text-emerald-300">95%</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="font-bold">Projected Earnings</span>
                  <span className="text-2xl font-bold">${(selectedCourse?.paid_amount * 0.95).toFixed(2)}</span>
                </div>
              </div>

              <p className="text-[10px] text-center text-white/50 italic px-4">
                *Estimated based on current weighted scores. Final refund calculated at course completion.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Next Milestone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Reach 96 Points</p>
                  <p className="text-xs text-muted-foreground">To unlock +10% Scholarship</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Progress</span>
                  <span>6.8 pts left</span>
                </div>
                <Progress value={89.2} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
