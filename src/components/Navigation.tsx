
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Shield, 
  Map, 
  LayoutDashboard,
  Package,
  Home,
  Activity,
  ShieldCheck,
  LogOut,
  Network,
  BookOpen,
  Target,
  RefreshCw,
  Users,
  UserCog,
  ClipboardList,
  CalendarDays
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useState, useEffect } from 'react'

export function Navigation() {
  const pathname = usePathname();
  const [role, setRole] = useState<'PE' | 'CHM'>('CHM');

  useEffect(() => {
    const peRoutes = ['/field', '/sync'];
    const isPE = peRoutes.some(r => pathname.startsWith(r)) || pathname === '/field';
    
    const chmRoutes = ['/dashboard', '/inventory', '/assessment', '/monitoring', '/hotspots/monitoring'];
    const isCHM = chmRoutes.some(r => pathname.startsWith(r));

    if (isCHM) {
      setRole('CHM');
    } else if (isPE) {
      setRole('PE');
    }
  }, [pathname]);

  const chmItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Hotspot tracker', href: '/hotspots/monitoring', icon: Map },
    { name: 'Field tracker', href: '/monitoring', icon: Activity },
    { name: 'Assessment repo', href: '/assessment', icon: ShieldCheck },
    { name: 'Inventory', href: '/inventory', icon: Package },
  ];

  const peItems = [
    { name: 'Social Map', href: '/field/network', icon: Network },
    { name: 'Diary', href: '/field/diary', icon: BookOpen },
    { name: 'Outreach', href: '/field/outreach', icon: CalendarDays },
    { name: 'Assess', href: '/field/assess', icon: Shield },
    { name: 'Profile', href: '/field/profiling', icon: Target },
    { name: 'Sync', href: '/sync', icon: RefreshCw },
  ];

  const currentItems = role === 'CHM' ? chmItems : peItems;

  return (
    <nav className={cn(
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg rounded-full border border-primary/20 bg-card/80 backdrop-blur-lg shadow-2xl px-4 py-2",
      "md:static md:translate-x-0 md:w-72 md:h-screen md:rounded-none md:border-r md:border-t-0 md:max-w-none md:flex md:flex-col md:p-6 md:bg-card/40",
      "flex flex-row items-center justify-between"
    )}>
      
      <div className="hidden md:flex flex-col gap-1 mb-10 px-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full border border-primary/40">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground glow-cyan uppercase">Sentinel</span>
        </Link>
        <div className="flex items-center gap-2 pl-11 mt-1">
          {role === 'CHM' ? (
            <UserCog className="h-3 w-3 text-accent" />
          ) : (
            <Users className="h-3 w-3 text-primary" />
          )}
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            {role === 'CHM' ? 'Supervisor Mode' : 'Peer Field Kit'}
          </p>
        </div>
      </div>

      <Link href="/" className="md:hidden p-2 text-muted-foreground hover:text-primary">
        <Home className="h-5 w-5" />
      </Link>

      <div className="flex flex-row md:flex-col items-center md:items-stretch gap-1 md:gap-2 w-full">
        {currentItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-full md:rounded-lg px-3 py-2 md:px-4 md:py-3 transition-all duration-300 group",
                isActive 
                  ? "bg-primary/20 text-primary md:bg-primary/10 md:border-l-2 md:border-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="text-[10px] md:text-sm font-bold md:font-medium tracking-tight whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="hidden md:flex mt-auto p-4 border-t border-border/50 items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-muted">
            <AvatarFallback className="bg-muted text-foreground text-xs">{role[0]}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">Anonymous {role}</p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors ml-2">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}
