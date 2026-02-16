
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Shield, BrainCircuit, Loader2, Sparkles, AlertTriangle } from 'lucide-react'
import { generateRiskAssessmentSummary } from '@/ai/flows/generate-risk-assessment-summary'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

const RISK_FACTORS = [
  "Inconsistent condom use",
  "High number of sexual partners",
  "Reported alcohol/substance use before sex",
  "Experience of gender-based violence (GBV)",
  "Lack of access to health facilities",
  "Frequent travel away from home ward",
];

export default function RiskAssessment() {
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

  const currentRiskColor = assignedLevel === 'Low' ? 'text-primary' : assignedLevel === 'Medium' ? 'text-accent' : 'text-orange-500 animate-pulse';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-primary">Risk Assessment Engine</h1>
            <p className="text-muted-foreground">AI-Powered Vulnerability Screening</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Identified Risk Factors</CardTitle>
              <CardDescription>Select all that apply to the KP during assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {RISK_FACTORS.map((factor) => (
                <div key={factor} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => toggleFactor(factor)}>
                  <Checkbox checked={selectedFactors.includes(factor)} onCheckedChange={() => toggleFactor(factor)} />
                  <Label className="text-sm cursor-pointer">{factor}</Label>
                </div>
              ))}

              <div className="pt-6 border-t space-y-4">
                <Label className="font-bold">Calculated Baseline Level</Label>
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
              <Button onClick={handleAssessment} disabled={loading} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                Run AI Intelligence Analysis
              </Button>
            </CardFooter>
          </Card>

          <Card className={cn(
            "border-t-8 transition-all duration-500",
            assignedLevel === 'Low' ? 'border-t-primary' : assignedLevel === 'Medium' ? 'border-t-accent' : 'border-t-orange-500'
          )}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assessment Result</span>
                {result && <Sparkles className="h-5 w-5 text-primary animate-bounce" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-40">
                  <Activity className="h-16 w-16" />
                  <p>Awaiting analysis data...</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="font-medium animate-pulse">Scanning vulnerability matrices...</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Assigned Risk Level</Label>
                    <div className={cn("text-3xl font-black", currentRiskColor)}>
                      {assignedLevel}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Summary</Label>
                    <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 p-4 rounded-lg">
                      {result.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground">AI Rationale</Label>
                    <p className="text-sm leading-relaxed italic border-l-2 border-primary/40 pl-4">
                      {result.rationale}
                    </p>
                  </div>

                  {assignedLevel === 'High' && (
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-orange-700">Immediate Follow-up Required</p>
                        <p className="text-xs text-orange-600/80">Schedule clinical intervention within 48 hours.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {result && (
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>Reset</Button>
                <Button className="flex-1 bg-primary">Commit to UIN Record</Button>
              </CardFooter>
            )}
          </Card>
       </div>
    </div>
  )
}
