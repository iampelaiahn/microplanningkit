
"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Map as MapIcon, 
  Compass, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle2,
  Beer,
  Home,
  Building2,
  Hotel,
  Share2,
  Search,
  Filter,
  Info
} from 'lucide-react'
import { useCollection } from '@/firebase'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'

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

const getTypologyIcon = (typology: string[]) => {
  if (typology.includes('Bar') || typology.includes('Shebeen')) return <Beer className="h-4 w-4" />;
  if (typology.includes('Brothel') || typology.includes('Hotel') || typology.includes('Lodge')) return <Hotel className="h-4 w-4" />;
  if (typology.includes('Home-based')) return <Home className="h-4 w-4" />;
  if (typology.includes('Social Media')) return <Share2 className="h-4 w-4" />;
  return <Target className="h-4 w-4" />;
};

export default function HotspotMonitoringPage() {
  const { data: profiles, loading } = useCollection('hotspotProfiles');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWard, setSelectedWard] = useState("All");
  
  const mapImage = PlaceHolderImages.find(img => img.id === 'mbare-map');

  const filteredProfiles = useMemo(() => {
    return (profiles || []).filter(p => {
      const matchesSearch = p.hotspotName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.siteName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWard = selectedWard === "All" || p.ward === selectedWard;
      return matchesSearch && matchesWard;
    });
  }, [profiles, searchTerm, selectedWard]);

  const stats = useMemo(() => {
    const total = (profiles || []).length;
    const critical = (profiles || []).filter(p => p.priorityLevel === 'Critical' || p.priorityLevel === 'High').length;
    const totalPop = (profiles || []).reduce((acc, p) => {
      const pData = p.populationData || {};
      return acc + Object.values(pData).reduce((pAcc: number, pCur: any) => pAcc + (pCur.total || 0), 0);
    }, 0);

    return { total, critical, totalPop };
  }, [profiles]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary uppercase italic tracking-tighter glow-cyan">
            Hotspot Surveillance Tracker
          </h1>
          <p className="text-muted-foreground">Geo-spatial monitoring of mapped sites, typology, and structural risks.</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search hotspots..." 
              className="pl-10 bg-background/50 border-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/40 h-10 px-4 flex gap-2">
            <Compass className="h-4 w-4" /> Live Field Map
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cyber-border bg-background/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" /> Total Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="cyber-border bg-background/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Critical Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-accent">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card className="cyber-border bg-background/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" /> Reach Estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">~{stats.totalPop}</div>
          </CardContent>
        </Card>
        <Card className="cyber-border bg-background/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" /> Map Integrity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">High</div>
          </CardContent>
        </Card>
      </div>

      <Card className="cyber-border border-primary/10 overflow-hidden relative min-h-[600px]">
        <CardHeader className="border-b border-primary/10 bg-background/40 z-10 relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black italic flex items-center gap-2 uppercase tracking-tight text-primary">
                <MapIcon className="h-5 w-5" /> Geographic Surveillance View
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase">Mbare Field Grid v1.4 • Site Typology disaggregation</CardDescription>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <span className="text-[10px] font-black uppercase">Critical</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span className="text-[10px] font-black uppercase">Standard</span>
               </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 relative h-[600px]">
          {/* Base Map Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale opacity-70 mix-blend-overlay"
            style={{ backgroundImage: `url(${mapImage?.imageUrl})` }}
            data-ai-hint="city map"
          />
          <div className="absolute inset-0 bg-background/40 pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-50">
               <div className="flex flex-col items-center gap-4">
                  <Activity className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Initializing Map Engine...</p>
               </div>
            </div>
          ) : (
            filteredProfiles.map((profile) => {
              const { x, y } = projectCoord(profile.lat || 0, profile.lng || 0);
              const isCritical = profile.priorityLevel === 'Critical' || profile.priorityLevel === 'High';
              
              return (
                <Popover key={profile.id}>
                  <PopoverTrigger asChild>
                    <div 
                      className="absolute z-30 group cursor-pointer"
                      style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -100%)' }}
                    >
                      <div className="relative flex flex-col items-center transition-transform hover:scale-110">
                        <div className={cn(
                          "relative rounded-full border-2 p-2 shadow-2xl transition-all",
                          isCritical ? "bg-accent/20 border-accent text-accent animate-pulse" : "bg-primary/20 border-primary text-primary"
                        )}>
                          {getTypologyIcon(profile.typology || [])}
                        </div>
                        <div className={cn(
                          "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]",
                          isCritical ? "border-t-accent" : "border-t-primary"
                        )} />
                        
                        <div className="mt-1 px-2 py-0.5 bg-background/80 backdrop-blur rounded text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">
                          {profile.hotspotName}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 cyber-border border-primary/20 bg-background/95 backdrop-blur shadow-2xl p-0">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                        <div>
                          <h4 className="text-sm font-black uppercase text-primary italic leading-none mb-1">{profile.hotspotName}</h4>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{profile.siteName} • {profile.ward}</p>
                        </div>
                        <Badge className={cn("text-[9px] font-black uppercase", isCritical ? "bg-accent" : "bg-primary")}>
                          {profile.priorityLevel}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase text-muted-foreground">Typology</p>
                          <div className="flex flex-wrap gap-1">
                            {profile.typology?.map((t: string) => (
                              <Badge key={t} variant="outline" className="text-[8px] py-0">{t}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase text-muted-foreground text-right">Reach Est.</p>
                          <p className="text-sm font-black text-right">
                            {Object.values(profile.populationData || {}).reduce((acc: number, cur: any) => acc + (cur.total || 0), 0)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[8px] font-black uppercase text-primary flex items-center gap-1">
                          <Info className="h-3 w-3" /> Site Intelligence
                        </p>
                        <div className="text-[10px] leading-relaxed italic text-muted-foreground border-l-2 border-primary/20 pl-2">
                          {profile.aiAnalysis || "Strategic analysis awaiting baseline synchronization."}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-primary/5">
                         <div className="flex gap-1">
                            {profile.services?.condoms ? <CheckCircle2 className="h-3 w-3 text-primary" /> : <AlertTriangle className="h-3 w-3 text-accent" />}
                            <span className="text-[8px] font-bold uppercase">Condoms</span>
                         </div>
                         <div className="flex gap-1">
                            {profile.services?.lube ? <CheckCircle2 className="h-3 w-3 text-primary" /> : <AlertTriangle className="h-3 w-3 text-accent" />}
                            <span className="text-[8px] font-bold uppercase">Lube</span>
                         </div>
                         <div className="flex gap-1">
                            {profile.services?.kpFriendly ? <CheckCircle2 className="h-3 w-3 text-primary" /> : <AlertTriangle className="h-3 w-3 text-accent" />}
                            <span className="text-[8px] font-bold uppercase">Friendly</span>
                         </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cyber-border bg-background/40">
           <CardHeader>
              <CardTitle className="text-lg italic font-black">Structural Risk Analytics</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                 <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 text-center">
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Police Risk</p>
                    <p className="text-sm font-bold text-primary">MODERATE</p>
                 </div>
                 <div className="bg-accent/5 p-4 rounded-lg border border-accent/10 text-center">
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Violence Risk</p>
                    <p className="text-sm font-bold text-accent">ELEVATED</p>
                 </div>
                 <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 text-center">
                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-1">Stigma Risk</p>
                    <p className="text-sm font-bold text-primary">LOW</p>
                 </div>
              </div>
           </CardContent>
        </Card>

        <Card className="cyber-border bg-background/40">
           <CardHeader>
              <CardTitle className="text-lg italic font-black">Operational Status</CardTitle>
           </CardHeader>
           <CardContent className="flex items-center justify-between p-8">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-muted-foreground">Sync Health</p>
                 <p className="text-xl font-black text-primary">OPTIMAL</p>
              </div>
              <div className="h-12 w-px bg-primary/20" />
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-muted-foreground text-right">Ward Coverage</p>
                 <p className="text-xl font-black text-primary text-right">92%</p>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
