import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Clock, Star, BookOpen } from 'lucide-react'

const courses = [
  {
    id: "1",
    title: "Advanced Mathematics for High School",
    instructor: "Dr. Sarah Mitchell",
    price: 499,
    rating: 4.8,
    students: 1250,
    duration: "12 Weeks",
    category: "Mathematics",
    image: "https://images.unsplash.com/photo-1509228468518-180dd48a5d5f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "2",
    title: "Intro to Python & Data Science",
    instructor: "Mark Chen",
    price: 399,
    rating: 4.9,
    students: 3100,
    duration: "8 Weeks",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "3",
    title: "Academic Writing & Research",
    instructor: "Prof. Elena Rossi",
    price: 299,
    rating: 4.7,
    students: 850,
    duration: "6 Weeks",
    category: "Humanities",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"
  }
]

export function CourseList() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-serif font-bold mb-4">Featured Courses</h2>
            <p className="text-muted-foreground">Invest in your future. Choose from our curated selection of high-impact courses designed by experts.</p>
          </div>
          <Button variant="outline" className="hidden sm:flex border-primary text-primary">View All Courses</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden group hover:shadow-2xl transition-all border-border/50">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4 bg-primary/90">{course.category}</Badge>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              
              <CardHeader className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-amber-500 gap-1 text-sm font-bold">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground gap-1 text-xs">
                    <Users className="h-3 w-3" />
                    <span>{course.students} students</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold line-clamp-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground">by {course.instructor}</p>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>24 Lessons</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary font-bold bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <span>Potential Refund:</span>
                  <span className="ml-auto">Up to ${course.price}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-0 border-t border-border/50 flex items-center justify-between p-6">
                <span className="text-2xl font-bold">${course.price}</span>
                <Button className="bg-primary hover:bg-primary/90">Enroll Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
