
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, LayoutDashboard, Map, ClipboardCheck, Box } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'CHM Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Field (PE)', href: '/field', icon: Shield },
    { name: 'Hotspots', href: '/hotspots', icon: Map },
    { name: 'Risk Assessment', href: '/assessment', icon: ClipboardCheck },
    { name: 'Inventory', href: '/inventory', icon: Box },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-md md:static md:w-64 md:h-screen md:border-r md:border-t-0 p-4">
      <div className="mb-8 hidden md:flex items-center gap-2 px-2">
        <Shield className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold tracking-tight text-primary">Sentinel Mbare</span>
      </div>
      <div className="flex md:flex-col justify-around md:justify-start gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
