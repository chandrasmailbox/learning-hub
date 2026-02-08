import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card'
import { Plus, Trash2, Save, FileVideo, FileText, HelpCircle, Loader2 } from 'lucide-react'
import { blink } from '../../lib/blink'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function CourseBuilder() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState({
    title: '',
    description: '',
    price: '',
    category: ''
  })

  const [assignments, setAssignments] = useState([
    { id: '1', title: 'Homework 1', type: 'homework', weight: 25 },
    { id: '2', title: 'Midterm Exam', type: 'test', weight: 40 },
    { id: '3', title: 'Participation', type: 'engagement', weight: 15 },
    { id: '4', title: 'Final Project', type: 'homework', weight: 20 }
  ])

  const addAssignment = () => {
    const newId = (assignments.length + 1).toString()
    setAssignments([...assignments, { id: newId, title: 'New Assignment', type: 'homework', weight: 0 }])
  }

  const removeAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id))
  }

  const handleSave = async () => {
    if (!user) return
    
    const totalWeight = assignments.reduce((acc, curr) => acc + Number(curr.weight), 0)
    if (totalWeight !== 100) {
      toast.error(`Total weight must be 100%. Current: ${totalWeight}%`)
      return
    }

    setLoading(true)
    try {
      const courseId = `course_${Math.random().toString(36).substring(2, 9)}`
      
      // 1. Create Course
      await blink.db.courses.create({
        id: courseId,
        title: course.title,
        description: course.description,
        price: Number(course.price),
        instructor_id: user.id,
        thumbnail_url: `https://images.unsplash.com/photo-1509228468518-180dd48a5d5f?auto=format&fit=crop&q=80&w=800`
      })

      // 2. Create Assignments
      await Promise.all(assignments.map(a => 
        blink.db.assignments.create({
          id: `assignment_${Math.random().toString(36).substring(2, 9)}`,
          course_id: courseId,
          title: a.title,
          type: a.type,
          weight: a.weight,
          max_points: 100,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week from now
        })
      ))

      toast.success('Course created successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Course Builder</h1>
          <p className="text-muted-foreground">Design your curriculum and define reward-weighted assignments.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 gap-2 px-8">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Publish Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>What will your students learn?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Advanced Calculus" 
                  value={course.title}
                  onChange={(e) => setCourse({...course, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the course goals and content..." 
                  className="min-h-[120px]"
                  value={course.description}
                  onChange={(e) => setCourse({...course, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Tuition Fee ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="499" 
                    value={course.price}
                    onChange={(e) => setCourse({...course, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    placeholder="e.g. Mathematics" 
                    value={course.category}
                    onChange={(e) => setCourse({...course, category: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Grading & Weights</CardTitle>
                <CardDescription>Define how performance determines the refund. Total must equal 100%.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addAssignment} className="gap-1 border-primary text-primary">
                <Plus className="h-4 w-4" /> Add Component
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <div key={assignment.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/10">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Component Title</Label>
                      <Input 
                        value={assignment.title}
                        onChange={(e) => {
                          const newAssignments = [...assignments]
                          newAssignments[index].title = e.target.value
                          setAssignments(newAssignments)
                        }}
                        className="bg-background"
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label className="text-xs">Type</Label>
                      <select 
                        value={assignment.type}
                        onChange={(e) => {
                          const newAssignments = [...assignments]
                          newAssignments[index].type = e.target.value
                          setAssignments(newAssignments)
                        }}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="homework">Homework</option>
                        <option value="test">Test/Quiz</option>
                        <option value="engagement">Engagement</option>
                        <option value="trajectory">Improvement</option>
                      </select>
                    </div>
                    <div className="w-24 space-y-2">
                      <Label className="text-xs">Weight (%)</Label>
                      <Input 
                        type="number"
                        value={assignment.weight}
                        onChange={(e) => {
                          const newAssignments = [...assignments]
                          newAssignments[index].weight = Number(e.target.value)
                          setAssignments(newAssignments)
                        }}
                        className="bg-background"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeAssignment(assignment.id)}
                      className="mt-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/5 border-t border-border/50 justify-between py-4">
              <span className="text-sm font-medium">Total Curriculum Weight</span>
              <span className={`text-xl font-bold ${assignments.reduce((acc, curr) => acc + Number(curr.weight), 0) === 100 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {assignments.reduce((acc, curr) => acc + Number(curr.weight), 0)}%
              </span>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> Reward Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-3 bg-secondary/30 rounded-lg space-y-1">
                <p className="text-xs font-bold text-primary">0-50 Points</p>
                <p className="text-sm">0-50% automatic refund</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg space-y-1">
                <p className="text-xs font-bold text-primary">51-80 Points</p>
                <p className="text-sm">50-80% automatic refund</p>
              </div>
              <div className="p-3 bg-secondary/30 rounded-lg space-y-1">
                <p className="text-xs font-bold text-primary">81-95 Points</p>
                <p className="text-sm">80-100% refund (requires review)</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 space-y-1">
                <p className="text-xs font-bold text-primary">96-100 Points</p>
                <p className="text-sm">100% refund + 10-50% Scholarship Credits</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>Upload materials for your students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-3 h-12 border-dashed">
                <FileVideo className="h-5 w-5 text-blue-500" /> Upload Video Lectures
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12 border-dashed">
                <FileText className="h-5 w-5 text-emerald-500" /> Upload PDF Materials
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
