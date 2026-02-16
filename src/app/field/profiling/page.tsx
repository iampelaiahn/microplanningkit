"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  PlusCircle, 
  Target, 
  Crosshair, 
  Save, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Activity, 
  Users, 
  Clock, 
  MapPin, 
  BrainCircuit, 
  Loader2,
  CheckCircle2,
  XCircle,
  Shield
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { generateHotspotRecommendation, type HotspotRecommendationOutput } from '@/ai/flows/generate-hotspot-recommendation'

const KP_GROUPS = [
  { id: 'fsw', label: 'Female Sex Workers (FSW)', thresholds: { high: 50, med: 30 } },
  { id: 'msw', label: 'Male Sex Workers (MSW)', thresholds: { high: 30, med: 20 } },
  { id: 'tg', label: 'Transgender Persons (TG)', thresholds: { high: 20, med: 10 } },
  { id: 'pwud', label: 'People Who Use Drugs (PWUD)', thresholds: { high: 20, med: 10 } },
  { id: 'pwid', label: 'People Who Inject Drugs (PWID)', thresholds: { high: 15, med: 10 } },
  { id: 'hrm', label: 'High Risk Men (HRM)', thresholds: { high: 40, med: 20 } },
];

const TYPOLOGIES = ["Shebeen", "Home-based", "Brothel", "Hotel", "Parlour", "Social Media", "Street-based", "Truck stop", "Lodge", "Bar"];

// Mock profile for the logged-in Peer Educator
const PE_PROFILE = {
  name: "Anonymous PE",
  assignedWard: "Ward 3",
};

export default function SpotProfilingPage() {
  const [isNew, setIsNew] = useState("New");
  const [coords, setCoords] = useState({ lat: '', lng: '' });
  const [typology, setTypology] = useState<string[]>([]);
  const [otherTypology, setOtherTypology] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("");
  
  // Population State
  const [popData, setPopData] = useState<Record<string, { a1: number, a2: number, a3: number, total: number }>>(() => {
    const init: any = {};
    KP_GROUPS.forEach(kp => init[kp.id] = { a1: 0, a2: 0, a3: 0, total: 0 });
    return init;
  });

  // Services State
  const [services, setServices] = useState({
    condoms: true,
    lube: true,
    clinicDistance: 2,
    kpFriendly: true
  });

  // Structural State
  const [structural, setStructural] = useState({
    police: "No",
    violence: "Low",
    stigma: "Low"
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<HotspotRecommendationOutput | null>(null);

  // Auto-calculations & Flags
  const totalsByKP = useMemo(() => {
    const results: any = {};
    Object.entries(popData).forEach(([id, data]) => {
      const sum = Number(data.a1) + Number(data.a2) + Number(data.a3);
      const kp = KP_GROUPS.find(k => k.id === id)!;
      let volume = 'Low';
      if (sum > kp.thresholds.high) volume = 'High';
      else if (sum >= kp.thresholds.med) volume = 'Medium';
      
      results[id] = { total: sum, volume };
    });
    return results;
  }, [popData]);

  const riskFlags = useMemo(() => {
    const flags = [];
    if (!services.condoms) flags.push("CRITICAL GAP: Condoms Inaccessible");
    if (!services.lube) flags.push("PROGRAM GAP: Lubricants Inaccessible");
    if (services.clinicDistance > 5) flags.push("ACCESS RISK: Distance > 5km");
    if (!services.kpFriendly) flags.push("SERVICE QUALITY RISK: Not KP Friendly");
    
    if (structural.police === "Yes" || structural.violence === "High" || structural.stigma === "High") {
      flags.push("HIGH STRUCTURAL RISK: High Violence/Stigma/Harassment");
    }
    return flags;
  }, [services, structural]);

  const handlePopChange = (kpId: string, ageKey: string, val: string) => {
    const num = parseInt(val) || 0;
    setPopData(prev => ({
      ...prev,
      [kpId]: { ...prev[kpId], [ageKey]: num }
    }));
  };

  const handleCaptureGPS = () => {
    const mockLat = (-17.85 + (Math.random() * 0.05)).toFixed(6);
    const mockLng = (31.04 + (Math.random() * 0.05)).toFixed(6);
    setCoords({ lat: mockLat, lng: mockLng });
    toast({ title: "GPS Captured", description: `Coordinates synced: ${mockLat}, ${mockLng}` });
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const result = await generateHotspotRecommendation({
        hotspotName: (document.getElementById('hotspotName') as HTMLInputElement)?.value || 'Unnamed Site',
        typology,
        totalEstimatedPopulation: Object.values(totalsByKP).reduce((acc: number, cur: any) => acc + cur.total, 0),
        riskFlags,
        barriers: (document.getElementById('barriers') as HTMLTextAreaElement)?.value || 'None noted',
        serviceGaps: riskFlags.filter(f => f.includes('GAP'))
      });
      setAiResult(result);
    } catch (e) {
      toast({ title: "AI Generation Failed", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">
            Spot Profiling Hub
          </h1>
          <p className="text-muted-foreground text-lg italic">Microplanning & High-Fidelity Hotspot Intelligence</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleGenerateAI} variant="outline" className="border-primary/40 text-primary gap-2 h-12">
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
            AI Recommendation
          </Button>
          <Button className="bg-primary text-background font-black uppercase tracking-widest gap-2 h-12 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            <Save className="h-5 w-5" /> Commit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Identification */}
          <Card className="cyber-border bg-background/40">
            <CardHeader className="border-b border-primary/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black italic flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" /> 1. Identification Matrix
                </CardTitle>
                <div className="flex items-center gap-6">
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary flex items-center gap-2 py-1.5 px-3">
                    <Shield className="h-3 w-3" />
                    Assigned: {PE_PROFILE.assignedWard}
                  </Badge>
                  <RadioGroup value={isNew} onValueChange={setIsNew} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="New" id="new" />
                      <Label htmlFor="new" className="text-xs font-bold uppercase">New Site</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Existing" id="old" />
                      <Label htmlFor="old" className="text-xs font-bold uppercase">Existing</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Assigned Ward (Automatic)</Label>
                <Input value={PE_PROFILE.assignedWard} readOnly className="bg-primary/5 border-primary/20 text-primary font-black uppercase italic" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Site Name *</Label>
                <Input id="siteName" placeholder="Ward HQ / Primary Site" className="bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Hotspot Name *</Label>
                <Input id="hotspotName" placeholder="e.g. Mbare Musika" className="bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Hotspot Area / Cluster *</Label>
                <Input placeholder="Block 3 / Central" className="bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Date of Profiling *</Label>
                <Input type="date" className="bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Microplanner / Outreach Worker *</Label>
                <Input placeholder="Enter Names" className="bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">GPS Location</Label>
                <div className="flex gap-2">
                  <Input value={coords.lat ? `${coords.lat}, ${coords.lng}` : 'Not Captured'} readOnly className="bg-muted/20 italic text-xs" />
                  <Button onClick={handleCaptureGPS} size="icon" variant="outline" className="border-primary/20"><Crosshair className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Typology */}
          <Card className="cyber-border bg-background/40">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-xl font-black italic flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> 2. Typology Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TYPOLOGIES.map(t => (
                  <div key={t} className="flex items-center space-x-2">
                    <Checkbox 
                      id={t} 
                      checked={typology.includes(t)} 
                      onCheckedChange={(checked) => {
                        setTypology(prev => checked ? [...prev, t] : prev.filter(x => x !== t))
                      }}
                    />
                    <label htmlFor={t} className="text-xs font-bold leading-none">{t}</label>
                  </div>
                ))}
              </div>
              {typology.includes("Social Media") && (
                <div className="animate-in slide-in-from-left-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary">Platform Name (Required)</Label>
                  <Input value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} placeholder="e.g. WhatsApp, Facebook" className="bg-primary/5 border-primary/20" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Population & Volume (The Core Logic) */}
          <Card className="cyber-border bg-background/40">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-xl font-black italic flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> 3. Population Volume & Disaggregation
              </CardTitle>
              <CardDescription className="text-xs uppercase font-bold tracking-tighter text-muted-foreground">Age segments must sum to total estimate per group</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {KP_GROUPS.map((kp) => {
                const { total, volume } = totalsByKP[kp.id];
                return (
                  <div key={kp.id} className="p-4 bg-muted/5 border border-primary/5 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm uppercase tracking-tight">{kp.label}</h4>
                      <Badge variant="outline" className={cn(
                        "font-black uppercase text-[10px]",
                        volume === 'High' ? 'bg-accent/10 border-accent text-accent' : 
                        volume === 'Medium' ? 'bg-primary/10 border-primary text-primary' : 
                        'text-muted-foreground'
                      )}>
                        Volume: {volume}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase opacity-50">18-24</Label>
                        <Input type="number" onChange={(e) => handlePopChange(kp.id, 'a1', e.target.value)} className="h-8 bg-background/50" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase opacity-50">25-35</Label>
                        <Input type="number" onChange={(e) => handlePopChange(kp.id, 'a2', e.target.value)} className="h-8 bg-background/50" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-bold uppercase opacity-50">36+</Label>
                        <Input type="number" onChange={(e) => handlePopChange(kp.id, 'a3', e.target.value)} className="h-8 bg-background/50" />
                      </div>
                      <div className="space-y-1 bg-primary/5 p-1 rounded">
                        <Label className="text-[9px] font-black uppercase text-primary">Total Est.</Label>
                        <div className="h-8 flex items-center px-2 font-black text-primary">{total}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Intelligence & Analysis */}
        <div className="space-y-8">
          {/* Section 4: Risk Flags & Dashboard */}
          <Card className="cyber-border border-accent/20 bg-accent/5">
            <CardHeader className="border-b border-accent/10">
              <CardTitle className="text-lg font-black italic text-accent flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" /> Intelligence Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Risk Flags</p>
                {riskFlags.length > 0 ? (
                  riskFlags.map((flag, i) => (
                    <div key={i} className="flex gap-2 p-3 bg-background/60 rounded border border-accent/20 text-[10px] font-bold uppercase leading-tight animate-in slide-in-from-right-2">
                      <AlertTriangle className="h-4 w-4 text-accent shrink-0" />
                      {flag}
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold uppercase text-primary flex gap-2">
                    <CheckCircle2 className="h-4 w-4" /> No Active Critical Gaps
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-accent/10 space-y-4">
                 <p className="text-[10px] font-black uppercase text-muted-foreground">Service Access Logic</p>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <Label className="text-xs font-bold">Condom Access</Label>
                       <Checkbox checked={services.condoms} onCheckedChange={(c) => setServices(prev => ({ ...prev, condoms: !!c }))} />
                    </div>
                    <div className="flex items-center justify-between">
                       <Label className="text-xs font-bold">Lube Access</Label>
                       <Checkbox checked={services.lube} onCheckedChange={(c) => setServices(prev => ({ ...prev, lube: !!c }))} />
                    </div>
                    <div className="flex items-center justify-between">
                       <Label className="text-xs font-bold">KP Friendly Site</Label>
                       <Checkbox checked={services.kpFriendly} onCheckedChange={(c) => setServices(prev => ({ ...prev, kpFriendly: !!c }))} />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span>Dist. to Clinic (km)</span>
                          <span className={services.clinicDistance > 5 ? 'text-accent' : 'text-primary'}>{services.clinicDistance}km</span>
                       </div>
                       <input 
                         type="range" min="0" max="15" step="1" 
                         value={services.clinicDistance} 
                         onChange={(e) => setServices(prev => ({ ...prev, clinicDistance: parseInt(e.target.value) }))}
                         className="w-full accent-primary"
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-accent/10 space-y-4">
                 <p className="text-[10px] font-black uppercase text-muted-foreground">Structural Risk Logic</p>
                 <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase opacity-60">Police Harassment</Label>
                      <Select value={structural.police} onValueChange={(v) => setStructural(prev => ({ ...prev, police: v }))}>
                        <SelectTrigger className="h-8 bg-background/50 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="No">No</SelectItem><SelectItem value="Yes">Yes</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase opacity-60">Violence Level</Label>
                      <Select value={structural.violence} onValueChange={(v) => setStructural(prev => ({ ...prev, violence: v }))}>
                        <SelectTrigger className="h-8 bg-background/50 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase opacity-60">Stigma Level</Label>
                      <Select value={structural.stigma} onValueChange={(v) => setStructural(prev => ({ ...prev, stigma: v }))}>
                        <SelectTrigger className="h-8 bg-background/50 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                      </Select>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation Panel */}
          <Card className="cyber-border border-primary/20 bg-primary/5">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-lg font-black italic text-primary flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" /> AI Microplanning
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!aiResult ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-40">
                  <Info className="h-12 w-12" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting profile data...</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary">Programmatic Analysis</Label>
                    <p className="text-xs leading-relaxed italic border-l-2 border-primary/40 pl-3">{aiResult.analysis}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary">Strategic Recommendations</Label>
                    <ul className="space-y-2">
                      {aiResult.recommendations.map((rec, i) => (
                        <li key={i} className="text-[10px] font-bold flex gap-2">
                          <span className="text-primary">•</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-primary/10">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Priority Protocol</span>
                    <Badge className={cn(
                      "font-black text-[10px] uppercase",
                      aiResult.priorityLevel === 'Critical' ? 'bg-accent' : 'bg-primary'
                    )}>
                      {aiResult.priorityLevel}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
