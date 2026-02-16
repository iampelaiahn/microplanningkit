
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Info, Plus, Share2 } from 'lucide-react'
import { INITIAL_HOTSPOTS } from '@/lib/store'
import { Badge } from '@/components/ui/badge'

export default function HotspotsPage() {
  const [hotspots] = useState(INITIAL_HOTSPOTS);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Hotspot Strategy</h1>
          <p className="text-muted-foreground">Social network mapping and reach nodes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Node
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden h-[600px] relative">
           <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/mbaremapfull/1200/800')] bg-cover opacity-50 contrast-125" />
           <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
           
           {/* Mocking Map Nodes */}
           <div className="absolute top-[20%] left-[30%] group">
              <div className="w-12 h-12 bg-primary rounded-lg shadow-xl flex items-center justify-center glow-cyan hover:scale-110 transition-transform cursor-pointer border-2 border-white">
                <Info className="text-white h-6 w-6" />
              </div>
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg hidden group-hover:block w-32 text-xs border">
                <p className="font-bold">Stodart Clinic</p>
                <p className="text-muted-foreground">Facility Node</p>
              </div>
           </div>

           <div className="absolute top-[50%] left-[60%] group">
              <div className="w-12 h-12 bg-accent rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border-2 border-white">
                <Users className="text-white h-6 w-6" />
              </div>
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg hidden group-hover:block w-32 text-xs border">
                <p className="font-bold">Mbare Musika</p>
                <p className="text-muted-foreground">Community Hotspot</p>
              </div>
           </div>

           {/* Influence Lines (SVG Overlay) */}
           <svg className="absolute inset-0 pointer-events-none w-full h-full">
              <line x1="30%" y1="20%" x2="60%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="10,5" className="opacity-50" />
           </svg>

           <div className="absolute bottom-4 left-4 right-4 flex gap-4 overflow-auto pb-2">
              <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow text-xs flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 bg-primary rounded" /> Square Nodes: Facilities
              </div>
              <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow text-xs flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 bg-accent rounded-full" /> Circular Nodes: Community Hotspots
              </div>
              <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow text-xs flex items-center gap-2 whitespace-nowrap">
                <div className="w-8 h-0.5 bg-primary border-t border-dashed" /> Influence Mapping (Weak)
              </div>
           </div>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Reach Nodes List</CardTitle>
            <CardDescription>Hotspots parsed from Locator Excel</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[500px] overflow-auto">
              {hotspots.map((spot) => (
                <div key={spot.id} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {spot.type === 'Facility' ? 
                      <div className="p-2 bg-primary/20 rounded-lg"><MapPin className="h-5 w-5 text-primary" /></div> :
                      <div className="p-2 bg-accent/20 rounded-full"><Users className="h-5 w-5 text-accent" /></div>
                    }
                    <div>
                      <h4 className="font-bold text-sm">{spot.name}</h4>
                      <p className="text-xs text-muted-foreground">{spot.ward}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="font-black">{spot.reachCount}</Badge>
                    <p className="text-[10px] text-muted-foreground uppercase">KPs Reached</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full gap-2">
               <Share2 className="h-4 w-4" /> Export Map Strategy
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
