
"use client"

import React, { useState, useRef, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  Plus,
  Network
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip 
} from 'recharts'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
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

type RelationshipStrength = 'weak' | 'moderate' | 'strong' | 'critical';

type Node = {
  id: string;
  x: number;
  y: number;
  type: string;
  label: string;
  imgSeed: string;
  color?: string;
};

type Link = {
  from: string;
  to: string;
  strength: RelationshipStrength;
};

export default function SocialNetworkMapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'pe', x: 50, y: 50, type: 'core', label: 'Peer Educator', imgSeed: 'peereducator' },
    { id: 'leader', x: 25, y: 25, type: 'satellite', label: 'Trust Leader', imgSeed: 'node_leader' },
    { id: 'bridge', x: 75, y: 25, type: 'satellite', label: 'Bridge Node', imgSeed: 'node_bridge' },
    { id: 'high', x: 80, y: 40, type: 'satellite', label: 'High Influence', imgSeed: 'node_high' },
    { id: 'active', x: 20, y: 65, type: 'satellite', label: 'Active Participant', imgSeed: 'node_active' },
    { id: 'new', x: 85, y: 70, type: 'satellite', label: 'New Connection', imgSeed: 'node_new' },
    { id: 'hub', x: 15, y: 45, type: 'satellite', label: 'Community Hub', imgSeed: 'node_hub' },
  ]);

  const [links, setLinks] = useState<Link[]>([
    { from: 'pe', to: 'leader', strength: 'critical' },
    { from: 'pe', to: 'bridge', strength: 'strong' },
    { from: 'pe', to: 'high', strength: 'moderate' },
    { from: 'pe', to: 'active', strength: 'strong' },
    { from: 'pe', to: 'new', strength: 'weak' },
    { from: 'pe', to: 'hub', strength: 'moderate' },
    { from: 'leader', to: 'hub', strength: 'moderate' },
    { from: 'bridge', to: 'high', strength: 'weak' },
  ]);

  // For adding new nodes
  const [newNodeName, setNewNodeName] = useState('');
  
  // For adding new links
  const [newLinkFrom, setNewLinkFrom] = useState('');
  const [newLinkTo, setNewLinkTo] = useState('');
  const [newLinkStrength, setNewLinkStrength] = useState<RelationshipStrength>('moderate');

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

  const addNode = () => {
    if (!newNodeName) return;
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      label: newNodeName,
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
      type: 'satellite',
      imgSeed: newNodeName.toLowerCase().replace(/\s/g, ''),
    };
    setNodes([...nodes, newNode]);
    setNewNodeName('');
  };

  const addLink = () => {
    if (!newLinkFrom || !newLinkTo || newLinkFrom === newLinkTo) return;
    // Check if link already exists
    const exists = links.find(l => (l.from === newLinkFrom && l.to === newLinkTo) || (l.from === newLinkTo && l.to === newLinkFrom));
    if (exists) return;

    setLinks([...links, { from: newLinkFrom, to: newLinkTo, strength: newLinkStrength }]);
  };

  const getNode = (id: string) => nodes.find(n => n.id === id);

  const getLineStyles = (strength: RelationshipStrength) => {
    switch (strength) {
      case 'critical':
        return { stroke: "hsl(var(--accent))", strokeWidth: "3", strokeDasharray: "none", filter: "drop-shadow(0 0 5px rgba(255, 120, 0, 0.8))" };
      case 'strong':
        return { stroke: "hsl(var(--primary))", strokeWidth: "2", strokeDasharray: "none", filter: "drop-shadow(0 0 3px rgba(0, 255, 255, 0.5))" };
      case 'moderate':
        return { stroke: "hsl(var(--primary))", strokeWidth: "1", strokeDasharray: "none", opacity: "0.6" };
      case 'weak':
        return { stroke: "hsl(var(--muted-foreground))", strokeWidth: "1", strokeDasharray: "5 5", opacity: "0.4" };
      default:
        return { stroke: "hsl(var(--primary))", strokeWidth: "1", strokeDasharray: "none" };
    }
  };

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

        <div className="flex items-center gap-4">
           {/* Add Node Dialog */}
           <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary/20 border border-primary/40 hover:bg-primary/30 text-primary gap-2 h-10">
                <Plus className="h-4 w-4" /> Add Person
              </Button>
            </DialogTrigger>
            <DialogContent className="cyber-border bg-background border-primary/20">
              <DialogHeader>
                <DialogTitle className="text-primary glow-cyan">New Community Node</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Person Name / Identifier</Label>
                  <Input 
                    value={newNodeName} 
                    onChange={(e) => setNewNodeName(e.target.value)}
                    className="bg-muted/30 border-primary/20"
                    placeholder="e.g. Sister Mercy"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addNode} className="bg-primary text-background font-bold w-full">Deploy Node</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Line Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-accent/20 border border-accent/40 hover:bg-accent/30 text-accent gap-2 h-10">
                <LinkIcon className="h-4 w-4" /> Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="cyber-border bg-background border-primary/20">
              <DialogHeader>
                <DialogTitle className="text-primary glow-cyan">Establish Trust Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Source Node</Label>
                  <Select value={newLinkFrom} onValueChange={setNewLinkFrom}>
                    <SelectTrigger className="bg-muted/20 border-primary/10">
                      <SelectValue placeholder="Select starting point" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Node</Label>
                  <Select value={newLinkTo} onValueChange={setNewLinkTo}>
                    <SelectTrigger className="bg-muted/20 border-primary/10">
                      <SelectValue placeholder="Select end point" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Relationship Strength</Label>
                  <Select value={newLinkStrength} onValueChange={(v: RelationshipStrength) => setNewLinkStrength(v)}>
                    <SelectTrigger className="bg-muted/20 border-primary/10">
                      <SelectValue placeholder="Select strength" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Weak / Initial</SelectItem>
                      <SelectItem value="moderate">Moderate / Stable</SelectItem>
                      <SelectItem value="strong">Strong / Mobilizer</SelectItem>
                      <SelectItem value="critical">Critical / High Trust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addLink} className="bg-accent text-background font-bold w-full">Connect Nodes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest ml-4">
            <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
              <Mail className="h-4 w-4 text-accent" />
              <span>Encrypted Chat: <span className="text-primary glow-cyan">99+</span></span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
              <Bell className="h-4 w-4 text-accent" />
              <span>Alerts: <span className="text-primary glow-cyan">21</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="flex gap-12 text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary glow-cyan" />
          Connected Peers: <span className="text-foreground">{nodes.length - 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary glow-cyan" />
          Active Trust Bridges: <span className="text-primary">+{links.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary glow-cyan" />
          Field Activity Level: <span className="text-primary">Optimized</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Architect Panel */}
        <Card className="lg:col-span-1 cyber-border border-primary/10 bg-background/40 p-4 space-y-6 overflow-y-auto">
          <h2 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
            <Network className="h-4 w-4" /> Network Architect
          </h2>
          
          <div className="space-y-4 pt-4 border-t border-primary/10">
            <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Quick Establish</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-bold text-muted-foreground">Source</Label>
                <Select value={newLinkFrom} onValueChange={setNewLinkFrom}>
                  <SelectTrigger className="h-8 bg-muted/20 border-primary/10 text-xs">
                    <SelectValue placeholder="Select node" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-bold text-muted-foreground">Target</Label>
                <Select value={newLinkTo} onValueChange={setNewLinkTo}>
                  <SelectTrigger className="h-8 bg-muted/20 border-primary/10 text-xs">
                    <SelectValue placeholder="Select node" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] uppercase font-bold text-muted-foreground">Strength</Label>
                <Select value={newLinkStrength} onValueChange={(v: RelationshipStrength) => setNewLinkStrength(v)}>
                  <SelectTrigger className="h-8 bg-muted/20 border-primary/10 text-xs">
                    <SelectValue placeholder="Relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weak">Weak / Initial</SelectItem>
                    <SelectItem value="moderate">Moderate / Stable</SelectItem>
                    <SelectItem value="strong">Strong / Mobilizer</SelectItem>
                    <SelectItem value="critical">Critical / High Trust</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addLink} className="w-full h-8 bg-accent text-background font-black text-[10px] uppercase">
                Connect Nodes
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-primary/10">
             <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Active Links</h3>
             <div className="space-y-2">
                {links.slice(-5).map((link, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-muted/10 rounded border border-primary/5 text-[10px]">
                    <span className="truncate max-w-[50px]">{getNode(link.from)?.label}</span>
                    <LinkIcon className="h-2 w-2 text-primary" />
                    <span className="truncate max-w-[50px]">{getNode(link.to)?.label}</span>
                    <Badge variant="outline" className="text-[8px] px-1 h-4 border-primary/20 text-primary">{link.strength}</Badge>
                  </div>
                ))}
             </div>
          </div>
        </Card>

        {/* Central Graph Area */}
        <div 
          ref={containerRef}
          className="lg:col-span-3 relative h-full cyber-border border-primary/10 overflow-hidden bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)] touch-none"
        >
          {/* Glow Lines SVG */}
          <svg className="absolute inset-0 w-full h-full network-line opacity-40">
            {links.map((link, idx) => {
              const fromNode = getNode(link.from);
              const toNode = getNode(link.to);
              if (!fromNode || !toNode) return null;
              
              const styles = getLineStyles(link.strength);
              
              return (
                <line 
                  key={idx}
                  x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} 
                  x2={`${toNode.x}%`} y2={`${toNode.y}%`} 
                  {...styles}
                />
              )
            })}
            
            {/* Animated particles on critical/strong links */}
            {links.filter(l => l.strength === 'critical' || l.strength === 'strong').map((link, idx) => {
               const from = getNode(link.from)!;
               const to = getNode(link.to)!;
               return (
                 <circle 
                  key={`p-${idx}`} 
                  cx={`${(from.x + to.x) / 2}%`} 
                  cy={`${(from.y + to.y) / 2}%`} 
                  r="2" 
                  fill={link.strength === 'critical' ? "hsl(var(--accent))" : "hsl(var(--primary))"} 
                  className="animate-ping" 
                 />
               )
            })}
          </svg>

          {/* Nodes Rendering */}
          {nodes.map(node => (
            <div 
              key={node.id}
              className={cn(
                "absolute z-30 cursor-grab active:cursor-grabbing group",
                node.type === 'core' && "z-40"
              )}
              style={{ top: `${node.y}%`, left: `${node.x}%`, transform: 'translate(-50%, -50%)' }}
              onPointerDown={handlePointerDown(node.id)}
            >
              <div className="relative">
                {node.type === 'core' && <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />}
                <div className={cn(
                  "rounded-full border-2 p-1 bg-background transition-all hover:scale-110 shadow-lg",
                  node.type === 'core' ? "w-28 h-28 border-primary shadow-[0_0_50px_rgba(0,255,255,0.4)]" : "w-16 h-16 border-primary/40"
                )}>
                  <Avatar className="w-full h-full border border-primary/10">
                    <AvatarImage src={`https://picsum.photos/seed/${node.imgSeed}/150/150`} />
                    <AvatarFallback>{node.label.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className={cn(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest z-20 shadow-lg pointer-events-none skew-x-[-12deg]",
                  node.type === 'core' ? "bg-primary text-background" : "bg-background/90 text-primary border border-primary/20"
                )}>
                  {node.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Network Analytics Panel */}
        <Card className="cyber-border border-primary/10 bg-background/40">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
              <Activity className="h-4 w-4" /> Reach Analytics
            </h3>
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
                <span className="text-foreground">{links.filter(l => l.strength === 'weak').length} Nodes</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent/40 w-1/4" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                <span className="text-muted-foreground">Stable Trusts</span>
                <span className="text-foreground">{links.filter(l => l.strength === 'moderate').length} Nodes</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 w-2/4" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                <span className="text-primary glow-cyan">Critical Mobilizers</span>
                <span className="text-foreground">{links.filter(l => l.strength === 'critical').length} Nodes</span>
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
