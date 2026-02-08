import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, CreditCard, Banknote, Gift, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { blink } from '../../lib/blink'
import { toast } from 'sonner'

export default function Wallet() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const rewardList = await blink.db.rewards.list({ 
            where: { student_id: user.id } 
          })
          
          const enriched = await Promise.all(rewardList.map(async (r: any) => {
            const course = await blink.db.courses.get(r.course_id)
            return { 
              ...r, 
              description: r.type === 'scholarship' ? 'Scholarship Award' : `${course?.title || 'Course'} Refund`,
              date: r.created_at
            }
          }))
          
          setTransactions(enriched)
          const total = enriched
            .filter(t => t.status === 'approved' || t.status === 'completed')
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
          setBalance(total)
        } catch (error) {
          console.error('Error fetching wallet data:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [user])

  const handleWithdraw = (method: string) => {
    toast.success(`Withdrawal request via ${method} submitted for review.`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Rewards Wallet</h1>
          <p className="text-muted-foreground">Manage your academic earnings and redeem your rewards.</p>
        </div>
        <div className="flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
          <WalletIcon className="h-6 w-6 text-primary" />
          <div>
            <p className="text-[10px] font-bold text-primary uppercase">Available Balance</p>
            <p className="text-2xl font-bold text-primary">${balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>A history of your refunds, scholarships, and redemptions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {transactions.map((t) => (
                  <div key={t.id} className="p-6 flex items-center gap-4 hover:bg-secondary/10 transition-colors">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${t.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {t.amount > 0 ? <ArrowDownCircle className="h-5 w-5" /> : <ArrowUpCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${t.amount > 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                      </p>
                      <Badge variant="outline" className="text-[10px] uppercase">{t.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Redeem Rewards</CardTitle>
              <CardDescription>Choose how you'd like to receive your earnings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 justify-start gap-4 hover:border-primary hover:bg-primary/5 group"
                onClick={() => handleWithdraw('Gift Card')}
              >
                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <Gift className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Amazon/Visa Gift Card</p>
                  <p className="text-xs text-muted-foreground">Instant digital delivery</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-auto py-4 justify-start gap-4 hover:border-primary hover:bg-primary/5 group"
                onClick={() => handleWithdraw('Bank Transfer')}
              >
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Banknote className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Bank Transfer</p>
                  <p className="text-xs text-muted-foreground">Direct to your linked account</p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-auto py-4 justify-start gap-4 hover:border-primary hover:bg-primary/5 group"
                onClick={() => handleWithdraw('Platform Credits')}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Platform Credits</p>
                  <p className="text-xs text-muted-foreground">Use for future course enrollments</p>
                </div>
              </Button>
            </CardContent>
            <CardFooter className="bg-secondary/10 text-center py-4 block">
              <p className="text-[10px] text-muted-foreground">
                Withdrawals over $500 require parent/admin approval.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
