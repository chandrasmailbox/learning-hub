import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { blink } from '../../lib/blink'
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  PlusCircle,
  ShieldCheck,
  GraduationCap
} from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'

interface SidebarItem {
  title: string
  href: string
  icon: any
  roles: string[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["student", "parent", "instructor", "admin"]
  },
  {
    title: "My Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
    roles: ["student"]
  },
  {
    title: "My Students",
    href: "/dashboard/students",
    icon: Users,
    roles: ["parent"]
  },
  {
    title: "Course Builder",
    href: "/dashboard/manage-courses",
    icon: PlusCircle,
    roles: ["instructor"]
  },
  {
    title: "Class Analytics",
    href: "/dashboard/analytics",
    icon: Trophy,
    roles: ["instructor"]
  },
  {
    title: "Rewards",
    href: "/dashboard/rewards",
    icon: Trophy,
    roles: ["student", "parent"]
  },
  {
    title: "Funding",
    href: "/dashboard/funding",
    icon: CreditCard,
    roles: ["parent"]
  },
  {
    title: "Admin Panel",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    roles: ["admin"]
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["student", "parent", "instructor", "admin"]
  }
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      blink.db.profiles.get(user.id).then(setProfile)
    }
  }, [user])

  const filteredItems = sidebarItems.filter(item => 
    profile?.role ? item.roles.includes(profile.role) : false
  )

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-secondary/20 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-background border-r border-border flex flex-col z-40`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/" className={`flex items-center gap-2 ${!isSidebarOpen && "justify-center w-full"}`}>
            <GraduationCap className="h-8 w-8 text-primary shrink-0" />
            {isSidebarOpen && <span className="text-xl font-bold font-serif text-primary truncate">LearnHub</span>}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link key={item.href} to={item.href}>
                <div 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  } ${!isSidebarOpen && "justify-center"}`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-border">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 mb-4 p-2 bg-secondary/50 rounded-xl">
              <Avatar>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize truncate">{profile?.role || "Role"}</p>
              </div>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${!isSidebarOpen && "justify-center"}`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h2 className="text-lg font-bold capitalize">
              {location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-xs font-bold">
              <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              SYSTEM ACTIVE
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
