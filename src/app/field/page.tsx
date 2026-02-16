
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Shield, Plus, MapPin, Search, Activity, Heart, Clock } from 'lucide-react'
import { INITIAL_KPS } from '@/lib/store'
import { generateUIN } from '@/components/UINGenerator'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function FieldDashboard() {
  const [kps, setKps] = useState(INITIAL_KPS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKps = kps.filter(kp => kp.uin.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleNewRegistration = () => {
    const newUin = generateUIN('Female', 'Mbare');
    const newKp = {
      id: Math.random().toString(),
      uin: newUin,
      riskLevel: 'Medium' as const,
      ward: 'Ward 3',
      lastAssessment: new Date().toISOString().split('T')[0],
      verificationStatus: 'Pending' as const,
      meetingCount: 1
    };
    setKps([newKp, ...kps]);
    toast({
      title: "New KP Registered",
      description: `UIN ${newUin} generated automatically.`,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-accent">Field Dashboard</h1>
          <p className="text-muted-foreground">Real-time Service Tracking & Registry</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2" onClick={handleNewRegistration}>
          <Plus className="h-4 w-4" />
          Register New KP
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Active Reach
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-black">124</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4 text-accent" />
              Service Units
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-black">450</p>
            <p className="text-xs text-muted-foreground">Distributions</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Assessments Due
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-black">12</p>
            <p className="text-xs text-muted-foreground">KPs needing follow-up</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>KP Registry</CardTitle>
            <div className="relative w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search UIN..." 
                className="pl-8 h-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredKps.map((kp) => (
              <div key={kp.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold text-white",
                    kp.riskLevel === 'Low' ? "bg-primary" : kp.riskLevel === 'Medium' ? "bg-accent" : "bg-orange-500 glow-orange-flicker"
                  )}>
                    {kp.uin.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{kp.uin}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {kp.ward}
                      <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Last seen: {kp.lastAssessment}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium text-muted-foreground">Verification</p>
                      <Badge variant={kp.verificationStatus === 'Verified' ? 'default' : 'outline'} className={kp.verificationStatus === 'Verified' ? 'bg-green-500 text-white' : ''}>
                        {kp.verificationStatus}
                      </Badge>
                   </div>
                   <Button variant="outline" size="sm" asChild>
                     <Link href="/assessment">Assess</Link>
                   </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent text-accent-foreground overflow-hidden">
        <CardHeader>
          <CardTitle>Quick Service Entry</CardTitle>
          <CardDescription className="text-accent-foreground/80">Log distribution without paperwork</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase">UIN</label>
                <Select>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Select KP" />
                  </SelectTrigger>
                  <SelectContent>
                    {kps.map(kp => <SelectItem key={kp.id} value={kp.uin}>{kp.uin}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase">Service Topic</label>
                <Select>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="art">Topic 10: ART Adherence</SelectItem>
                    <SelectItem value="hivst">HIVST Kit</SelectItem>
                    <SelectItem value="prep">PrEP Initiation</SelectItem>
                    <SelectItem value="condom">Condom Bundle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
           </div>
           <Button className="w-full bg-white text-accent hover:bg-white/90 font-bold">Submit Distribution</Button>
        </CardContent>
      </Card>
    </div>
  )
}
