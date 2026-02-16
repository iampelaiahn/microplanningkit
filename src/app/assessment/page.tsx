
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
  User, 
  FileText, 
  Search, 
  Plus, 
  BarChart3,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { generateRiskAssessmentSummary } from '@/ai/flows/generate-risk-assessment-summary'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { INITIAL_KPS } from '@/lib/store'

const RISK_FACTORS = [
  "Inconsistent condom use",
  "High number of sexual partners",
  "Reported alcohol/substance use before sex",
  "Experience of gender-based violence (GBV)",
  "Lack of access to health facilities",
  "Frequent travel away from home ward",
];

export default function AssessmentManagementPage() {
  const [activeTab, setActiveTab] = useState('repository');
  const [uin, setUin] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; rationale: string } | null>(null);
  const [assignedLevel, setAssignedLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [assessments, setAssessments] = useState(INITIAL_KPS);

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
      
      // On success, we "save" it to our local list for demo purposes
      const newRecord = {
        id: `kp-${Date.now()}`,
        uin,
        riskLevel: assignedLevel,
        ward: 'Ward 3', // Mock ward
        lastAssessment: new Date().toISOString().split('T')[0],
        verificationStatus: 'Pending' as const,
        meetingCount: 1
      };
      setAssessments([newRecord, ...assessments]);

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

  const highRiskCount = assessments.filter(a => a.riskLevel === 'High').length;
  const pendingCount = assessments.filter(a => a.verificationStatus === 'Pending').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">
            Assessment Intelligence
          </h1>
          <p className="text-muted-foreground">Peer Tool Management & Vulnerability Analysis</p>
        </div>
        <div className="flex gap-4">
          <Card className="bg-primary/5 border-primary/20 px-6 py-3 flex items-center gap-4">
             <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground">Portfolio Size</p>
                <p className="text-xl font-black text-foreground">{assessments.length}</p>
             </div>
          </Card>
          <Card className="bg-accent/5 border-accent/20 px-6 py-3 flex items-center gap-4">
             <div className="p-2 bg-accent/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-accent" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground">High Risk Nodes</p>
                <p className="text-xl font-black text-accent">{highRiskCount}</p>
             </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="repository" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/30 border border-primary/10">
          <TabsTrigger value="repository" className="text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-background">
            <FileText className="h-4 w-4 mr-2" /> Assessment Repository
          </TabsTrigger>
          <TabsTrigger value="engine" className="text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-background">
            <BrainCircuit className="h-4 w-4 mr-2" /> AI Risk Engine
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repository" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {/* Analysis Sidebar */}
             <Card className="md:col-span-1 cyber-border border-primary/10 bg-background/40 p-4 space-y-6">
                <h3 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Trend Analysis
                </h3>
                
                <div className="space-y-4">
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase font-bold">
                        <span className="text-muted-foreground">Verification Rate</span>
                        <span>{Math.round(((assessments.length - pendingCount) / assessments.length) * 100)}%</span>
                      </div>
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '65%' }} />
                      </div>
                   </div>

                   <div className="pt-4 border-t border-primary/10 space-y-3">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Field Health</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <CheckCircle2 className="h-3 w-3" /> Wards 3/4 Coverage Optimized
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-accent">
                        <Clock className="h-3 w-3" /> Re-assessments due for 4 UINs
                      </div>
                   </div>
                </div>
             </Card>

             {/* Ledger Table */}
             <Card className="md:col-span-3 cyber-border border-primary/10 bg-background/40">
                <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                     <CardTitle className="text-xl font-bold italic">Assessment Ledger</CardTitle>
                     <CardDescription>Confidential record of all screenings</CardDescription>
                   </div>
                   <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search UIN..." className="pl-10 h-9 text-xs bg-background/50 border-primary/20" />
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="pl-6 text-[10px] font-black uppercase">Client UIN</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Risk Level</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Last Screening</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-right pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessments.map((record) => (
                        <TableRow key={record.id} className="hover:bg-primary/5 transition-colors border-primary/5">
                          <TableCell className="pl-6 font-bold">{record.uin}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "font-black uppercase text-[10px] px-2 py-0.5",
                              record.riskLevel === 'High' ? "bg-accent/20 text-accent border-accent/40" : 
                              record.riskLevel === 'Medium' ? "bg-primary/20 text-primary border-primary/40" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {record.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{record.lastAssessment}</TableCell>
                          <TableCell className="text-right pr-6">
                             <div className="flex items-center justify-end gap-2 text-[10px] font-bold">
                                {record.verificationStatus === 'Verified' ? (
                                  <span className="text-primary flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Verified
                                  </span>
                                ) : (
                                  <span className="text-accent flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Pending
                                  </span>
                                )}
                             </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="engine">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cyber-border border-primary/10 bg-background/40">
              <CardHeader>
                <CardTitle className="text-2xl italic font-black">Risk Parameters</CardTitle>
                <CardDescription>Select all that apply to the KP during assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="uin" className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" /> Client Unique Identifier (UIN)
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
                  <Label className="font-bold text-primary">Baseline Risk Level</Label>
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
                <Button onClick={handleAssessment} disabled={loading} className="w-full gap-2 font-black uppercase tracking-widest h-12 bg-primary text-background shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-[1.01] transition-all">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                  Deploy Intelligence Analysis
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
                    <p className="text-sm font-bold uppercase tracking-widest">Awaiting field data input...</p>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="font-black uppercase tracking-tighter animate-pulse">Running Vulnerability Matrix Simulations...</p>
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
                        <Label className="text-[10px] font-black uppercase text-muted-foreground text-right block">Vulnerability</Label>
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
                          <p className="text-xs text-accent/80">Trigger high-frequency outreach protocol for node {uin}.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              {result && (
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => {setResult(null); setUin(""); setSelectedFactors([]);}}>Clear</Button>
                  <Button className="flex-1 bg-primary text-background font-black uppercase tracking-widest" onClick={() => setActiveTab('repository')}>Commit to Ledger</Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
