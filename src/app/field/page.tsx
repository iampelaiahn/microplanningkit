
"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight, Shield, Map, BookOpen, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const modules = [
  {
    title: 'Risk Assessment',
    description: 'Assess risk factors and assign outreach frequency.',
    icon: Shield,
    href: '/assessment',
    color: 'text-primary'
  },
  {
    title: 'Social Network Map',
    description: 'Visualize peer relationships and nano-networks.',
    icon: Map,
    href: '/hotspots',
    color: 'text-primary'
  },
  {
    title: 'Hotspot Diary',
    description: 'Securely log activities using unique identifiers.',
    icon: BookOpen,
    href: '/field/diary',
    color: 'text-primary'
  },
  {
    title: 'Spot Profiling',
    description: 'Capture hotspot data, PSE, and structural barriers.',
    icon: Target,
    href: '/field/profiling',
    color: 'text-primary',
    isActive: true
  }
];

export default function FieldDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8 px-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary glow-cyan">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Welcome to Sentinel. Select a module to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link key={module.title} href={module.href}>
            <Card className={cn(
              "h-full transition-all duration-300 card-hover-glow border-border/50 group bg-card/40 backdrop-blur-sm",
              module.isActive && "border-primary ring-1 ring-primary/20"
            )}>
              <CardHeader className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <module.icon className={cn("h-6 w-6", module.color)} />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed min-h-[40px]">
                  {module.description}
                </CardDescription>
                <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest pt-2">
                  Open Module <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
