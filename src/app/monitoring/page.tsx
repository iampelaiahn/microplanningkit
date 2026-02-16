
"use client"

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Users, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Radar, 
  Map as MapIcon,
  Search
} from 'lucide-react'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'

export default function FieldMonitoringPage() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'mbare-map');

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

  const activePeers = [
    { id: 'p1', name: 'Sarah', ward: 'Ward 3', lat: -17.854, lng: 31.037, activity: 'Profiling', status: 'Active' },
    { id: 'p2', name: 'John', ward: 'Ward 4', lat: -17.859, lng: 31.042, activity: 'Assessing', status: 'Active' },
    { id: 'p3', name: 'Mercy', ward: 'Ward 11', lat: -17.865, lng: 31.050, activity: 'Outreach', status: 'Active' },
    { id: 'p4', name: 'Tatenda', ward: 'Ward 12', lat: -17.862, lng: 31.048, activity: 'Syncing', status: 'Active' },
  ];

  const recentActivities = [
    { id: 1, peer: 'Sarah (Ward 3)', activity: 'Hotspot Profile', target: 'Mbare Musika', time: '10 mins ago', status: 'Pending Review' },
    { id: 2, peer: 'John (Ward 4)', activity: 'Risk Assessment', target: 'V-A-80063', time: '25 mins ago', status: 'Verified' },
    { id: 3, peer: 'Mercy (Ward 11)', activity: 'Diary Entry', target: 'UIN-9921', time: '1 hour ago', status: 'Verified' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary uppercase italic tracking-tighter glow-cyan">
            Field Activity Monitor
          </h1>
          <p className="text-muted-foreground">Supervise, analyze, and support field operations across all wards.</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/40 h-10 px-4 flex gap-2 animate-pulse">
          <Radar className="h-4 w-4" /> Live Tracking Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cyber-border bg-background/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" /> Active Peers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{activePeers.length}</div>
            <p className="text-xs text-muted-foreground">Currently syncing data</p>
          </CardContent>
        </Card>
        <Card className="cyber-border bg-background/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" /> Reach Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-accent">+14.2%</div>
            <p className="text-xs text-muted-foreground">Increase in ward coverage</p>
          </CardContent>
        </Card>
        <Card className="cyber-border bg-background/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Pending Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">8</div>
            <p className="text-xs text-muted-foreground">Profiles awaiting supervisor sign-off</p>
          </CardContent>
        </Card>
      </div>

      <Card className="cyber-border border-primary/10 overflow-hidden">
        <CardHeader className="border-b border-primary/10 bg-background/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black italic flex items-center gap-2 uppercase tracking-tight text-primary">
                <MapIcon className="h-5 w-5" /> Real-time Field Operations Map
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase">Geographic tracking of Peer Educators and Service Nodes</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary/60">
              <Compass className="h-3 w-3" /> Grid: Mbare-Surveillance-v1
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative h-[450px]">
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale opacity-80 mix-blend-overlay"
            style={{ backgroundImage: `url(${mapImage?.imageUrl})` }}
            data-ai-hint="city map"
          />
          <div className="absolute inset-0 bg-background/40 pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          
          {activePeers.map((peer) => {
            const { x, y } = projectCoord(peer.lat, peer.lng);
            return (
              <div 
                key={peer.id}
                className="absolute z-30 group"
                style={{ top: `${y}%`, left: `${x}%`, transform: 'translate(-50%, -100%)' }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                    <Card className="p-2 border-primary/30 bg-background/95 backdrop-blur shadow-xl">
                      <p className="text-[10px] font-black uppercase text-primary leading-none mb-1">{peer.name}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">{peer.ward} • {peer.activity}</p>
                    </Card>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                    <div className="relative bg-background border-2 border-primary p-1.5 rounded-full shadow-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="cyber-border bg-background/40">
        <CardHeader>
          <CardTitle className="text-xl font-bold italic">Real-time Activity Ledger</CardTitle>
          <CardDescription>Monitor incoming data streams from the field kit</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6 text-[10px] font-black uppercase">Peer Educator</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Activity Type</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Target ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Timestamp</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-black uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-primary/5 border-primary/5">
                  <TableCell className="pl-6 font-bold">{activity.peer}</TableCell>
                  <TableCell className="text-xs">{activity.activity}</TableCell>
                  <TableCell className="text-xs font-mono">{activity.target}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{activity.time}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Badge variant="outline" className={activity.status === 'Verified' ? "text-primary border-primary/20" : "text-accent border-accent/20"}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
