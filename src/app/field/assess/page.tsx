
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Shield, 
  BrainCircuit, 
  Loader2, 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  User
} from 'lucide-react'
import { generateRiskAssessmentSummary } from '@/ai/flows/generate-risk-assessment-summary'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

const RISK_FACTORS = [
  "Inconsistent condom use",
  "High number of sexual partners",
  "Reported alcohol/substance use before sex",
  "Experience of gender-based violence (GBV)",
  "Lack of access to health facilities",
  "Frequent travel away from home ward",
];

export default function PeerAssessPage() {
  const [uin, setUin] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; rationale: string } | null>(null);
  const [assignedLevel, setAssignedLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  const handleAssessment = async () => {
    if (!uin) {
      toast({
        title: "UIN Required",
        description: "Please enter the client's Unique Identifier (UIN).",
        variant: "destructive"
      });
      return;
    }

    if (selectedFactors.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one risk factor.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const output = await generateRiskAssessmentSummary({
        identifiedRiskFactors: selectedFactors,
        assignedRiskLevel: assignedLevel
      });
      setResult(output);
      toast({
        title: "Assessment Generated",
        description: `Rationale ready for client ${uin}.`
      });
    } catch (error) {
      toast({
        title: "AI Analysis Failed",
        description: "Could not generate assessment rationale.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 py-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">
          Risk Assessment Tool
        </h1>
        <p className="text-muted-foreground text-lg">Assess risk factors and generate clinical rationale for field verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="cyber-border bg-background/40">
          <CardHeader>
            <CardTitle className="text-xl italic font-black">Client Parameters</CardTitle>
            <CardDescription>Input identification and observed risks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="uin" className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                <User className="h-3 w-3" /> Unique Identifier (UIN)
              </Label>
              <Input 
                id="uin"
                placeholder="e.g. V-A-80063" 
                value={uin}
                onChange={(e) => setUin(e.target.value)}
                className="bg-muted/30 border-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-muted-foreground">Vulnerability Matrix</Label>
              <div className="space-y-2">
                {RISK_FACTORS.map((factor) => (
                  <div 
                    key={factor} 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/10" 
                    onClick={() => toggleFactor(factor)}
                  >
                    <Checkbox checked={selectedFactors.includes(factor)} onCheckedChange={() => toggleFactor(factor)} />
                    <Label className="text-sm cursor-pointer font-medium">{factor}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-primary/10 space-y-4">
              <Label className="font-bold text-primary">Assigned Risk Level</Label>
              <RadioGroup value={assignedLevel} onValueChange={(v) => setAssignedLevel(v as any)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Low" id="r1" />
                  <Label htmlFor="r1">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="r2" />
                  <Label htmlFor="r2">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="r3" />
                  <Label htmlFor="r3">High</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAssessment} disabled={loading} className="w-full gap-2 font-black uppercase tracking-widest h-12 bg-primary text-background shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
              Generate AI Rationale
            </Button>
          </CardFooter>
        </Card>

        <Card className={cn(
          "border-t-8 transition-all duration-500 bg-card/40 backdrop-blur-sm cyber-border border-primary/10",
          assignedLevel === 'Low' ? 'border-t-primary' : assignedLevel === 'Medium' ? 'border-t-accent' : 'border-t-orange-500'
        )}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Intelligence Report</span>
              {result && <Sparkles className="h-5 w-5 text-primary animate-bounce" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 opacity-40">
                <Activity className="h-20 w-20 text-muted-foreground animate-pulse" />
                <p className="text-sm font-bold uppercase tracking-widest">Awaiting parameter input...</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-black uppercase tracking-tighter animate-pulse">Running Simulations...</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Client ID</Label>
                    <div className="text-xl font-bold text-foreground">{uin}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground text-right block">Categorization</Label>
                    <div className={cn("text-xl font-black text-right", assignedLevel === 'High' ? 'text-accent' : 'text-primary')}>
                      {assignedLevel}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Automated Summary</Label>
                  <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 p-4 rounded-lg border border-primary/10">
                    {result.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Clinical Rationale</Label>
                  <p className="text-sm leading-relaxed italic border-l-2 border-primary/40 pl-4 py-1">
                    {result.rationale}
                  </p>
                </div>

                {assignedLevel === 'High' && (
                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-accent shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-accent uppercase tracking-tight">Critical Follow-up Required</p>
                      <p className="text-xs text-accent/80">Trigger outreach protocol for node {uin}.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {result && (
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => {setResult(null); setUin(""); setSelectedFactors([]);}}>Clear</Button>
              <Button className="flex-1 bg-primary text-background font-black uppercase tracking-widest" onClick={() => toast({ title: "Committed to Sync Queue" })}>Add to Sync Queue</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
