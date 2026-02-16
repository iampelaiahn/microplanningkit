
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Info, Plus, Share2, Target, Zap } from 'lucide-react'
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary glow-cyan">Social Network Map</h1>
          <p className="text-muted-foreground">Influence mapping and strategic reach nodes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Influence Node
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden h-[600px] relative border-primary/20 bg-card/40 backdrop-blur-sm">
           <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/mbaremapfull/1200/800')] bg-cover opacity-30 grayscale" />
           <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
           
           {/* Mocking Map Nodes */}
           <div className="absolute top-[20%] left-[30%] group">
              <div className="w-12 h-12 bg-primary rounded-lg shadow-xl flex items-center justify-center glow-cyan hover:scale-110 transition-transform cursor-pointer border-2 border-white/20">
                <Info className="text-white h-6 w-6" />
              </div>
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur border border-primary/20 p-2 rounded-lg shadow-lg hidden group-hover:block w-48 text-xs">
                <p className="font-bold text-primary">Stodart Clinic</p>
                <p className="text-muted-foreground">Status: Strong Influence</p>
                <p className="mt-1 italic">"Anchor referral site"</p>
              </div>
           </div>

           <div className="absolute top-[50%] left-[60%] group">
              <div className="w-12 h-12 bg-accent rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border-2 border-white/20">
                <Users className="text-white h-6 w-6" />
              </div>
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur border border-accent/20 p-2 rounded-lg shadow-lg hidden group-hover:block w-48 text-xs">
                <p className="font-bold text-accent">Mbare Musika</p>
                <p className="text-muted-foreground">Status: Moderate Reach</p>
                <p className="mt-1 italic">"Key community hub"</p>
              </div>
           </div>

           <div className="absolute top-[35%] left-[45%] group">
              <div className="w-10 h-10 bg-orange-500 rounded-full shadow-xl flex items-center justify-center animate-pulse hover:scale-110 transition-transform cursor-pointer border-2 border-white/20">
                <Zap className="text-white h-5 w-5" />
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur border border-orange-500/20 p-2 rounded-lg shadow-lg hidden group-hover:block w-48 text-xs">
                <p className="font-bold text-orange-500">Clara (Peer Leader)</p>
                <p className="text-muted-foreground">Status: Weak Trust</p>
                <p className="mt-1 font-bold">Goal: Strengthen influence</p>
              </div>
           </div>

           {/* Influence Lines (SVG Overlay) */}
           <svg className="absolute inset-0 pointer-events-none w-full h-full">
              <line x1="30%" y1="20%" x2="60%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="10,5" className="opacity-30" />
              <line x1="45%" y1="35%" x2="30%" y2="20%" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="5,5" className="opacity-30" />
           </svg>

           <div className="absolute bottom-4 left-4 right-4 flex gap-4 overflow-auto pb-2">
              <div className="bg-card/80 backdrop-blur p-2 rounded-lg border border-primary/20 text-[10px] flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 bg-primary rounded" /> Facilities
              </div>
              <div className="bg-card/80 backdrop-blur p-2 rounded-lg border border-accent/20 text-[10px] flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 bg-accent rounded-full" /> Community Hubs
              </div>
              <div className="bg-card/80 backdrop-blur p-2 rounded-lg border border-orange-500/20 text-[10px] flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 bg-orange-500 rounded-full" /> Individual Peer Nodes
              </div>
           </div>
        </Card>

        <Card className="h-fit bg-card/30 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Strategic Network Nodes
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
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{spot.ward} • {spot.contactPerson}</p>
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
               <Share2 className="h-3 w-3" /> Export Social Influence Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
