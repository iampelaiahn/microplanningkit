
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Info, Plus, Share2, Target, Zap, Link2, GitBranchPlus } from 'lucide-react'
import { INITIAL_HOTSPOTS } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function HotspotsPage() {
  const [hotspots] = useState(INITIAL_HOTSPOTS);

  const getStrengthColor = (strength?: string) => {
    switch (strength) {
      case 'Strong': return 'bg-primary/20 text-primary border-primary/40';
      case 'Moderate': return 'bg-accent/20 text-accent border-accent/40';
      case 'Weak': return 'bg-orange-500/20 text-orange-500 border-orange-500/40';
      case 'Critical': return 'bg-destructive/20 text-destructive border-destructive/40';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary glow-cyan">Social Network Relationship Map</h1>
          <p className="text-muted-foreground">Mapping trust, influence, and peer-to-peer connectivity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/10">
            <GitBranchPlus className="h-4 w-4" />
            New Connection
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Add Influence Node
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden h-[600px] relative border-primary/20 bg-background/50 backdrop-blur-xl group">
           {/* Abstract Network Background */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)]" />
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--primary) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
           
           {/* SNA Relationship Overlay (SVG) */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" opacity="0.3" />
                </marker>
              </defs>
              {/* Lines representing social influence flow */}
              <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="12,6" className="opacity-20 animate-[pulse_3s_infinite]" />
              <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="8,4" className="opacity-20" />
              <line x1="40%" y1="75%" x2="50%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="1" className="opacity-10" />
              <line x1="25%" y1="25%" x2="40%" y2="75%" stroke="hsl(var(--orange-500))" strokeWidth="1" strokeDasharray="4,4" className="opacity-20" />
           </svg>

           {/* Relationship Nodes */}
           <div className="absolute top-[25%] left-[25%] group/node">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl shadow-2xl flex items-center justify-center border-2 border-primary/40 hover:scale-110 transition-all cursor-pointer relative z-10">
                <Info className="text-primary h-8 w-8" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
              </div>
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur border border-primary/20 p-3 rounded-xl shadow-2xl w-56 opacity-0 group-hover/node:opacity-100 transition-opacity z-50 pointer-events-none">
                <p className="font-bold text-primary">Stodart Clinic Hub</p>
                <p className="text-[10px] uppercase font-black text-muted-foreground mt-1">Core Referral Node</p>
                <div className="mt-2 text-[11px] italic text-foreground/80">"High institutional trust but requires peer bridge."</div>
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-primary tracking-tighter whitespace-nowrap">Stodart Hub</span>
           </div>

           <div className="absolute top-[50%] left-[50%] group/node">
              <div className="w-20 h-20 bg-accent/10 rounded-full shadow-2xl flex items-center justify-center border-2 border-accent/40 hover:scale-110 transition-all cursor-pointer relative z-10">
                <Users className="text-accent h-10 w-10" />
              </div>
              <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur border border-accent/20 p-3 rounded-xl shadow-2xl w-56 opacity-0 group-hover/node:opacity-100 transition-opacity z-50 pointer-events-none">
                <p className="font-bold text-accent">Mbare Musika Network</p>
                <p className="text-[10px] uppercase font-black text-muted-foreground mt-1">Strategic Community Node</p>
                <div className="mt-2 text-[11px] text-foreground/80">Connecting 45+ peers. Current trust: Moderate.</div>
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-accent tracking-tighter whitespace-nowrap">Musika Cluster</span>
           </div>

           <div className="absolute top-[25%] left-[75%] group/node">
              <div className="w-14 h-14 bg-orange-500/10 rounded-full shadow-2xl flex items-center justify-center border-2 border-orange-500/40 hover:scale-110 transition-all cursor-pointer relative z-10 animate-pulse">
                <Zap className="text-orange-500 h-6 w-6" />
              </div>
              <div className="absolute top-18 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur border border-orange-500/20 p-3 rounded-xl shadow-2xl w-56 opacity-0 group-hover/node:opacity-100 transition-opacity z-50 pointer-events-none">
                <p className="font-bold text-orange-500">Clara (Peer Leader)</p>
                <p className="text-[10px] uppercase font-black text-muted-foreground mt-1">High Influence Peer Node</p>
                <div className="mt-2 text-[11px] font-bold text-primary">STRATEGIC GOAL: Strengthen Trust</div>
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-orange-500 tracking-tighter whitespace-nowrap">Peer Leader: Clara</span>
           </div>

           <div className="absolute top-[75%] left-[40%] group/node">
              <div className="w-12 h-12 bg-muted rounded-xl shadow-2xl flex items-center justify-center border border-border hover:scale-110 transition-all cursor-pointer relative z-10">
                <Link2 className="text-muted-foreground h-5 w-5" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-muted-foreground tracking-tighter whitespace-nowrap">Secondary Link</span>
           </div>

           {/* Legend Section */}
           <div className="absolute bottom-6 left-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded" />
                <span className="text-[10px] font-bold text-foreground">Facility Bridge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="text-[10px] font-bold text-foreground">Community Cluster</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-[10px] font-bold text-foreground">Key Influencer</span>
              </div>
           </div>

           <div className="absolute top-6 right-6">
              <Badge variant="outline" className="bg-background/80 backdrop-blur border-primary/20 text-primary animate-pulse">
                SNA Live Relationship Flow
              </Badge>
           </div>
        </Card>

        <Card className="h-fit bg-card/30 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Relationship Intelligence
            </CardTitle>
            <CardDescription>Social relationships and engagement goals</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30 max-h-[500px] overflow-auto">
              {hotspots.map((spot) => (
                <div key={spot.id} className="p-4 space-y-3 hover:bg-primary/5 transition-colors group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        spot.type === 'Facility' ? "bg-primary/20" : spot.type === 'Community' ? "bg-accent/20" : "bg-orange-500/20"
                      )}>
                        {spot.type === 'Facility' ? <Info className="h-4 w-4 text-primary" /> : spot.type === 'Peer' ? <Zap className="h-4 w-4 text-orange-500" /> : <Users className="h-4 w-4 text-accent" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{spot.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Contact: {spot.contactPerson}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] font-bold py-0 h-5", getStrengthColor(spot.relationshipStrength))}>
                      {spot.relationshipStrength}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                       <Target className="h-3 w-3 text-primary" />
                       <span className="font-semibold uppercase tracking-tighter">Strategic Goal:</span>
                    </div>
                    <p className="text-xs text-foreground/80 pl-5 border-l border-primary/20 italic">
                      {spot.targetGoal}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                       <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${spot.influenceScore}%` }} />
                       </div>
                       <span className="text-[10px] text-muted-foreground">{spot.influenceScore}% Influence</span>
                    </div>
                    <span className="text-[10px] font-black text-primary">{spot.reachCount} Reach</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t border-border/30 bg-muted/20">
            <Button variant="outline" className="w-full gap-2 text-xs border-primary/20 hover:border-primary">
               <Share2 className="h-3 w-3" /> Export Influence Matrix
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
