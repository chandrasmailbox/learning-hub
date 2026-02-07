import React, { useEffect, useState } from 'react'
import { blink } from '../../lib/blink'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Search, Star, Clock, BookOpen, Users, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../hooks/useAuth'

export default function CourseCatalog() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const data = await blink.db.courses.list()
      setCourses(data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId: string, price: number) => {
    if (!user) return
    
    // In a real app, this would trigger Stripe
    toast.info('Redirecting to secure payment...')
    
    setTimeout(async () => {
      try {
        await blink.db.enrollments.create({
          id: `enroll_${Math.random().toString(36).substring(2, 9)}`,
          course_id: courseId,
          student_id: user.id,
          parent_id: user.id, // For demo, student is their own parent if not linked
          status: 'paid',
          paid_amount: price
        })
        toast.success('Successfully enrolled in course!')
      } catch (error: any) {
        toast.error(error.message || 'Enrollment failed')
      }
    }, 1500)
  }

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Course Catalog</h1>
          <p className="text-muted-foreground">Find the perfect course and start earning rewards.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden group hover:shadow-2xl transition-all border-border/50">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              
              <CardHeader className="pt-6">
                <h3 className="text-xl font-bold line-clamp-1">{course.title}</h3>
                <CardDescription className="line-clamp-2 mt-2">{course.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>12 Weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>Self-paced</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary font-bold bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <span>Potential Reward:</span>
                  <span className="ml-auto">Up to ${course.price}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-0 border-t border-border/50 flex items-center justify-between p-6">
                <span className="text-2xl font-bold">${course.price}</span>
                <Button 
                  onClick={() => handleEnroll(course.id, course.price)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-muted-foreground">No courses found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
