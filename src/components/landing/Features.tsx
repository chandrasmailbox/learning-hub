import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Wallet, TrendingUp, Trophy, Users } from 'lucide-react'

const features = [
  {
    title: "Parental Funding",
    description: "Parents securely fund courses, creating a transparent reward pool for their students.",
    icon: Wallet,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "Performance Tracking",
    description: "Real-time tracking of homework, tests, and engagement determines the reward amount.",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    title: "Tuition Refunds",
    description: "Students can earn back up to 100% of their fees based on academic excellence.",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    title: "Community Learning",
    description: "Connect with certified instructors and a community of motivated high-performers.",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-50"
  }
]

export function Features() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">How LearnHub Works</h2>
          <p className="text-muted-foreground">A unique ecosystem that aligns interests between parents, students, and instructors through academic incentives.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                <div className={`h-16 w-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
