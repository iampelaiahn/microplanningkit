
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { PlusCircle, Target, Crosshair, Save } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function SpotProfilingPage() {
  const [coords, setCoords] = useState({ lat: '', lng: '' });

  const handleCaptureGPS = () => {
    // Mocking GPS capture
    const mockLat = (-17.85 + (Math.random() * 0.05)).toFixed(6);
    const mockLng = (31.04 + (Math.random() * 0.05)).toFixed(6);
    setCoords({ lat: mockLat, lng: mockLng });
    toast({
      title: "GPS Captured",
      description: `Coordinates synced: ${mockLat}, ${mockLng}`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Profile Saved",
      description: "Hotspot data has been committed to the local database.",
      className: "bg-primary text-primary-foreground font-bold"
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary glow-cyan">Spot Profiling Tool</h1>
          <p className="text-muted-foreground">Map new hotspots and capture site-specific data.</p>
        </div>
        <Button onClick={handleSave} className="bg-primary text-background hover:bg-primary/90 font-bold gap-2">
          <PlusCircle className="h-4 w-4" />
          Save Profile
        </Button>
      </div>

      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-8">
          <CardTitle className="text-2xl font-bold">Hotspot Details</CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Fill in the information below. Use the GPS button to capture current location.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Top Row: Name and Typology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Hotspot Name</Label>
              <Input 
                placeholder="e.g., The Midnight Bar" 
                className="bg-background/50 border-border/40 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Typology</Label>
              <Select>
                <SelectTrigger className="bg-background/50 border-border/40">
                  <SelectValue placeholder="Select site type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar/Nightclub</SelectItem>
                  <SelectItem value="street">Street Side</SelectItem>
                  <SelectItem value="brothel">Brothel/Lodge</SelectItem>
                  <SelectItem value="hub">Youth Hub/Clinic</SelectItem>
                  <SelectItem value="other">Other Community Space</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* GPS Section */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">GPS Coordinates</Label>
            <div className="flex gap-4">
              <Input 
                placeholder="Latitude" 
                value={coords.lat}
                readOnly
                className="bg-background/50 border-border/40"
              />
              <Input 
                placeholder="Longitude" 
                value={coords.lng}
                readOnly
                className="bg-background/50 border-border/40"
              />
              <Button 
                variant="outline" 
                onClick={handleCaptureGPS}
                className="border-primary/40 hover:bg-primary/10 transition-colors"
                size="icon"
              >
                <Crosshair className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>

          {/* PSE Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest">
              Population Size Estimation (PSE)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold">18-24</Label>
                <Input type="number" placeholder="Count" className="bg-background/50 border-border/40" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold">25-35</Label>
                <Input type="number" placeholder="Count" className="bg-background/50 border-border/40" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold">36+</Label>
                <Input type="number" placeholder="Count" className="bg-background/50 border-border/40" />
              </div>
            </div>
          </div>

          {/* Structural Barriers */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Structural Barriers</Label>
            <Textarea 
              placeholder="e.g., Police harassment, stigma, distance to clinic..." 
              className="min-h-[120px] bg-background/50 border-border/40 resize-none"
            />
          </div>

          {/* Peak Hours */}
          <div className="space-y-2 pb-4">
            <Label className="text-foreground font-semibold">Peak Hours</Label>
            <Input 
              placeholder="e.g., 20:00 - 02:00" 
              className="bg-background/50 border-border/40"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
