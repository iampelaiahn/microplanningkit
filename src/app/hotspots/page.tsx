
"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Map as MapIcon, 
  Activity,
  Network,
  Link as LinkIcon,
  Plus,
  X,
  ShieldAlert,
  Target,
  Zap,
  Building2,
  Users,
  MapPin,
  Shield
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
import { RelationshipStrength } from '@/lib/types'
import { INITIAL_HOTSPOTS } from '@/lib/store'

type Link = {
  from: string;
  to: string;
  strength: RelationshipStrength;
};

const EXPECTED_CASELOAD = 15; // Minimum nodes required for viability

export default function SocialNetworkMapPage() {
  const [linkingMode, setLinkingMode] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [showStrengthDialog, setShowStrengthDialog] = useState(false);
  const [newLinkStrength, setNewLinkStrength] = useState<RelationshipStrength>('Moderate');

  const [hotspots] = useState(INITIAL_HOTSPOTS);
  const [links, setLinks] = useState<Link[]>([
    { from: 'h2', to: 'h1', strength: 'Strong' },
    { from: 'h2', to: 'h4', strength: 'Weak' },
    { from: 'h3', to: 'h1', strength: 'Moderate' },
  ]);

  // Map projection logic: Mbare bounds
  const MAP_BOUNDS = {
    minLat: -17.868,
    maxLat: -17.850,
    minLng: 31.030,
    maxLng: 31.055
  };

  const projectCoord = (lat: number, lng: number) => {
    const y = ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
    const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
    return { 
      x: Math.max(5, Math.min(95, x)), 
      y: 100 - Math.max(5, Math.min(95, y)) 
    };
  };

  const isolatedNodes = useMemo(() => {
    return hotspots.filter(node => {
      const nodeLinks = links.filter(l => l.from === node.id || l.to === node.id);
      return nodeLinks.length > 0 && nodeLinks.every(l => l.strength === 'Weak');
    }).map(n => n.id);
  }, [hotspots, links]);

  const coverageRate = useMemo(() => {
    return (hotspots.length / EXPECTED_CASELOAD) * 100;
  }, [hotspots]);

  const isInsufficient = hotspots.length < EXPECTED_CASELOAD;

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
    }
  };

  const getHotspot = (id: string) => hotspots.find(h => h.id === id);

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

  const renderPin = (hotspot: typeof hotspots[0]) => {
    const isIsolated = isolatedNodes.includes(hotspot.id);
    const { x, y } = projectCoord(hotspot.lat, hotspot.lng);

    return (
      <div 
        key={hotspot.id} 
        className={cn(
          "absolute z-30 group transition-all cursor-pointer",
          hotspot.id === selectedSourceId && "scale-125 z-40",
          hotspot.id === selectedTargetId && "scale-125 z-40"
        )} 
        style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -100%)' }} 
        onPointerDown={handlePointerDown(hotspot.id)}
      >
        <div className="relative flex flex-col items-center">
          {/* Custom Pin Design */}
          <div className={cn(
            "relative flex items-center justify-center w-12 h-12 rounded-full border-2 bg-background shadow-xl transition-all",
            hotspot.type === 'Facility' ? "border-primary text-primary shadow-primary/20" : 
            hotspot.type === 'Peer' ? "border-accent text-accent shadow-accent/20" :
            "border-green-500 text-green-500",
            isIsolated && "animate-flicker border-destructive text-destructive shadow-destructive/40"
          )}>
            {hotspot.type === 'Facility' && <Building2 className="h-6 w-6" />}
            {hotspot.type === 'Community' && <Target className="h-6 w-6" />}
            {hotspot.type === 'Peer' && <Shield className="h-6 w-6" />}
            
            {/* Tooltip on Hover */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
               <Card className="p-2 border-primary/20 bg-background/95 backdrop-blur whitespace-nowrap">
                  <p className="text-[10px] font-black uppercase text-primary leading-none mb-1">{hotspot.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[8px] py-0 px-1 border-primary/20 font-bold uppercase">{hotspot.ward}</Badge>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{hotspot.type}</span>
                  </div>
               </Card>
            </div>
          </div>
          
          {/* Pin Tail */}
          <div className={cn(
            "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]",
            hotspot.type === 'Facility' ? "border-t-primary" : 
            hotspot.type === 'Peer' ? "border-t-accent" : "border-t-green-500",
            isIsolated && "border-t-destructive"
          )} />

          {isIsolated && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-destructive text-white text-[7px] font-black py-0 px-1 leading-none uppercase animate-pulse">Isolated</Badge>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background bg-grid p-6 space-y-6 overflow-hidden select-none">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8 w-full lg:w-auto">
          <h1 className="text-3xl font-black tracking-tighter text-primary glow-cyan uppercase italic">Geo-Social Intelligence</h1>
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
            <Input placeholder="Search geographic nodes..." className="pl-10 cyber-border border-primary/20 bg-background/40 h-10 italic" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setLinkingMode(true)} className={cn("border gap-2 h-10 transition-all shadow-lg", linkingMode ? "bg-accent text-background border-accent animate-pulse" : "bg-accent/20 border-accent/40 text-accent")}>
            <LinkIcon className="h-4 w-4" /> Link Geographic Nodes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/10 p-3 flex items-center gap-3">
           <Zap className="h-5 w-5 text-primary" />
           <div>
             <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Network Score</p>
             <p className="text-xl font-black text-primary tracking-tighter">{networkScore} <span className="text-[10px] opacity-50">/ 3.0</span></p>
           </div>
        </Card>
        
        <Card className={cn("bg-card/40 border p-3 flex items-center gap-3 transition-colors", coverageRate < 70 ? "border-accent/40 bg-accent/5" : "border-primary/10")}>
           <Target className={cn("h-5 w-5", coverageRate < 70 ? "text-accent" : "text-primary")} />
           <div>
             <div className="flex items-center gap-2">
               <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Coverage Rate</p>
               {coverageRate < 70 && <Badge variant="destructive" className="text-[7px] h-3 px-1">Critical</Badge>}
             </div>
             <p className={cn("text-xl font-black tracking-tighter", coverageRate < 70 ? "text-accent" : "text-primary")}>
               {coverageRate.toFixed(0)}%
             </p>
           </div>
        </Card>

        <Card className={cn("bg-card/40 border p-3 flex items-center gap-3", isolatedNodes.length > 0 ? "border-destructive/40 bg-destructive/5" : "border-primary/10")}>
           <Users className={cn("h-5 w-5", isolatedNodes.length > 0 ? "text-destructive" : "text-primary")} />
           <div>
             <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Isolated Spots</p>
             <p className={cn("text-xl font-black tracking-tighter", isolatedNodes.length > 0 ? "text-destructive" : "text-foreground")}>
               {isolatedNodes.length}
             </p>
           </div>
        </Card>

        {isInsufficient && (
          <Card className="bg-destructive/10 border-destructive/20 p-3 flex items-center gap-3 animate-pulse">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-[8px] font-black text-destructive uppercase leading-none">Microplanning Risk</p>
              <p className="text-[10px] font-bold text-destructive leading-tight uppercase">Insufficient Network Coverage</p>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Relationship Ledger */}
        <Card className="lg:col-span-1 cyber-border border-primary/10 bg-background/40 p-4 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
              <Network className="h-4 w-4" /> Node Trust Bridges
            </h2>
            <p className="text-[8px] text-muted-foreground font-medium italic">Geographic links build operational reach</p>
          </div>
          
          <div className="space-y-3">
             {links.map((link, i) => (
               <div key={i} className="flex items-center justify-between p-2 bg-muted/10 rounded border border-primary/5 text-[10px]">
                 <span className="truncate max-w-[70px] font-bold">{getHotspot(link.from)?.name}</span>
                 <LinkIcon className="h-3 w-3 text-primary mx-2 opacity-50" />
                 <span className="truncate max-w-[70px] font-bold">{getHotspot(link.to)?.name}</span>
                 <Badge variant="outline" className={cn(
                   "text-[8px] border-primary/20",
                   link.strength === 'Weak' ? "text-muted-foreground border-muted" : "text-primary"
                 )}>
                   {link.strength}
                 </Badge>
               </div>
             ))}
          </div>

          <div className="pt-6 border-t border-primary/10">
            <h3 className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-4">Legend</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded border border-primary/40"><Building2 className="h-3 w-3 text-primary" /></div>
                <span className="text-[9px] font-black uppercase">Facility Node</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded border border-green-500/40"><Target className="h-3 w-3 text-green-500" /></div>
                <span className="text-[9px] font-black uppercase">Community Hotspot</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded border border-accent/40"><Shield className="h-3 w-3 text-accent" /></div>
                <span className="text-[9px] font-black uppercase">Peer Leader</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Geographic Map Container */}
        <div className={cn(
          "lg:col-span-3 relative h-full cyber-border border-primary/10 overflow-hidden",
          "bg-[url('https://picsum.photos/seed/mbaremap/1200/800')] bg-cover bg-center grayscale opacity-90 contrast-125",
          linkingMode && "ring-2 ring-accent/40 cursor-crosshair"
        )}>
          {/* Map Overlay Layer */}
          <div className="absolute inset-0 bg-background/60 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full network-line opacity-60 pointer-events-none">
            {links.map((link, idx) => {
              const from = getHotspot(link.from);
              const to = getHotspot(link.to);
              if (!from || !to) return null;
              const p1 = projectCoord(from.lat, from.lng);
              const p2 = projectCoord(to.lat, to.lng);
              return <line key={idx} x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`} {...getLineStyles(link.strength)} />
            })}
          </svg>

          {/* Hotspot Pins */}
          {hotspots.map(hotspot => renderPin(hotspot))}

          {linkingMode && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent text-background px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4">
                Linking Mode Active: Select Nodes
                <Button variant="ghost" size="icon" className="h-4 w-4 text-background hover:bg-black/10 rounded-full" onClick={() => setLinkingMode(false)}>
                   <X className="h-3 w-3" />
                </Button>
             </div>
          )}

          {/* Compass Icon */}
          <div className="absolute bottom-4 right-4 p-3 rounded-full bg-background/80 border border-primary/20 backdrop-blur">
             <MapIcon className="h-5 w-5 text-primary opacity-40" />
          </div>
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
                  <SelectItem value="Weak">Weak (Disconnected)</SelectItem>
                  <SelectItem value="Moderate">Moderate (Trust Established)</SelectItem>
                  <SelectItem value="Strong">Strong (Direct Influence)</SelectItem>
                  <SelectItem value="Critical">Critical (Strategic Hub)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={confirmLink} className="bg-accent text-background font-black w-full h-12 shadow-lg">Confirm Trust Link</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
