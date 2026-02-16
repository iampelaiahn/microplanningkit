
"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CalendarDays, 
  BrainCircuit, 
  Loader2, 
  Plus, 
  Sparkles,
  ShieldAlert,
  Target,
  Package,
  ArrowRight
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { RiskLevel } from '@/lib/types'
import { generateOutreachRecommendation } from '@/ai/flows/generate-outreach-recommendation'

const TOPICS = ["HIV Testing", "Prep/Pep", "Mental Health", "GBV Support", "Stigma Reduction", "Clinical Referrals"];

export default function OutreachTrackingPage() {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  
  // Form State
  const [visitDate, setVisitDate] = useState("");
  const [uin, setUin] = useState("");
  const [risk, setRisk] = useState<RiskLevel>("Unknown");
  const [commodities, setCommodities] = useState({ mc: 0, fc: 0, lube: 0 });
  const [topics, setTopics] = useState<string[]>([]);
  const [registered, setRegistered] = useState(false);

  const isHighRiskAlert = useMemo(() => risk === 'High' && (commodities.mc + commodities.fc + commodities.lube === 0), [risk, commodities]);

  const handleSubmit = async () => {
    if (!uin || !visitDate || risk === 'Unknown') {
      toast({ title: "Incomplete Data", description: "Unique ID, Visit Date, and Risk Level are mandatory.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await generateOutreachRecommendation({
        visitDate,
        riskLevel: risk,
        uin,
        commoditiesDistributed: commodities.mc + commodities.fc + commodities.lube,
        isRegisteredAtClinic: registered
      });
      setAiResult(result);
      toast({ title: "Visit Logged", description: `Outreach for node ${uin} committed to intelligence engine.` });
    } catch (e) {
      toast({ title: "System Error", description: "AI recommendation engine unreachable.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">Outreach Tracking Engine</h1>
          <p className="text-muted-foreground text-lg italic">Weekly Performance & Caseload Engagement Matrix</p>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="bg-primary text-background font-black uppercase tracking-widest h-14 w-full md:w-auto px-10 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Target className="h-5 w-5 mr-2" />} Commit & Analyze Visit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="cyber-border bg-background/40">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-xl font-black italic flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Outreach Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Unique ID (UIN) *</Label>
                <Input value={uin} onChange={(e) => setUin(e.target.value)} placeholder="e.g. V-A-80063" className="bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Visit Date *</Label>
                <Input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Baseline Risk Level *</Label>
                <Select value={risk} onValueChange={(v: RiskLevel) => setRisk(v)}>
                  <SelectTrigger className="bg-muted/20"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High (Weekly Tracking)</SelectItem>
                    <SelectItem value="Medium">Medium (Bi-Monthly)</SelectItem>
                    <SelectItem value="Low">Low (Monthly)</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-3 pt-6">
                <Checkbox id="reg" checked={registered} onCheckedChange={(c) => setRegistered(!!c)} />
                <Label htmlFor="reg" className="text-xs font-bold uppercase cursor-pointer">Peer Registered at Clinic</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-background/40">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-xl font-black italic flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Commodity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 pt-6">
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase opacity-60">Male Condoms</Label>
                <Input type="number" min="0" value={commodities.mc} onChange={(e) => setCommodities({...commodities, mc: parseInt(e.target.value) || 0})} className="h-10 bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase opacity-60">Female Condoms</Label>
                <Input type="number" min="0" value={commodities.fc} onChange={(e) => setCommodities({...commodities, fc: parseInt(e.target.value) || 0})} className="h-10 bg-muted/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-bold uppercase opacity-60">Lubricants</Label>
                <Input type="number" min="0" value={commodities.lube} onChange={(e) => setCommodities({...commodities, lube: parseInt(e.target.value) || 0})} className="h-10 bg-muted/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-background/40">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-xl font-black italic flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> Topics Recommended
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TOPICS.map(t => (
                  <div key={t} className="flex items-center space-x-2">
                    <Checkbox 
                      id={t} 
                      checked={topics.includes(t)} 
                      onCheckedChange={(c) => setTopics(prev => c ? [...prev, t] : prev.filter(x => x !== t))}
                    />
                    <label htmlFor={t} className="text-[10px] font-bold uppercase leading-none">{t}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="cyber-border border-accent/20 bg-accent/5">
            <CardHeader className="border-b border-accent/10">
              <CardTitle className="text-lg font-black italic text-accent flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" /> Automated Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {risk === 'High' && (
                <div className="p-3 bg-accent/20 border border-accent/30 rounded text-[9px] font-bold uppercase flex gap-2">
                  <ArrowRight className="h-3 w-3 text-accent shrink-0" /> High-Risk Node: Weekly tracking required
                </div>
              )}
              {!registered && (
                <div className="p-3 bg-accent/20 border border-accent/30 rounded text-[9px] font-bold uppercase flex gap-2">
                  <ArrowRight className="h-3 w-3 text-accent shrink-0" /> Alert: Peer not registered at clinic
                </div>
              )}
              {isHighRiskAlert && (
                <div className="p-3 bg-destructive/20 border border-destructive/30 rounded text-[9px] font-bold uppercase text-destructive flex gap-2">
                  <ShieldAlert className="h-3 w-3 shrink-0" /> CRITICAL: No commodities distributed to high-risk node
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="cyber-border border-primary/20 bg-primary/5">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-lg font-black italic text-primary flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" /> AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!aiResult ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-40">
                  <Sparkles className="h-10 w-10 text-muted-foreground animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting submission...</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary">Performance Summary</Label>
                    <p className="text-xs leading-relaxed italic border-l-2 border-primary/40 pl-3">{aiResult.summary}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary">Microplanning Actions</Label>
                    <ul className="space-y-2">
                      {aiResult.actions.map((act: string, i: number) => (
                        <li key={i} className="text-[10px] font-bold flex gap-2"><span className="text-primary">•</span> {act}</li>
                      ))}
                    </ul>
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
