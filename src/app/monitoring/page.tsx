
"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Activity, Users, Clock, CheckCircle2 } from 'lucide-react'
import { Navigation } from '@/components/Navigation'

export default function FieldMonitoringPage() {
  const recentActivities = [
    { id: 1, peer: 'Sarah (Ward 3)', activity: 'Hotspot Profile', target: 'Mbare Musika', time: '10 mins ago', status: 'Pending Review' },
    { id: 2, peer: 'John (Ward 4)', activity: 'Risk Assessment', target: 'V-A-80063', time: '25 mins ago', status: 'Verified' },
    { id: 3, peer: 'Mercy (Ward 11)', activity: 'Diary Entry', target: 'UIN-9921', time: '1 hour ago', status: 'Verified' },
  ];

  return (
    <>
      <Navigation />
      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto space-y-8 max-w-7xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary uppercase italic tracking-tighter glow-cyan">
            Field Activity Monitor
          </h1>
          <p className="text-muted-foreground">Supervise, analyze, and support field operations across all wards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cyber-border bg-background/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" /> Active Peers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary">12</div>
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
      </main>
    </>
  )
}
