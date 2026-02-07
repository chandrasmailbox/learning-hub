import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-serif text-primary">LearnHub</span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed mb-6">
              Rewarding excellence in education. We bridge the gap between investment and achievement through performance-based tuition refunds.
            </p>
            <div className="flex items-center gap-4">
              <Facebook className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
              <Twitter className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
              <Instagram className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
              <Linkedin className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-background/60">
              <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/instructors" className="hover:text-primary transition-colors">Instructors</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-background/60">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-background/60">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/40">
          <p>© 2026 Rewarded Learning Hub. All rights reserved.</p>
          <p>Powered by Blink SDK</p>
        </div>
      </div>
    </footer>
  )
}
