"use client"

import React, { useState, useMemo, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Activity,
  Network,
  Link as LinkIcon,
  Plus,
  X,
  Target,
  Zap,
  Users,
  Shield,
  Compass,
  Share2,
  MousePointer2,
  UserCheck,
  UserPlus
} from 'lucide-react'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { RelationshipStrength, Hotspot, PersonType } from '@/lib/types'
import { INITIAL_HOTSPOTS } from '@/lib/store'
import { toast } from '@/hooks/use-toast'

interface SocialNetworkMapProps {
  interactive?: boolean;
}

type Link = {
  from: string;
  to: string;
  strength: RelationshipStrength;
};

export function SocialNetworkMap({ interactive = true }: SocialNetworkMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [linkingMode, setLinkingMode] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [showStrengthDialog, setShowStrengthDialog] = useState(false);
  const [newLinkStrength, setNewLinkStrength] = useState<RelationshipStrength>('Moderate');

  const [people, setPeople] = useState<Hotspot[]>(INITIAL_HOTSPOTS);
  const [links, setLinks] = useState<Link[]>([
    { from: 'h1', to: 'h2', strength: 'Strong' },
    { from: 'h2', to: 'h3', strength: 'Weak' },
    { from: 'h1', to: 'h4', strength: 'Moderate' },
  ]);

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  const [newNodeData, setNewNodeData] = useState<Partial<Hotspot>>({
    name: '',
    type: 'KP Member',
    ward: 'Ward 3',
    influenceScore: 50
  });

  const handlePointerDown = (id: string) => (e: React.PointerEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    if (linkingMode) {
      if (!selectedSourceId) {
        setSelectedSourceId(id);
        toast({ title: "Source Peer Selected", description: "Now select the target peer to bridge." });
      } else if (!selectedTargetId && id !== selectedSourceId) {
        setSelectedTargetId(id);
        setShowStrengthDialog(true);
      }
    } else {
      setDraggingNodeId(id);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingNodeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setPeople(prev => prev.map(p => 
        p.id === draggingNodeId ? { ...p, x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) } : p
      ));
    }
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
  };

  const handleAddNode = () => {
    if (!newNodeData.name) {
      toast({ title: "Name Required", variant: "destructive" });
      return;
    }
    const id = `n-${Date.now()}`;
    const newNode: Hotspot = {
      id,
      name: newNodeData.name!,
      type: newNodeData.type as PersonType,
      lat: 0,
      lng: 0,
      ward: newNodeData.ward!,
      reachCount: 0,
      influenceScore: newNodeData.influenceScore,
      x: 50,
      y: 50
    };
    setPeople(prev => [...prev, newNode]);
    setShowAddNodeDialog(false);
    setNewNodeData({ name: '', type: 'KP Member', ward: 'Ward 3', influenceScore: 50 });
    toast({ title: "Peer Node Added" });
  };

  const confirmLink = () => {
    if (selectedSourceId && selectedTargetId) {
      const exists = links.some(l => (l.from === selectedSourceId && l.to === selectedTargetId) || (l.from === selectedTargetId && l.to === selectedSourceId));
      if (exists) {
        toast({ title: "Trust Bridge Exists", variant: "destructive" });
      } else {
        setLinks([...links, { from: selectedSourceId, to: selectedTargetId, strength: newLinkStrength }]);
        toast({ title: "Trust Bridge Established" });
      }
    }
    setLinkingMode(false);
    setSelectedSourceId(null);
    setSelectedTargetId(null);
    setShowStrengthDialog(false);
  };

  const isolatedNodes = useMemo(() => {
    return people.filter(node => {
      const nodeLinks = links.filter(l => l.from === node.id || l.to === node.id);
      return nodeLinks.length > 0 && nodeLinks.every(l => l.strength === 'Weak');
    }).map(n => n.id);
  }, [people, links]);

  const networkIntegrity = useMemo(() => {
    if (links.length === 0) return 0;
    const weights = { Weak: 1, Moderate: 2, Strong: 3, Critical: 4 };
    const total = links.reduce((acc, l) => acc + weights[l.strength], 0);
    return (total / links.length).toFixed(1);
  }, [links]);

  const getPerson = (id: string) => people.find(p => p.id === id);

  const getLineStyles = (strength: RelationshipStrength) => {
    switch (strength) {
      case 'Critical': return { stroke: "hsl(var(--accent))", strokeWidth: "3", filter: "drop-shadow(0 0 5px rgba(255,120,0,0.8))" };
      case 'Strong': return { stroke: "hsl(var(--primary))", strokeWidth: "3", filter: "drop-shadow(0 0 3px rgba(0, 255, 255, 0.5))" };
      case 'Moderate': return { stroke: "hsl(var(--primary))", strokeWidth: "1.5", opacity: "0.8" };
      case 'Weak': return { stroke: "hsl(var(--muted-foreground))", strokeWidth: "1", strokeDasharray: "5 5", opacity: "0.5" };
      default: return { stroke: "hsl(var(--primary))", strokeWidth: "1" };
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {interactive && (
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div className="flex gap-2">
            <Button onClick={() => setShowAddNodeDialog(true)} variant="outline" size="sm" className="border-primary/40 text-primary gap-2 h-9 text-xs">
              <UserPlus className="h-4 w-4" /> Add Peer Node
            </Button>
            <Button 
              onClick={() => setLinkingMode(!linkingMode)} 
              size="sm"
              className={cn(
                "border gap-2 h-9 text-xs transition-all", 
                linkingMode ? "bg-accent text-background border-accent animate-pulse" : "bg-accent/20 border-accent/40 text-accent"
              )}
            >
              <LinkIcon className="h-4 w-4" /> Establish Bridge
            </Button>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
                <p className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-1">Integrity Score</p>
                <p className="text-sm font-black text-primary">{networkIntegrity}</p>
             </div>
             <div className="text-right">
                <p className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-1">Isolated</p>
                <p className={cn("text-sm font-black", isolatedNodes.length > 0 ? "text-accent" : "text-foreground")}>{isolatedNodes.length}</p>
             </div>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className={cn(
          "relative flex-1 min-h-[500px] cyber-border border-primary/10 overflow-hidden bg-background/50",
          linkingMode && "ring-2 ring-accent/40 cursor-crosshair",
          draggingNodeId && "cursor-grabbing"
        )}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

        <svg className="absolute inset-0 w-full h-full network-line opacity-60 pointer-events-none">
          {links.map((link, idx) => {
            const from = getPerson(link.from);
            const to = getPerson(link.to);
            if (!from || !to) return null;
            return (
              <line 
                key={idx} 
                x1={`${from.x ?? 50}%`} 
                y1={`${from.y ?? 50}%`} 
                x2={`${to.x ?? 50}%`} 
                y2={`${to.y ?? 50}%`} 
                {...getLineStyles(link.strength)} 
              />
            )
          })}
        </svg>

        {people.map(person => {
          const isIsolated = isolatedNodes.includes(person.id);
          const isSelectedSource = person.id === selectedSourceId;
          const isSelectedTarget = person.id === selectedTargetId;

          return (
            <div 
              key={person.id} 
              className={cn(
                "absolute z-30 group transition-all cursor-grab active:cursor-grabbing",
                draggingNodeId === person.id && "scale-110 z-50",
                isSelectedSource && "ring-4 ring-primary ring-offset-2 ring-offset-background",
                isSelectedTarget && "ring-4 ring-accent ring-offset-2 ring-offset-background"
              )} 
              style={{ top: `${person.y ?? 50}%`, left: `${person.x ?? 50}%`, transform: 'translate(-50%, -50%)' }} 
              onPointerDown={handlePointerDown(person.id)}
            >
              <div className="relative flex flex-col items-center">
                <div className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background shadow-xl transition-all",
                  person.type === 'Peer Leader' ? "border-accent text-accent shadow-accent/20" : 
                  person.type === 'Influencer' ? "border-primary text-primary shadow-primary/20" :
                  "border-muted text-muted-foreground",
                  isIsolated && "animate-flicker border-destructive text-destructive"
                )}>
                  {person.type === 'Peer Leader' && <Shield className="h-5 w-5" />}
                  {person.type === 'Influencer' && <Zap className="h-5 w-5" />}
                  {person.type === 'KP Member' && <Users className="h-5 w-5" />}
                  
                  <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                     <Card className="p-2 border-primary/20 bg-background/95 backdrop-blur whitespace-nowrap shadow-2xl">
                        <p className="text-[10px] font-black uppercase text-primary leading-none mb-1">{person.name}</p>
                        <Badge variant="outline" className="text-[8px] py-0 px-1 border-primary/20 font-bold uppercase">{person.type}</Badge>
                     </Card>
                  </div>
                </div>
                <p className="mt-1 text-[8px] font-black uppercase tracking-widest text-foreground/70 bg-background/60 px-2 rounded">{person.name}</p>
              </div>
            </div>
          );
        })}

        {linkingMode && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent text-background px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50">
              {selectedSourceId ? "Select Target" : "Select Source"}
              <X className="h-3 w-3 cursor-pointer" onClick={() => {setLinkingMode(false); setSelectedSourceId(null); setSelectedTargetId(null);}} />
           </div>
        )}
      </div>

      <Dialog open={showStrengthDialog} onOpenChange={setShowStrengthDialog}>
        <DialogContent className="cyber-border bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-primary font-black italic uppercase">Establish Trust Bridge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-black text-muted-foreground">Relationship Strength</Label>
              <Select value={newLinkStrength} onValueChange={(v: RelationshipStrength) => setNewLinkStrength(v)}>
                <SelectTrigger className="bg-muted/20 border-primary/10 h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weak">Weak</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Strong">Strong</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={confirmLink} className="bg-accent text-background font-black w-full h-10">Confirm Link</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddNodeDialog} onOpenChange={setShowAddNodeDialog}>
        <DialogContent className="cyber-border bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-primary font-black italic uppercase">Add Peer Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-black text-muted-foreground">Peer Name</Label>
              <Input 
                value={newNodeData.name} 
                onChange={(e) => setNewNodeData({...newNodeData, name: e.target.value})}
                className="bg-muted/20 border-primary/10 h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-black text-muted-foreground">Role</Label>
                <Select value={newNodeData.type} onValueChange={(v) => setNewNodeData({...newNodeData, type: v as PersonType})}>
                  <SelectTrigger className="bg-muted/20 border-primary/10 h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Peer Leader">Leader</SelectItem>
                    <SelectItem value="Influencer">Influencer</SelectItem>
                    <SelectItem value="KP Member">KP Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-black text-muted-foreground">Influence Score</Label>
                <Input 
                  type="number" 
                  value={newNodeData.influenceScore} 
                  onChange={(e) => setNewNodeData({...newNodeData, influenceScore: parseInt(e.target.value) || 0})}
                  className="bg-muted/20 border-primary/10 h-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={handleAddNode} className="bg-primary text-background font-black w-full h-10">Initialize</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
