
"use client"

import React, { useState, useMemo, useRef } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
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

type Link = {
  from: string;
  to: string;
  strength: RelationshipStrength;
};

const EXPECTED_CASELOAD = 15;

export default function SocialNetworkMapPage() {
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

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Add Node State
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
  const [newNodeData, setNewNodeData] = useState<Partial<Hotspot>>({
    name: '',
    type: 'KP Member',
    ward: 'Ward 3',
    influenceScore: 50
  });

  const handlePointerDown = (id: string) => (e: React.PointerEvent) => {
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
    toast({ title: "Peer Node Added", description: `${newNode.name} initialized in network.` });
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
    <div className="min-h-screen bg-background bg-grid p-6 space-y-6 overflow-hidden select-none">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8 w-full lg:w-auto">
          <h1 className="text-3xl font-black tracking-tighter text-primary glow-cyan uppercase italic">Social Network Intelligence</h1>
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
            <Input placeholder="Search people..." className="pl-10 cyber-border border-primary/20 bg-background/40 h-10 italic" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => setShowAddNodeDialog(true)} variant="outline" className="border-primary/40 text-primary gap-2 h-10">
            <UserPlus className="h-4 w-4" /> Add Peer Node
          </Button>
          <Button 
            onClick={() => setLinkingMode(!linkingMode)} 
            className={cn(
              "border gap-2 h-10 transition-all shadow-lg", 
              linkingMode ? "bg-accent text-background border-accent animate-pulse" : "bg-accent/20 border-accent/40 text-accent"
            )}
          >
            <LinkIcon className="h-4 w-4" /> Establish Trust Bridge
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/10 p-3 flex items-center gap-3">
           <Zap className="h-5 w-5 text-primary" />
           <div>
             <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1 text-primary">Trust Integrity</p>
             <p className="text-xl font-black text-primary tracking-tighter">{networkIntegrity} <span className="text-[10px] opacity-50">/ 3.0</span></p>
           </div>
        </Card>
        
        <Card className="bg-card/40 border-primary/10 p-3 flex items-center gap-3">
           <Users className="h-5 w-5 text-primary" />
           <div>
             <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1 text-primary">Total Nodes</p>
             <p className="text-xl font-black tracking-tighter text-foreground">{people.length}</p>
           </div>
        </Card>

        <Card className={cn("bg-card/40 border p-3 flex items-center gap-3", isolatedNodes.length > 0 ? "border-destructive/40 bg-destructive/5" : "border-primary/10")}>
           <UserCheck className={cn("h-5 w-5", isolatedNodes.length > 0 ? "text-destructive" : "text-primary")} />
           <div>
             <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Isolated Peers</p>
             <p className={cn("text-xl font-black tracking-tighter", isolatedNodes.length > 0 ? "text-destructive" : "text-foreground")}>
               {isolatedNodes.length}
             </p>
           </div>
        </Card>

        <Card className="bg-primary/5 border-primary/10 p-3 flex items-center gap-3">
           <MousePointer2 className="h-5 w-5 text-primary" />
           <div>
             <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Interactions</p>
             <p className="text-sm font-bold text-foreground">DRAG TO CLUSTER</p>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        <Card className="lg:col-span-1 cyber-border border-primary/10 bg-background/40 p-4 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Trust Ledger
            </h2>
            <p className="text-[8px] text-muted-foreground font-medium italic">People-centric relationship mapping</p>
          </div>
          
          <div className="space-y-3">
             {links.map((link, i) => (
               <div key={i} className="flex items-center justify-between p-2 bg-muted/10 rounded border border-primary/5 text-[10px]">
                 <span className="truncate max-w-[70px] font-bold">{getPerson(link.from)?.name}</span>
                 <LinkIcon className="h-3 w-3 text-primary mx-2 opacity-50" />
                 <span className="truncate max-w-[70px] font-bold">{getPerson(link.to)?.name}</span>
                 <Badge variant="outline" className={cn(
                   "text-[8px] border-primary/20",
                   link.strength === 'Weak' ? "text-muted-foreground border-muted" : "text-primary"
                 )}>
                   {link.strength}
                 </Badge>
               </div>
             ))}
             {links.length === 0 && <p className="text-[9px] text-center italic text-muted-foreground py-4">No active trust bridges.</p>}
          </div>

          <div className="pt-6 border-t border-primary/10 space-y-4">
            <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Social Roles</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-accent/20 rounded-full border border-accent/40"><Shield className="h-3 w-3 text-accent" /></div>
                <span className="text-[9px] font-black uppercase">Peer Leader</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary/20 rounded-full border border-primary/40"><Zap className="h-3 w-3 text-primary" /></div>
                <span className="text-[9px] font-black uppercase">Influencer</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-muted rounded-full border border-border"><Users className="h-3 w-3 text-muted-foreground" /></div>
                <span className="text-[9px] font-black uppercase">KP Member</span>
              </div>
            </div>
          </div>
        </Card>

        <div 
          ref={containerRef}
          className={cn(
            "lg:col-span-3 relative h-full cyber-border border-primary/10 overflow-hidden bg-background/50",
            linkingMode && "ring-2 ring-accent/40 cursor-crosshair",
            draggingNodeId && "cursor-grabbing"
          )}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="absolute top-4 left-4 z-40 space-y-1 pointer-events-none">
            <Badge className="bg-primary/80 text-background font-black uppercase text-[10px] tracking-widest shadow-lg">
              SNA Intelligence Engine
            </Badge>
            <div className="flex items-center gap-2 text-[8px] font-bold text-primary/60 uppercase">
              <Compass className="h-3 w-3" />
              Social Integrity Matrix
            </div>
          </div>

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
                    "relative flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background shadow-xl transition-all",
                    person.type === 'Peer Leader' ? "border-accent text-accent shadow-accent/20" : 
                    person.type === 'Influencer' ? "border-primary text-primary shadow-primary/20" :
                    "border-muted text-muted-foreground",
                    isIsolated && "animate-flicker border-destructive text-destructive shadow-destructive/40"
                  )}>
                    {person.type === 'Peer Leader' && <Shield className="h-6 w-6" />}
                    {person.type === 'Influencer' && <Zap className="h-6 w-6" />}
                    {person.type === 'KP Member' && <Users className="h-6 w-6" />}
                    
                    <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                       <Card className="p-3 border-primary/20 bg-background/95 backdrop-blur whitespace-nowrap shadow-2xl">
                          <p className="text-[11px] font-black uppercase text-primary leading-none mb-1">{person.name}</p>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[9px] py-0 px-1 border-primary/20 font-bold uppercase">{person.type}</Badge>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Influence: {person.influenceScore || 0}</span>
                          </div>
                       </Card>
                    </div>
                  </div>
                  <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-foreground/70 bg-background/60 px-2 rounded">{person.name}</p>

                  {isIsolated && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-destructive text-white text-[7px] font-black py-0 px-2 leading-none uppercase animate-pulse">ISOLATED PEER</Badge>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {linkingMode && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent text-background px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4 z-50">
                Establish Bridge: {selectedSourceId ? "Select Target Peer" : "Select Source Peer"}
                <Button variant="ghost" size="icon" className="h-5 w-5 text-background hover:bg-black/10 rounded-full" onClick={() => {setLinkingMode(false); setSelectedSourceId(null); setSelectedTargetId(null);}}>
                   <X className="h-4 w-4" />
                </Button>
             </div>
          )}
        </div>
      </div>

      <Dialog open={showStrengthDialog} onOpenChange={setShowStrengthDialog}>
        <DialogContent className="cyber-border bg-background border-primary/20">
          <DialogHeader><CardTitle className="text-primary font-black italic uppercase">Establish Trust Bridge</CardTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-black text-muted-foreground">Relationship Strength</Label>
              <Select value={newLinkStrength} onValueChange={(v: RelationshipStrength) => setNewLinkStrength(v)}>
                <SelectTrigger className="bg-muted/20 border-primary/10 h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weak">Weak (Acquaintance)</SelectItem>
                  <SelectItem value="Moderate">Moderate (Trusted Contact)</SelectItem>
                  <SelectItem value="Strong">Strong (Direct Influence)</SelectItem>
                  <SelectItem value="Critical">Critical (Strategic Leader Link)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={confirmLink} className="bg-accent text-background font-black w-full h-12 shadow-lg">Confirm Trust Link</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddNodeDialog} onOpenChange={setShowAddNodeDialog}>
        <DialogContent className="cyber-border bg-background border-primary/20">
          <DialogHeader><CardTitle className="text-primary font-black italic uppercase">Add Peer Node</CardTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-black text-muted-foreground">Peer Name / Identifier</Label>
              <Input 
                value={newNodeData.name} 
                onChange={(e) => setNewNodeData({...newNodeData, name: e.target.value})}
                placeholder="e.g. Sarah Leader" 
                className="bg-muted/20 border-primary/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-black text-muted-foreground">Social Role</Label>
                <Select value={newNodeData.type} onValueChange={(v) => setNewNodeData({...newNodeData, type: v as PersonType})}>
                  <SelectTrigger className="bg-muted/20 border-primary/10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Peer Leader">Peer Leader</SelectItem>
                    <SelectItem value="Influencer">Influencer</SelectItem>
                    <SelectItem value="KP Member">KP Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-black text-muted-foreground">Influence Score (0-100)</Label>
                <Input 
                  type="number" 
                  value={newNodeData.influenceScore} 
                  onChange={(e) => setNewNodeData({...newNodeData, influenceScore: parseInt(e.target.value) || 0})}
                  className="bg-muted/20 border-primary/10"
                />
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={handleAddNode} className="bg-primary text-background font-black w-full h-12 shadow-lg">Initialize Peer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
