import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Check, X, ShieldAlert, TrendingUp, DollarSign, BookOpen, Loader2 } from 'lucide-react'
import { blink } from '../../lib/blink'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingRewards()
  }, [])

  const fetchPendingRewards = async () => {
    try {
      const data = await blink.db.rewards.list({ 
        where: { status: 'pending' } 
      })
      // For demo, we'll enrich with student names and course titles
      const enriched = await Promise.all(data.map(async (r: any) => {
        const student = await blink.db.profiles.get(r.student_id)
        const course = await blink.db.courses.get(r.course_id)
        return { ...r, studentName: student?.full_name || "Unknown", courseTitle: course?.title || "Unknown" }
      }))
      setRewards(enriched)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (id: string, approved: boolean) => {
    try {
      await blink.db.rewards.update(id, { 
        status: approved ? 'approved' : 'rejected' 
      })
      toast.success(approved ? 'Reward approved' : 'Reward rejected')
      fetchPendingRewards()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Platform Oversight</h1>
        <p className="text-muted-foreground">Manage approvals, monitor performance, and ensure financial integrity.</p>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue (10%)</p>
                <h3 className="text-2xl font-bold">$124,500</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Reward Payout</p>
                <h3 className="text-2xl font-bold">78.4%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                <h3 className="text-2xl font-bold">142</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> Pending Reward Reviews
            </CardTitle>
            <CardDescription>High-value rewards (80%+) require manual audit.</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {rewards.length} Pending
          </Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.length > 0 ? (
                  rewards.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-bold">{r.studentName}</TableCell>
                      <TableCell className="text-muted-foreground">{r.courseTitle}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                          {r.points} pts
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-primary">${r.amount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => handleApproval(r.id, false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                            onClick={() => handleApproval(r.id, true)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No rewards currently pending review.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
