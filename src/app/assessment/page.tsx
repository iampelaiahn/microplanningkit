"use client"

import React, { useState, useMemo } from 'react'
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
  Clock,
  ArrowLeft,
  LayoutGrid,
  ClipboardList,
  Target,
  Network,
  Filter,
  XCircle,
  Building2,
  Users,
  MapPin,
  X,
  Zap,
  Link as LinkIcon,
  Compass
} from 'lucide-react'
import { generateRiskAssessmentSummary } from '@/ai/flows/generate-risk-assessment-summary'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCollection, useFirestore } from '@/firebase'
import { Progress } from '@/components/ui/progress'
import { INITIAL_HOTSPOTS } from '@/lib/store'
import { SocialNetworkMap } from '@/components/SocialNetworkMap'

const RISK_FACTORS = [
  "Inconsistent condom use",
  "High number of sexual partners",
  "Reported alcohol/substance use before sex",
  "Experience of gender-based violence (GBV)",
  "Lack of access to health facilities",
  "Frequent travel away from home ward",
];

const TYPOLOGIES = ["Shebeen", "Home-based", "Brothel", "Hotel", "Parlour", "Social Media", "Street-based", "Truck stop", "Lodge", "Bar"];

const WARDS = ["All", "Ward 3", "Ward 4", "Ward 11", "Ward 12"];

const DEPLOYED_TOOLS = [
  {
    id: 'risk-assessment',
    title: 'Risk Assessment Intelligence',
    description: 'AI-powered vulnerability screening and clinical rationale.',
    icon: Shield,
    status: 'Active',
    kpis: ['82% Verification', '14% High Risk'],
    color: 'primary'
  },
  {
    id: 'hotspot-profiling',
    title: 'Hotspot Profiler',
    description: 'Capture site-specific PSE and structural barriers.',
    icon: Target,
    status: 'Active',
    kpis: ['12 Sites Mapped', '92% Coverage'],
    color: 'accent'
  },
  {
    id: 'network-map',
    title: 'Social Network Analysis',
    description: 'Visualize peer-to-peer trust networks and nano-networks.',
    icon: Network,
    status: 'Active',
    kpis: ['142 Trust Nodes', '18 Bridges'],
    color: 'primary'
  }
];

export default function AssessmentManagementPage() {
  const [view, setView] = useState<'library' | 'detail'>('library');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('repository');
  const [selectedWard, setSelectedWard] = useState<string>("All");
  const [activeFactorFilter, setActiveFactorFilter] = useState<string | null>(null);
  
  // Firestore Data
  const { data: visits } = useCollection('outreachVisits');
  const { data: hotspotProfiles } = useCollection('hotspotProfiles');

  // Tool Selection Flags
  const isHotspotTool = selectedToolId === 'hotspot-profiling';
  const isNetworkTool = selectedToolId === 'network-map';

  // Risk Assessment Engine State
  const [uin, setUin] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [riskResult, setRiskResult] = useState<{ summary: string; rationale: string } | null>(null);
  const [assignedLevel, setAssignedLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Stats Calculation
  const stats = useMemo(() => {
    if (isHotspotTool) {
      const records = hotspotProfiles || [];
      const filteredByWard = selectedWard === "All" ? records : records.filter(h => h.ward === selectedWard);
      
      const totalPop = filteredByWard.reduce((acc, h) => {
        const pData = h.populationData || {};
        return acc + Object.values(pData).reduce((pAcc: number, pCur: any) => pAcc + (pCur.total || 0), 0);
      }, 0);

      const highVolume = filteredByWard.filter(h => {
         const pData = h.populationData || {};
         const total = Object.values(pData).reduce((pAcc: number, pCur: any) => pAcc + (pCur.total || 0), 0);
         return total > 50;
      }).length;

      const criticalGaps = filteredByWard.filter(h => (h.services?.condoms === false || h.services?.lube === false)).length;
      
      const typeCounts: Record<string, number> = {};
      TYPOLOGIES.forEach(t => typeCounts[t] = 0);
      filteredByWard.forEach(h => {
        h.typology?.forEach((t: string) => {
          if (typeCounts[t] !== undefined) typeCounts[t]++;
        });
      });

      const filteredRecords = activeFactorFilter 
        ? filteredByWard.filter(h => h.typology?.includes(activeFactorFilter))
        : filteredByWard;

      return { total: filteredByWard.length, highVolume, criticalGaps, typeCounts, totalPop, filteredRecords };
    } else if (isNetworkTool) {
      const expectedCaseload = 15;
      const coverageRate = (INITIAL_HOTSPOTS.length / expectedCaseload) * 100;
      
      const filteredRecords = activeFactorFilter
        ? INITIAL_HOTSPOTS.filter(h => h.type === activeFactorFilter)
        : INITIAL_HOTSPOTS;

      return { 
        total: INITIAL_HOTSPOTS.length, 
        coverageRate, 
        filteredRecords 
      };
    } else {
      const records = visits || [];
      let filteredByWard = records;
      if (selectedWard !== "All") filteredByWard = filteredByWard.filter(a => a.ward === selectedWard);
      
      const total = filteredByWard.length;
      const levels = {
        High: filteredByWard.filter(a => a.riskLevel === 'High').length,
        Medium: filteredByWard.filter(a => a.riskLevel === 'Medium').length,
        Low: filteredByWard.filter(a => a.riskLevel === 'Low').length,
      };

      const factorCounts: Record<string, number> = {};
      RISK_FACTORS.forEach(f => factorCounts[f] = 0);
      filteredByWard.forEach(a => {
        a.topicsDiscussed?.forEach((f: string) => {
          if (factorCounts[f] !== undefined) factorCounts[f]++;
        });
      });

      const filteredRecords = activeFactorFilter
        ? filteredByWard.filter(a => a.topicsDiscussed?.includes(activeFactorFilter))
        : filteredByWard;

      return { total, levels, factorCounts, filteredRecords };
    }
  }, [isHotspotTool, isNetworkTool, selectedWard, activeFactorFilter, hotspotProfiles, visits]);

  const handleAssessment = async () => {
    if (!uin) {
      toast({ title: "UIN Required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const output = await generateRiskAssessmentSummary({
        identifiedRiskFactors: selectedFactors,
        assignedRiskLevel: assignedLevel
      });
      setRiskResult(output);
      toast({ title: "Intelligence Analysis Generated" });
    } catch (error) {
      toast({ title: "AI Analysis Failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openTool = (id: string) => {
    setSelectedToolId(id);
    setView('detail');
    setActiveFactorFilter(null);
  };

  if (view === 'library') {
    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">
              Tools Management
            </h1>
            <p className="text-muted-foreground text-lg">Deploy, monitor, and analyze field intelligence instruments.</p>
          </div>
          <Button className="bg-primary text-background font-black uppercase tracking-widest gap-2 h-12">
            <Plus className="h-5 w-5" /> New Assessment Tool
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEPLOYED_TOOLS.map((tool) => (
            <Card 
              key={tool.id} 
              className="group cursor-pointer cyber-border border-primary/10 bg-background/40 hover:border-primary/40 transition-all hover:scale-[1.02]"
              onClick={() => openTool(tool.id)}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "p-3 rounded-lg bg-opacity-10 border",
                    tool.color === 'primary' ? "bg-primary border-primary/20 text-primary" : "bg-accent border-accent/20 text-accent"
                  )}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase text-[10px]">
                    {tool.status}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{tool.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tool.kpis.map((kpi, i) => (
                    <Badge key={i} className="bg-muted text-muted-foreground font-bold text-[9px] uppercase">
                      {kpi}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-primary/5">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                  Open Analysis <Activity className="h-3 w-3" />
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-700 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setView('library')} className="text-primary hover:bg-primary/10">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">
                {isHotspotTool ? 'Hotspot Profiler Analysis' : isNetworkTool ? 'Social Network Analysis' : 'Risk Intelligence Analysis'}
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">Real-time surveillance monitoring from field data</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedWard} onValueChange={(v) => { setSelectedWard(v); setActiveFactorFilter(null); }}>
            <SelectTrigger className="w-40 bg-background/50 border-primary/20">
              <SelectValue placeholder="Filter by Ward" />
            </SelectTrigger>
            <SelectContent>
              {WARDS.map(ward => (
                <SelectItem key={ward} value={ward}>{ward}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/10 px-6 py-4 flex items-center gap-4">
           <div className="p-3 bg-primary/20 rounded-lg">
              {isHotspotTool ? <Target className="h-6 w-6 text-primary" /> : isNetworkTool ? <Network className="h-6 w-6 text-primary" /> : <Shield className="h-6 w-6 text-primary" />}
           </div>
           <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-muted-foreground">
                {isHotspotTool ? 'Sites Mapped' : isNetworkTool ? 'Network Nodes' : 'Assessments'}
              </p>
              <p className="text-3xl font-black text-foreground">{stats.total}</p>
           </div>
        </Card>
        
        {isHotspotTool ? (
          <>
            <Card className="bg-accent/5 border-l-4 border-l-accent px-6 py-4">
              <p className="text-[10px] font-black uppercase text-muted-foreground">High Volume Hubs</p>
              <p className="text-2xl font-black text-accent">{(stats as any).highVolume}</p>
            </Card>
            <Card className="bg-orange-500/5 border-l-4 border-l-orange-500 px-6 py-4">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Critical Gaps</p>
              <p className="text-2xl font-black text-orange-500">{(stats as any).criticalGaps}</p>
            </Card>
            <Card className="bg-muted/5 border-l-4 border-l-muted-foreground px-6 py-4">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Pop. Estimate</p>
              <p className="text-2xl font-black text-foreground">~{(stats as any).totalPop}</p>
            </Card>
          </>
        ) : isNetworkTool ? (
          <>
            <Card className={cn(
              "border-l-4 px-6 py-4",
              (stats as any).coverageRate < 70 ? "bg-accent/5 border-l-accent" : "bg-primary/5 border-l-primary"
            )}>
              <p className="text-[10px] font-black uppercase text-muted-foreground">Network Coverage</p>
              <p className={cn("text-2xl font-black", (stats as any).coverageRate < 70 ? "text-accent" : "text-primary")}>
                {Math.round((stats as any).coverageRate)}%
              </p>
            </Card>
            <Card className="bg-muted/5 border-l-4 border-l-muted-foreground px-6 py-4">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Trust Integrity</p>
              <p className="text-2xl font-black text-foreground">2.0/3.0</p>
            </Card>
            <Card className="bg-muted/5 border-l-4 border-l-muted-foreground px-6 py-4">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Viability</p>
              <p className="text-2xl font-black text-foreground">Active</p>
            </Card>
          </>
        ) : (
          ['High', 'Medium', 'Low'].map((level) => (
            <Card key={level} className={cn(
              "border-l-4 px-6 py-4 flex items-center gap-4",
              level === 'High' ? "bg-accent/5 border-l-accent" : 
              level === 'Medium' ? "bg-primary/5 border-l-primary" : 
              "bg-muted/5 border-l-muted-foreground"
            )}>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground">{level} Risk Nodes</p>
                <p className={cn(
                  "text-2xl font-black",
                  level === 'High' ? "text-accent" : level === 'Medium' ? "text-primary" : "text-foreground"
                )}>
                  {(stats as any).levels[level]}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      <Tabs defaultValue="repository" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/30 border border-primary/10">
          <TabsTrigger value="repository" className="text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-background">
            <ClipboardList className="h-4 w-4 mr-2" /> {isNetworkTool ? 'Node Repository' : 'Data Repository'}
          </TabsTrigger>
          <TabsTrigger value="engine" className="text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-background">
            <BrainCircuit className="h-4 w-4 mr-2" /> {isHotspotTool ? 'Microplanning Engine' : isNetworkTool ? 'Social Network Map' : 'Risk Assessment Engine'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repository" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <Card className="md:col-span-1 cyber-border border-primary/10 bg-background/40 p-4 space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> 
                      {isHotspotTool ? 'Typology Prevalence' : isNetworkTool ? 'Node Distribution' : 'Risk Factors Prevalence'}
                    </h3>
                    {activeFactorFilter && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                        onClick={() => setActiveFactorFilter(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(isHotspotTool ? TYPOLOGIES : isNetworkTool ? ['Peer Leader', 'Influencer', 'KP Member'] : RISK_FACTORS).map((factor) => {
                      let percentage = 0;
                      if (isHotspotTool) {
                        const count = (stats as any).typeCounts[factor] || 0;
                        percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                      } else if (isNetworkTool) {
                        const count = (stats.filteredRecords as any[]).filter(r => r.type === factor).length;
                        percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                      } else {
                        const count = (stats as any).factorCounts[factor] || 0;
                        percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                      }
                      
                      const isActive = activeFactorFilter === factor;
                      
                      return (
                        <div 
                          key={factor} 
                          className={cn(
                            "space-y-1 cursor-pointer transition-all duration-300 p-1.5 rounded-md",
                            isActive ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-primary/5"
                          )}
                          onClick={() => setActiveFactorFilter(isActive ? null : factor)}
                        >
                          <div className="flex justify-between text-[9px] font-bold uppercase">
                            <span className={cn(
                              "truncate max-w-[140px]",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                              {factor}
                            </span>
                            <span className={isActive ? "text-primary" : "text-muted-foreground"}>
                              {percentage}%
                            </span>
                          </div>
                          <Progress value={percentage} className={cn("h-1 bg-muted/30", isActive && "bg-primary/30")} />
                        </div>
                      )
                    })}
                  </div>
                </div>
             </Card>

             <Card className="md:col-span-3 cyber-border border-primary/10 bg-background/40">
                <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                     <CardTitle className="text-xl font-bold italic">
                       {isHotspotTool ? 'Hotspot Profile Ledger' : isNetworkTool ? 'Social Node Ledger' : 'Client Risk Ledger'}
                     </CardTitle>
                     <CardDescription>
                        Records for {selectedWard} 
                        {activeFactorFilter && ` • ${activeFactorFilter}`}
                        ({stats.filteredRecords.length} entries)
                     </CardDescription>
                   </div>
                   <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search records..." className="pl-10 h-9 text-xs bg-background/50 border-primary/20" />
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="pl-6 text-[10px] font-black uppercase">{isHotspotTool || isNetworkTool ? 'Name' : 'Unique ID'}</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Ward</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">{isHotspotTool || isNetworkTool ? 'Typology' : 'Baseline Level'}</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">{isHotspotTool ? 'Pop. Est' : isNetworkTool ? 'Influence' : 'Timestamp'}</TableHead>
                        <TableHead className="text-right pr-6 text-[10px] font-black uppercase">Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.filteredRecords.map((record: any) => {
                        if (isHotspotTool || isNetworkTool) {
                          const val = isHotspotTool 
                            ? (Object.values(record.populationData || {}).reduce((acc: number, cur: any) => acc + (cur.total || 0), 0))
                            : (record.influenceScore || 0);
                          
                          return (
                            <TableRow key={record.id} className="hover:bg-primary/5 border-primary/5 transition-colors">
                              <TableCell className="pl-6 font-bold">{record.hotspotName || record.name}</TableCell>
                              <TableCell className="text-xs">{record.ward}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px] uppercase">
                                  {isHotspotTool ? (record.typology?.[0] || 'Unknown') : (record.type || 'Unknown')}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs font-black text-primary">{val}</TableCell>
                              <TableCell className="text-right pr-6">
                                <Badge className={cn(
                                  "text-[10px] font-black uppercase", 
                                  (record.priorityLevel === 'Critical' || record.relationshipStrength === 'Weak') ? "bg-accent" : "bg-muted"
                                )}>
                                  {isNetworkTool ? (record.relationshipStrength === 'Weak' ? 'ISOLATED' : 'ACTIVE') : (record.priorityLevel || 'Standard')}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        } else {
                          return (
                            <TableRow key={record.id} className="hover:bg-primary/5 border-primary/5 transition-colors">
                              <TableCell className="pl-6 font-bold">{record.uin}</TableCell>
                              <TableCell className="text-xs">{record.ward || 'Ward 3'}</TableCell>
                              <TableCell>
                                <Badge className={cn(
                                  "font-black uppercase text-[10px]",
                                  record.riskLevel === 'High' ? "bg-accent/20 text-accent border-accent/40" : 
                                  record.riskLevel === 'Medium' ? "bg-primary/20 text-primary border-primary/40" :
                                  "bg-muted text-muted-foreground"
                                )}>{record.riskLevel}</Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{new Date(record.timestamp).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right pr-6">
                                 <div className="flex items-center justify-end gap-2 text-[10px] font-bold">
                                    {record.riskLevel === 'High' ? <span className="text-accent flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Critical</span> : <span className="text-primary flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Standard</span>}
                                 </div>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="engine">
          <div className="grid grid-cols-1 gap-6">
            {isNetworkTool ? (
              <Card className="cyber-border border-primary/10 bg-background/40 min-h-[600px]">
                <CardHeader>
                  <CardTitle className="text-2xl italic font-black">Social Network Map</CardTitle>
                  <CardDescription>Interactive trust bridge modeling and influence tracking</CardDescription>
                </CardHeader>
                <CardContent className="h-[600px]">
                   <SocialNetworkMap interactive={true} />
                </CardContent>
              </Card>
            ) : isHotspotTool ? (
              <div className="p-12 text-center space-y-4 opacity-40 border-2 border-dashed border-primary/20 rounded-lg">
                <Target className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="font-bold uppercase tracking-widest">Select a record from the repository to run AI strategic analysis.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cyber-border border-primary/10 bg-background/40">
                  <CardHeader>
                    <CardTitle className="text-2xl italic font-black">Risk Parameters</CardTitle>
                    <CardDescription>Input identification and observed risks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-muted-foreground">Unique ID (UIN)</Label>
                      <Input value={uin} onChange={(e) => setUin(e.target.value)} className="bg-muted/30 border-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-muted-foreground">Parameter Matrix</Label>
                      <div className="space-y-1">
                        {RISK_FACTORS.map((factor) => (
                          <div key={factor} className="flex items-center space-x-2 p-2 rounded hover:bg-primary/5">
                            <Checkbox checked={selectedFactors.includes(factor)} onCheckedChange={(c) => setSelectedFactors(prev => c ? [...prev, factor] : prev.filter(f => f !== factor))} />
                            <Label className="text-xs">{factor}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAssessment} disabled={loading} className="w-full gap-2 font-black h-12 bg-primary text-background">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                      Deploy Intelligence Analysis
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="cyber-border border-primary/10 bg-background/40">
                  <CardHeader><CardTitle>Intelligence Report</CardTitle></CardHeader>
                  <CardContent className={cn("py-24 text-center", !riskResult && "opacity-40")}>
                    {riskResult ? (
                      <div className="space-y-6 text-left">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-primary">Automated Summary</Label>
                          <p className="text-sm bg-muted/30 p-4 rounded-lg border border-primary/10">{riskResult.summary}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-primary">Clinical Rationale</Label>
                          <p className="text-sm italic border-l-2 border-primary/40 pl-4">{riskResult.rationale}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Sparkles className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">Reports generated upon engine deployment</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
