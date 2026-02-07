import React from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Hero } from '../components/landing/Hero'
import { CourseList } from '../components/landing/CourseList'
import { Features } from '../components/landing/Features'
import { Footer } from '../components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CourseList />
      </main>
      <Footer />
    </div>
  )
}
