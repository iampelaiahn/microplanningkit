
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
  Sparkles,
  ShieldAlert,
  Target,
  Package,
  ArrowRight,
  Stethoscope,
  Activity,
  Database
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { RiskLevel } from '@/lib/types'
import { generateOutreachRecommendation } from '@/ai/flows/generate-outreach-recommendation'
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase'
import { collection, addDoc } from 'firebase/firestore'

const TOPICS = [
  "HIV Testing", 
  "Prep/Pep", 
  "Mental Health", 
  "GBV Support", 
  "Stigma Reduction", 
  "Clinical Referrals",
  "Lubricant Distribution",
  "Pregnancy Testing"
];

export default function OutreachTrackingPage() {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const firestore = useFirestore();
  const { user } = useUser();
  
  // Form State
  const [visitDate, setVisitDate] = useState("");
  const [uin, setUin] = useState("");
  const [risk, setRisk] = useState<RiskLevel>("Unknown");
  const [registered, setRegistered] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  
  // Services & Commodities State
  const [services, setServices] = useState({
    mc: 0,
    fc: 0,
    lube: 0,
    hivst: 0,
    hivstResult: "Pending",
    pregTest: 0,
    pregResult: "Pending",
    padsReusable: 0,
    padsDisposable: 0
  });

  const totalCommodities = useMemo(() => 
    services.mc + services.fc + services.lube + services.hivst + services.pregTest + services.padsReusable + services.padsDisposable,
  [services]);

  const isHighRiskAlert = useMemo(() => risk === 'High' && (services.mc + services.fc + services.lube === 0), [risk, services]);

  const handleSubmit = async () => {
    if (!uin || !visitDate || risk === 'Unknown') {
      toast({ title: "Incomplete Data", description: "Unique ID, Visit Date, and Risk Level are mandatory.", variant: "destructive" });
      return;
    }

    if (!user) {
      toast({ title: "Auth Required", description: "You must be signed in to log visits.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Generate AI Analysis
      const result = await generateOutreachRecommendation({
        visitDate,
        riskLevel: risk,
        uin,
        commoditiesDistributed: totalCommodities,
        isRegisteredAtClinic: registered
      });
      setAiResult(result);

      // 2. Save to Firestore
      if (firestore) {
        const visitData = {
          peerEducatorId: user.uid,
          peerEducatorName: user.displayName || "Anonymous Peer",
          uin,
          visitDate,
          riskLevel: risk,
          isRegisteredAtClinic: registered,
          commodities: services,
          topicsDiscussed: topics,
          aiSummary: result.summary,
          aiActions: result.actions,
          timestamp: new Date().toISOString()
        };

        addDoc(collection(firestore, 'outreachVisits'), visitData)
          .catch(async (e) => {
            const permissionError = new FirestorePermissionError({
              path: 'outreachVisits',
              operation: 'create',
              requestResourceData: visitData
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      }

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
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Database className="h-5 w-5 mr-2" />} Commit & Save Visit
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
                <Package className="h-5 w-5 text-primary" /> Services & Commodities
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-muted-foreground">Log all distributed items and clinical test results</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase opacity-60">Male Condoms</Label>
                  <Input type="number" min="0" value={services.mc} onChange={(e) => setServices({...services, mc: parseInt(e.target.value) || 0})} className="h-10 bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase opacity-60">Female Condoms</Label>
                  <Input type="number" min="0" value={services.fc} onChange={(e) => setServices({...services, fc: parseInt(e.target.value) || 0})} className="h-10 bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase opacity-60">Lubricants</Label>
                  <Input type="number" min="0" value={services.lube} onChange={(e) => setServices({...services, lube: parseInt(e.target.value) || 0})} className="h-10 bg-muted/20" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Stethoscope className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">HIVST Service</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-24 space-y-1">
                      <Label className="text-[8px] font-bold uppercase">Units</Label>
                      <Input type="number" min="0" value={services.hivst} onChange={(e) => setServices({...services, hivst: parseInt(e.target.value) || 0})} className="h-8 bg-background" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-[8px] font-bold uppercase">Result</Label>
                      <Select value={services.hivstResult} onValueChange={(v) => setServices({...services, hivstResult: v})}>
                        <SelectTrigger className="h-8 bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Non-Reactive">Non-Reactive</SelectItem>
                          <SelectItem value="Reactive">Reactive (Urgent Linkage)</SelectItem>
                          <SelectItem value="Inconclusive">Inconclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-accent">
                    <Activity className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Pregnancy Test Service</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-24 space-y-1">
                      <Label className="text-[8px] font-bold uppercase">Units</Label>
                      <Input type="number" min="0" value={services.pregTest} onChange={(e) => setServices({...services, pregTest: parseInt(e.target.value) || 0})} className="h-8 bg-background" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-[8px] font-bold uppercase">Result</Label>
                      <Select value={services.pregResult} onValueChange={(v) => setServices({...services, pregResult: v})}>
                        <SelectTrigger className="h-8 bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Negative">Negative</SelectItem>
                          <SelectItem value="Positive">Positive (ANC Linkage)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase opacity-60">Pads (Reusable)</Label>
                  <Input type="number" min="0" value={services.padsReusable} onChange={(e) => setServices({...services, padsReusable: parseInt(e.target.value) || 0})} className="h-10 bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase opacity-60">Pads (Disposable)</Label>
                  <Input type="number" min="0" value={services.padsDisposable} onChange={(e) => setServices({...services, padsDisposable: parseInt(e.target.value) || 0})} className="h-10 bg-muted/20" />
                </div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              {services.hivstResult === 'Reactive' && (
                <div className="p-3 bg-destructive/20 border border-destructive/30 rounded text-[9px] font-black uppercase text-destructive flex gap-2">
                  <ShieldAlert className="h-3 w-3 shrink-0" /> URGENT: Reactive HIVST result. Initiate referral.
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
