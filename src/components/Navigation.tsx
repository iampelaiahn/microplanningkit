
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Shield, 
  Map, 
  BookOpen, 
  ClipboardCheck, 
  Target, 
  UserCheck, 
  LogOut,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Social Map', href: '/hotspots', icon: Map },
    { name: 'Diary', href: '/field/diary', icon: BookOpen },
    { name: 'Assessment', href: '/assessment', icon: ClipboardCheck },
    { name: 'Profiling', href: '/field', icon: Target },
    { name: 'Supervisor', href: '/dashboard', icon: UserCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-card/80 backdrop-blur-md md:static md:w-72 md:h-screen md:border-r md:border-t-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-primary/20 p-2 rounded-full border border-primary/40">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Sentinel</span>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 group",
                pathname === item.href 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-muted">
              <AvatarFallback className="bg-muted text-foreground">A</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold">Anonymous User</p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
