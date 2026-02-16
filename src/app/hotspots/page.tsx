
"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Mail, 
  Bell, 
  UserPlus, 
  TrendingUp, 
  Globe, 
  MessageSquare,
  Activity,
  Zap
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip 
} from 'recharts'
import { cn } from '@/lib/utils'

const analyticsData = [
  { name: 'Mon', value: 10 },
  { name: 'Tue', value: 15 },
  { name: 'Wed', value: 12 },
  { name: 'Thu', value: 25 },
  { name: 'Fri', value: 22 },
  { name: 'Sat', value: 35 },
  { name: 'Sun', value: 30 },
];

const trendingTopics = [
  { tag: '#MbareMicroplanning', count: '1.2k' },
  { tag: '#SentinelSurveillance', count: '850' },
  { tag: '#PeerReach', count: '640' },
];

export default function SocialNetworkMapPage() {
  return (
    <div className="min-h-screen bg-background bg-grid p-6 space-y-6 overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8 w-full lg:w-auto">
          <h1 className="text-2xl font-black tracking-tighter text-primary glow-cyan uppercase italic">
            Social Network Map
          </h1>
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
            <Input 
              placeholder="Search trust nodes..." 
              className="pl-10 cyber-border border-primary/20 bg-background/40 h-10 italic"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
            <Mail className="h-4 w-4 text-accent" />
            <span>Encrypted Chat: <span className="text-primary glow-cyan">99+</span></span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
            <Bell className="h-4 w-4 text-accent" />
            <span>Alerts: <span className="text-primary glow-cyan">21</span></span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
            <UserPlus className="h-4 w-4 text-accent" />
            <span>Referrals: <span className="text-primary glow-cyan">5</span></span>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="flex gap-12 text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary glow-cyan" />
          Connected Peers: <span className="text-foreground">84</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary glow-cyan" />
          Active Trust Bridges: <span className="text-primary">+12</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary glow-cyan" />
          Field Activity Level: <span className="text-primary">Optimized</span>
        </div>
      </div>

      {/* Central Graph Area */}
      <div className="relative flex-1 h-[500px] cyber-border border-primary/10 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)]">
        {/* Glow Lines SVG */}
        <svg className="absolute inset-0 w-full h-full network-line opacity-40">
          <line x1="50%" y1="50%" x2="30%" y2="30%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="10 5" />
          <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="hsl(var(--primary))" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="20%" y2="60%" stroke="hsl(var(--accent))" strokeWidth="1" strokeDasharray="5 5" />
          <line x1="50%" y1="50%" x2="80%" y2="65%" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="30%" y1="30%" x2="15%" y2="20%" stroke="hsl(var(--primary))" strokeWidth="1" className="animate-flicker" />
          <line x1="70%" y1="30%" x2="85%" y2="25%" stroke="hsl(var(--primary))" strokeWidth="1" />
          {/* Connection Particles */}
          <circle cx="40%" cy="40%" r="2" fill="hsl(var(--primary))" className="animate-ping" />
          <circle cx="60%" cy="40%" r="2" fill="hsl(var(--accent))" className="animate-ping" style={{ animationDelay: '1s' }} />
        </svg>

        {/* Central Core Node - Peer Educator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="w-32 h-32 rounded-full border-4 border-primary p-1 bg-background shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              <Avatar className="w-full h-full border-2 border-primary/20">
                <AvatarImage src="https://picsum.photos/seed/peereducator/300/300" />
                <AvatarFallback>PE</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-background px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest skew-x-[-12deg]">
              Peer Educator
            </div>
          </div>
        </div>

        {/* Satellite Nodes - Influence Groups */}
        <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
          <div className="w-16 h-16 rounded-full border-2 border-primary/40 p-1 bg-background hover:scale-110 transition-transform">
            <Avatar className="w-full h-full">
              <AvatarImage src="https://picsum.photos/seed/node1/150/150" />
            </Avatar>
          </div>
          <Badge className="absolute -top-2 -right-2 bg-primary/20 border-primary/40 text-[8px] h-4">Leader</Badge>
        </div>

        <div className="absolute top-[30%] left-[70%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
          <div className="w-16 h-16 rounded-full border-2 border-primary/40 p-1 bg-background hover:scale-110 transition-transform">
            <Avatar className="w-full h-full">
              <AvatarImage src="https://picsum.photos/seed/node2/150/150" />
            </Avatar>
          </div>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-accent/20 border border-accent/40 px-2 py-1 rounded text-[8px] font-black text-accent uppercase">
            Bridge Node
          </div>
        </div>

        <div className="absolute top-[60%] left-[20%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
          <div className="w-14 h-14 rounded-full border-2 border-accent/40 p-1 bg-background hover:scale-110 transition-transform">
            <Avatar className="w-full h-full">
              <AvatarImage src="https://picsum.photos/seed/node3/150/150" />
            </Avatar>
          </div>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2">
             <MessageSquare className="h-4 w-4 text-accent animate-bounce" />
          </div>
        </div>

        <div className="absolute top-[65%] left-[80%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
           <div className="w-12 h-12 rounded-full border-2 border-primary/20 p-1 bg-background hover:scale-110 transition-transform">
            <Avatar className="w-full h-full">
              <AvatarImage src="https://picsum.photos/seed/node4/150/150" />
            </Avatar>
          </div>
          <Globe className="absolute -bottom-2 -right-2 h-4 w-4 text-primary bg-background rounded-full p-0.5 border border-primary/40" />
        </div>
      </div>

      {/* Bottom Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Network Analytics Panel */}
        <Card className="cyber-border border-primary/10 bg-background/40">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4" /> Reach Analytics
              </h3>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,255,255,0.2)', fontSize: '8px' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase">Trust Growth</p>
                <div className="flex items-center gap-2 text-xl font-black text-primary glow-cyan">
                  <TrendingUp className="h-5 w-5" />
                  +14.2%
                </div>
              </div>
              <div className="relative h-12 w-12 flex flex-col items-center justify-center">
                 <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                 <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
                 <span className="text-[10px] font-black">82%</span>
                 <p className="text-[6px] uppercase absolute -bottom-2">Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Relationship Strength Panel */}
        <Card className="cyber-border border-primary/10 bg-background/40 flex flex-col justify-center">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                <span className="text-muted-foreground">Weak Connections</span>
                <span className="text-foreground">Initial Outreach</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent/40 w-1/4" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                <span className="text-muted-foreground">Stable Trusts</span>
                <span className="text-foreground">Regular Service Users</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 w-2/4" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                <span className="text-primary glow-cyan">High Influence Peers</span>
                <span className="text-foreground">Core Mobilizers</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary glow-cyan w-3/4 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trending Topics Panel */}
        <Card className="cyber-border border-primary/10 bg-background/40 relative">
          <CardContent className="p-4 space-y-4">
             <h3 className="text-xs font-black uppercase text-primary tracking-widest">
               Field Intelligence
             </h3>
             <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div key={topic.tag} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {topic.tag}
                    </span>
                    <span className="text-[10px] font-black text-foreground bg-primary/10 px-2 rounded">
                      {topic.count}
                    </span>
                  </div>
                ))}
             </div>
             <div className="absolute bottom-4 right-4 group">
                <Globe className="h-16 w-16 text-primary/20 group-hover:text-primary/40 transition-colors animate-[spin_10s_linear_infinite]" />
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
