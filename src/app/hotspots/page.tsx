
"use client"

import React, { useState, useRef, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  TrendingUp, 
  Globe, 
  Activity,
  Network,
  Link as LinkIcon,
  Plus,
  X,
  ShieldAlert,
  AlertTriangle,
  Users,
  Target,
  Zap
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
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
import { RelationshipStrength } from '@/lib/types'

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

const EXPECTED_CASELOAD = 15; // Minimum nodes required for a viable microplanning network

export default function SocialNetworkMapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [linkingMode, setLinkingMode] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [showStrengthDialog, setShowStrengthDialog] = useState(false);

  const [nodes, setNodes] = useState<Node[]>([
    { id: 'pe', x: 50, y: 50, type: 'core', label: 'Peer Educator', imgSeed: 'peereducator' },
    { id: 'leader', x: 25, y: 25, type: 'satellite', label: 'Trust Leader', imgSeed: 'node_leader' },
    { id: 'bridge', x: 75, y: 25, type: 'satellite', label: 'Bridge Node', imgSeed: 'node_bridge' },
    { id: 'high', x: 80, y: 40, type: 'satellite', label: 'High Influence', imgSeed: 'node_high' },
    { id: 'active', x: 20, y: 65, type: 'satellite', label: 'Active Participant', imgSeed: 'node_active' },
  ]);

  const [links, setLinks] = useState<Link[]>([
    { from: 'pe', to: 'leader', strength: 'Strong' },
    { from: 'pe', to: 'bridge', strength: 'Moderate' },
    { from: 'pe', to: 'high', strength: 'Weak' },
  ]);

  const [newLinkStrength, setNewLinkStrength] = useState<RelationshipStrength>('Moderate');

  const isolatedNodes = useMemo(() => {
    return nodes.filter(node => {
      if (node.type === 'core') return false;
      const nodeLinks = links.filter(l => l.from === node.id || l.to === node.id);
      // Logic: KP with only weak connections -> flag as ISOLATED PEER
      return nodeLinks.length > 0 && nodeLinks.every(l => l.strength === 'Weak');
    }).map(n => n.id);
  }, [nodes, links]);

  const coverageRate = useMemo(() => {
    return (nodes.length / EXPECTED_CASELOAD) * 100;
  }, [nodes]);

  const isInsufficient = nodes.length < EXPECTED_CASELOAD;

  const networkScore = useMemo(() => {
    if (links.length === 0) return 0;
    const weights = { Weak: 1, Moderate: 2, Strong: 3, Critical: 4 };
    const total = links.reduce((acc, l) => acc + weights[l.strength], 0);
    return (total / links.length).toFixed(1);
  }, [links]);

  const handlePointerDown = (id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    if (linkingMode) {
      if (!selectedSourceId) setSelectedSourceId(id);
      else if (!selectedTargetId && id !== selectedSourceId) {
        setSelectedTargetId(id);
        setShowStrengthDialog(true);
      }
      return;
    }
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

  const handlePointerUp = () => setDraggingNodeId(null);
  const getNode = (id: string) => nodes.find(n => n.id === id);

  const getLineStyles = (strength: RelationshipStrength) => {
    switch (strength) {
      case 'Critical': return { stroke: "hsl(var(--accent))", strokeWidth: "3", filter: "drop-shadow(0 0 5px rgba(255,120,0,0.8))" };
      case 'Strong': return { stroke: "hsl(var(--primary))", strokeWidth: "3", filter: "drop-shadow(0 0 3px rgba(0, 255, 255, 0.5))" };
      case 'Moderate': return { stroke: "hsl(var(--primary))", strokeWidth: "1.5", opacity: "0.8" };
      case 'Weak': return { stroke: "hsl(var(--muted-foreground))", strokeWidth: "1", strokeDasharray: "5 5", opacity: "0.5" };
      default: return { stroke: "hsl(var(--primary))", strokeWidth: "1" };
    }
  };

  const confirmLink = () => {
    if (selectedSourceId && selectedTargetId) {
      setLinks([...links, { from: selectedSourceId, to: selectedTargetId, strength: newLinkStrength }]);
    }
    setLinkingMode(false);
    setSelectedSourceId(null);
    setSelectedTargetId(null);
    setShowStrengthDialog(false);
  };

  return (
    <div className="min-h-screen bg-background bg-grid p-6 space-y-6 overflow-hidden select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8 w-full lg:w-auto">
          <h1 className="text-2xl font-black tracking-tighter text-primary glow-cyan uppercase italic">Social Network Map</h1>
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
            <Input placeholder="Search trust nodes..." className="pl-10 cyber-border border-primary/20 bg-background/40 h-10 italic" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setLinkingMode(true)} className={cn("border gap-2 h-10 transition-all shadow-lg", linkingMode ? "bg-accent text-background border-accent animate-pulse" : "bg-accent/20 border-accent/40 text-accent")}>
            <LinkIcon className="h-4 w-4" /> Establish Trust Bridge
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/10 p-3 flex items-center gap-3">
           <Zap className="h-5 w-5 text-primary" />
           <div>
             <p className="text-[9px] font-black text-muted-foreground uppercase">Network Strength</p>
             <p className="text-xl font-black text-primary tracking-tighter">{networkScore} <span className="text-[10px] opacity-50">/ 3.0</span></p>
           </div>
        </Card>
        
        <Card className={cn("bg-card/40 border p-3 flex items-center gap-3 transition-colors", coverageRate < 70 ? "border-accent/40 bg-accent/5" : "border-primary/10")}>
           <Target className={cn("h-5 w-5", coverageRate < 70 ? "text-accent" : "text-primary")} />
           <div>
             <div className="flex items-center gap-2">
               <p className="text-[9px] font-black text-muted-foreground uppercase">Coverage Rate</p>
               {coverageRate < 70 && <Badge variant="destructive" className="text-[7px] h-3 px-1">Low</Badge>}
             </div>
             <p className={cn("text-xl font-black tracking-tighter", coverageRate < 70 ? "text-accent" : "text-primary")}>
               {coverageRate.toFixed(0)}%
             </p>
           </div>
        </Card>

        <Card className={cn("bg-card/40 border p-3 flex items-center gap-3", isolatedNodes.length > 0 ? "border-accent/40 bg-accent/5" : "border-primary/10")}>
           <Users className={cn("h-5 w-5", isolatedNodes.length > 0 ? "text-accent" : "text-primary")} />
           <div>
             <p className="text-[9px] font-black text-muted-foreground uppercase">Isolated Nodes</p>
             <p className={cn("text-xl font-black tracking-tighter", isolatedNodes.length > 0 ? "text-accent" : "text-foreground")}>
               {isolatedNodes.length}
             </p>
           </div>
        </Card>

        {isInsufficient && (
          <Card className="bg-destructive/10 border-destructive/20 p-3 flex items-center gap-3 animate-pulse">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-[8px] font-black text-destructive uppercase leading-none">Viability Warning</p>
              <p className="text-[10px] font-bold text-destructive leading-tight">INSUFFICIENT NETWORK FOR MICROPLANNING</p>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        <Card className="lg:col-span-1 cyber-border border-primary/10 bg-background/40 p-4 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
              <Network className="h-4 w-4" /> Relationship Ledger
            </h2>
            <p className="text-[8px] text-muted-foreground font-medium italic">Establishing bridges builds microplanner trust</p>
          </div>
          
          <div className="space-y-3">
             {links.map((link, i) => (
               <div key={i} className="flex items-center justify-between p-2 bg-muted/10 rounded border border-primary/5 text-[10px]">
                 <span className="truncate max-w-[60px]">{getNode(link.from)?.label}</span>
                 <LinkIcon className="h-3 w-3 text-primary mx-2 opacity-50" />
                 <span className="truncate max-w-[60px]">{getNode(link.to)?.label}</span>
                 <Badge variant="outline" className={cn(
                   "text-[8px] border-primary/20",
                   link.strength === 'Weak' ? "text-muted-foreground border-muted" : "text-primary"
                 )}>
                   {link.strength}
                 </Badge>
               </div>
             ))}
             {links.length === 0 && (
               <div className="py-12 text-center space-y-2 opacity-30">
                 <LinkIcon className="h-8 w-8 mx-auto" />
                 <p className="text-[10px] font-bold uppercase">No Trust Links Found</p>
               </div>
             )}
          </div>

          <div className="pt-6 border-t border-primary/10">
            <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-4">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0 border-t-2 border-primary border-dashed" />
                <span className="text-[9px] font-bold uppercase">Weak (Dotted)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-0 border-t border-primary" />
                <span className="text-[9px] font-bold uppercase">Moderate (Thin)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-0 border-t-2 border-primary" />
                <span className="text-[9px] font-bold uppercase">Strong (Bold)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-0 border-t-2 border-accent shadow-[0_0_5px_rgba(255,120,0,0.8)]" />
                <span className="text-[9px] font-bold uppercase">Critical (Glowing)</span>
              </div>
            </div>
          </div>
        </Card>

        <div ref={containerRef} className={cn("lg:col-span-3 relative h-full cyber-border border-primary/10 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)]", linkingMode && "bg-accent/5 ring-2 ring-accent/20 ring-inset cursor-crosshair")}>
          <svg className="absolute inset-0 w-full h-full network-line opacity-40 pointer-events-none">
            {links.map((link, idx) => {
              const from = getNode(link.from);
              const to = getNode(link.to);
              if (!from || !to) return null;
              return <line key={idx} x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`} {...getLineStyles(link.strength)} />
            })}
          </svg>

          {nodes.map(node => (
            <div key={node.id} className={cn("absolute z-30 group transition-all", !linkingMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer hover:scale-110", node.id === selectedSourceId && "ring-4 ring-accent rounded-full", node.id === selectedTargetId && "ring-4 ring-primary rounded-full")} style={{ top: `${node.y}%`, left: `${node.x}%`, transform: 'translate(-50%, -50%)' }} onPointerDown={handlePointerDown(node.id)}>
              <div className="relative">
                <div className={cn("rounded-full border-2 p-1 bg-background shadow-lg transition-all", node.type === 'core' ? "w-24 h-24 border-primary shadow-[0_0_30px_rgba(0,255,255,0.3)]" : "w-14 h-14 border-primary/40", isolatedNodes.includes(node.id) && "border-accent animate-flicker")}>
                  <Avatar className="w-full h-full"><AvatarImage src={`https://picsum.photos/seed/${node.imgSeed}/100/100`} /><AvatarFallback>KP</AvatarFallback></Avatar>
                </div>
                {isolatedNodes.includes(node.id) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-background text-[7px] font-black py-0 px-1 leading-none uppercase border-none shadow-[0_0_8px_rgba(255,120,0,0.5)]">Isolated Peer</Badge>
                  </div>
                )}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background/90 text-primary px-2 py-0.5 rounded text-[8px] font-black uppercase whitespace-nowrap shadow-md border border-primary/10">{node.label}</div>
              </div>
            </div>
          ))}

          {linkingMode && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent text-background px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4">
                Establish Link: Select Source Node
                <Button variant="ghost" size="icon" className="h-4 w-4 text-background hover:bg-black/10 rounded-full" onClick={() => setLinkingMode(false)}>
                   <X className="h-3 w-3" />
                </Button>
             </div>
          )}
        </div>
      </div>

      <Dialog open={showStrengthDialog} onOpenChange={setShowStrengthDialog}>
        <DialogContent className="cyber-border bg-background border-primary/20">
          <DialogHeader><DialogTitle className="text-primary font-black italic uppercase">Establish Trust Link</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-black text-muted-foreground">Relationship Strength</Label>
              <Select value={newLinkStrength} onValueChange={(v: RelationshipStrength) => setNewLinkStrength(v)}>
                <SelectTrigger className="bg-muted/20 border-primary/10 h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weak">Weak (Initial Contact)</SelectItem>
                  <SelectItem value="Moderate">Moderate (Trust Established)</SelectItem>
                  <SelectItem value="Strong">Strong (Active Leader)</SelectItem>
                  <SelectItem value="Critical">Critical (High Influence)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              * Relationship strength directly impacts the Network Strength KPI.
            </p>
          </div>
          <DialogFooter><Button onClick={confirmLink} className="bg-accent text-background font-black w-full h-12 shadow-lg">Confirm Trust Link</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
