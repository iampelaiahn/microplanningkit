"use client"

import React from 'react'
import { SocialNetworkMap } from '@/components/SocialNetworkMap'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Network, Share2, Info } from 'lucide-react'

export default function PeerSocialMapPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 py-8 px-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">
            Social Network Map
          </h1>
          <p className="text-muted-foreground text-lg italic">Visualize peer relationships and trust bridges</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <Network className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[800px]">
        <div className="lg:col-span-1 space-y-6 overflow-y-auto">
          <Card className="cyber-border bg-background/40 border-primary/10">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-sm font-black uppercase flex items-center gap-2 text-primary">
                <Info className="h-4 w-4" /> Map Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <p><span className="text-primary font-bold">1. Drag Nodes:</span> Reposition people to organize trust clusters.</p>
              <p><span className="text-primary font-bold">2. Establish Bridges:</span> Use the bridge tool to connect peers who trust each other.</p>
              <p><span className="text-primary font-bold">3. Identify Leaders:</span> Spot high-influence nodes (accent rings) to prioritize mobilization.</p>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-background/40 border-primary/10">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-sm font-black uppercase flex items-center gap-2 text-primary">
                <Share2 className="h-4 w-4" /> Relationship Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-accent shadow-[0_0_5px_rgba(255,120,0,0.8)]" />
                <span className="text-[10px] font-bold uppercase">Critical Leader</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-primary shadow-[0_0_3px_rgba(0,255,255,0.5)]" />
                <span className="text-[10px] font-bold uppercase">Strong Trust</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-muted-foreground border-dashed border-b" />
                <span className="text-[10px] font-bold uppercase">Weak/New</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-3 cyber-border bg-background/40 border-primary/10 overflow-hidden">
          <CardContent className="p-0 h-full">
            <SocialNetworkMap interactive={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
