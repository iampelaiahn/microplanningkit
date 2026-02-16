
"use client"

import React, { useState, useRef, useEffect } from 'react'
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
  Zap,
  Users,
  Link as LinkIcon,
  Move
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

type Node = {
  id: string;
  x: number;
  y: number;
  type: string;
  label: string;
  imgSeed: string;
  color?: string;
  icon?: any;
};

export default function SocialNetworkMapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'pe', x: 50, y: 50, type: 'core', label: 'Peer Educator', imgSeed: 'peereducator' },
    { id: 'leader', x: 25, y: 25, type: 'satellite', label: 'Trust Leader', imgSeed: 'node_leader' },
    { id: 'bridge', x: 75, y: 25, type: 'satellite', label: 'Bridge Node', imgSeed: 'node_bridge', color: 'text-accent' },
    { id: 'high', x: 80, y: 40, type: 'satellite', label: 'High Influence', imgSeed: 'node_high' },
    { id: 'active', x: 20, y: 65, type: 'satellite', label: 'Active Participant', imgSeed: 'node_active' },
    { id: 'new', x: 85, y: 70, type: 'satellite', label: 'New Connection', imgSeed: 'node_new' },
    { id: 'hub', x: 15, y: 45, type: 'satellite', label: 'Community Hub', imgSeed: 'node_hub' },
  ]);

  const handlePointerDown = (id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingNodeId(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingNodeId || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNodes(prev => prev.map(node => 
      node.id === draggingNodeId 
        ? { ...node, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
        : node
    ));
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
  };

  const getNode = (id: string) => nodes.find(n => n.id === id)!;

  return (
    <div 
      className="min-h-screen bg-background bg-grid p-6 space-y-6 overflow-hidden select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
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
          Connected Peers: <span className="text-foreground">142</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary glow-cyan" />
          Active Trust Bridges: <span className="text-primary">+18</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary glow-cyan" />
          Field Activity Level: <span className="text-primary">Optimized</span>
        </div>
      </div>

      {/* Central Graph Area */}
      <div 
        ref={containerRef}
        className="relative flex-1 h-[600px] cyber-border border-primary/10 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)] touch-none"
      >
        {/* Glow Lines SVG - Connecting nodes based on their state positions */}
        <svg className="absolute inset-0 w-full h-full network-line opacity-40">
          {/* Main Hub Connections */}
          {['leader', 'bridge', 'high', 'active', 'new', 'hub'].map(targetId => {
            const pe = getNode('pe');
            const target = getNode(targetId);
            return (
              <line 
                key={targetId}
                x1={`${pe.x}%`} y1={`${pe.y}%`} 
                x2={`${target.x}%`} y2={`${target.y}%`} 
                stroke={targetId === 'active' || targetId === 'hub' ? "hsl(var(--accent))" : "hsl(var(--primary))"} 
                strokeWidth={targetId === 'leader' ? "2" : "1"} 
                strokeDasharray={targetId === 'leader' ? "10 5" : "none"}
              />
            )
          })}
          
          {/* Secondary Connections */}
          <line 
            x1={`${getNode('leader').x}%`} y1={`${getNode('leader').y}%`} 
            x2={`${getNode('hub').x}%`} y2={`${getNode('hub').y}%`} 
            stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" 
          />
          <line 
            x1={`${getNode('bridge').x}%`} y1={`${getNode('bridge').y}%`} 
            x2={`${getNode('high').x}%`} y2={`${getNode('high').y}%`} 
            stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" 
          />

          {/* Connection Particles (Mock animated points) */}
          <circle cx={`${(getNode('pe').x + getNode('leader').x) / 2}%`} cy={`${(getNode('pe').y + getNode('leader').y) / 2}%`} r="2" fill="hsl(var(--primary))" className="animate-ping" />
          <circle cx={`${(getNode('pe').x + getNode('bridge').x) / 2}%`} cy={`${(getNode('pe').y + getNode('bridge').y) / 2}%`} r="2" fill="hsl(var(--accent))" className="animate-ping" style={{ animationDelay: '1s' }} />
        </svg>

        {/* Central Core Node - Peer Educator */}
        <div 
          className="absolute z-30 cursor-grab active:cursor-grabbing group"
          style={{ top: `${getNode('pe').y}%`, left: `${getNode('pe').x}%`, transform: 'translate(-50%, -50%)' }}
          onPointerDown={handlePointerDown('pe')}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="w-32 h-32 rounded-full border-4 border-primary p-1 bg-background shadow-[0_0_50px_rgba(0,255,255,0.4)] relative z-10 transition-transform group-hover:scale-105">
              <Avatar className="w-full h-full border-2 border-primary/20">
                <AvatarImage src={`https://picsum.photos/seed/${getNode('pe').imgSeed}/300/300`} />
                <AvatarFallback>PE</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-background px-4 py-1.5 rounded-sm text-[11px] font-black uppercase tracking-[0.2em] skew-x-[-12deg] z-20 shadow-lg pointer-events-none">
              Peer Educator
            </div>
          </div>
        </div>

        {/* Satellite Nodes */}
        {nodes.filter(n => n.type === 'satellite').map(node => (
          <div 
            key={node.id}
            className="absolute z-20 group cursor-grab active:cursor-grabbing"
            style={{ top: `${node.y}%`, left: `${node.x}%`, transform: 'translate(-50%, -50%)' }}
            onPointerDown={handlePointerDown(node.id)}
          >
            <div className={cn(
              "rounded-full border-2 p-1 bg-background hover:scale-110 transition-transform shadow-lg",
              node.id === 'leader' ? "w-20 h-20 border-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]" : 
              node.id === 'bridge' ? "w-18 h-18 border-primary/60" :
              node.id === 'high' ? "w-16 h-16 border-primary/40" :
              node.id === 'active' ? "w-16 h-16 border-accent/40" :
              node.id === 'new' ? "w-14 h-14 border-primary/20" :
              "w-14 h-14 border-muted"
            )}>
              <Avatar className="w-full h-full">
                <AvatarImage src={`https://picsum.photos/seed/${node.imgSeed}/150/150`} />
              </Avatar>
            </div>
            
            {/* Contextual Badges/Icons for nodes */}
            {node.id === 'leader' && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-background border-none text-[8px] font-black px-2 pointer-events-none">LEADER</Badge>}
            {node.id === 'bridge' && (
              <div className="absolute -right-4 -top-2 bg-accent/20 border border-accent/40 p-1 rounded-full pointer-events-none">
                <LinkIcon className="h-3 w-3 text-accent" />
              </div>
            )}
            {node.id === 'high' && (
              <div className="absolute -bottom-2 -right-2 pointer-events-none">
                <Zap className="h-5 w-5 text-primary animate-flicker" />
              </div>
            )}
            {node.id === 'active' && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 pointer-events-none">
                 <MessageSquare className="h-4 w-4 text-accent animate-bounce" />
              </div>
            )}
            {node.id === 'new' && <UserPlus className="absolute -top-2 -right-2 h-4 w-4 text-primary bg-background rounded-full p-0.5 border border-primary/40 pointer-events-none" />}
            {node.id === 'hub' && <Users className="absolute -bottom-2 -left-2 h-4 w-4 text-muted-foreground pointer-events-none" />}

            {/* Hover Tooltip */}
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/90 px-3 py-1.5 border border-primary/30 text-[10px] font-bold rounded shadow-xl pointer-events-none z-40">
              <p className="text-primary uppercase tracking-wider">{node.label}</p>
              <p className="text-muted-foreground text-[8px]">Drag to reorganize</p>
            </div>
          </div>
        ))}
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
