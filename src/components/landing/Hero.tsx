import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { ArrowRight, Star, Shield, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1758270704524-596810e891b5?auto=format&fit=crop&q=80&w=1920" 
          alt="Educational environment" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 animate-fade-in">
            <Star className="h-3 w-3 fill-primary" />
            <span>LEARN AND EARN BACK YOUR TUITION</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight mb-6">
            Where Performance <br />
            <span className="text-primary italic">Pays Off</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
            The first educational platform where students can earn back 0-100% of their course fees based on academic performance. Turn learning into a rewarding investment.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg hover:scale-105 transition-all">
                Start Learning Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary text-primary hover:bg-primary/5">
                Explore Courses
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border pt-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Secure Funding</p>
                <p className="text-xs text-muted-foreground">Parent-controlled accounts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Instant Rewards</p>
                <p className="text-xs text-muted-foreground">Performance-based refunds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Expert Instructors</p>
                <p className="text-xs text-muted-foreground">Certified online courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  )
}

function GraduationCap({ className }: { className?: string }) {
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
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}
