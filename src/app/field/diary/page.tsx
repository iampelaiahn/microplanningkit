"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Search, FileText, ShieldCheck, Loader2, AlertCircle, CheckCircle2, ClipboardList } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { KPType } from '@/lib/types'

const INITIAL_ENTRIES = [
  { uin: 'V-A-80063', date: '2024-07-20', kpType: 'FSW' as KPType, isRegistered: true, notes: 'Initial intake', status: 'Verified' },
  { uin: 'M-B-91022', date: '2024-07-21', kpType: 'MSM' as KPType, isRegistered: false, notes: 'Follow up', status: 'Pending' },
];

const CASELOAD_LIMITS: Record<string, number> = { FSW: 80, MSM: 40, TG: 30 };

export default function HotspotDiaryPage() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const total = entries.length;
    const registered = entries.filter(e => e.isRegistered).length;
    const linkageRate = total > 0 ? (registered / total) * 100 : 0;
    const typeCounts = entries.reduce((acc, e) => {
      acc[e.kpType] = (acc[e.kpType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, linkageRate, typeCounts };
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const uin = formData.get('uin') as string;
    const kpType = formData.get('kpType') as KPType;

    if (entries.some(e => e.uin === uin)) {
      toast({ title: "Validation Error", description: "Duplicate Unique Identifier detected.", variant: "destructive" });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newEntry = {
        uin,
        date: new Date().toISOString().split('T')[0],
        kpType,
        isRegistered: formData.get('registered') === 'yes',
        notes: formData.get('notes') as string,
        status: 'Pending'
      };
      setEntries([newEntry, ...entries]);
      setLoading(false);
      setIsDialogOpen(false);
      toast({ title: "Entry Recorded", description: `Peer ${uin} added to diary.` });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary glow-cyan tracking-tight italic uppercase">Hotspot Diary</h1>
          <p className="text-muted-foreground">Confidential peer ledger & microplanning caseload management.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-background font-black uppercase tracking-widest gap-2 h-12">
              <PlusCircle className="h-5 w-5" /> New Peer Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="cyber-border bg-background border-primary/20">
            <DialogHeader><DialogTitle className="text-primary glow-cyan">Register New Peer</DialogTitle></DialogHeader>
            <form onSubmit={handleAddEntry} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Unique ID (UIN)</Label>
                  <Input name="uin" placeholder="e.g. V-A-80063" required />
                </div>
                <div className="space-y-2">
                  <Label>KP Type</Label>
                  <Select name="kpType" required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FSW">FSW</SelectItem>
                      <SelectItem value="MSM">MSM</SelectItem>
                      <SelectItem value="TG">TG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Registered at Clinic?</Label>
                <Select name="registered" defaultValue="no">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter><Button type="submit" disabled={loading} className="w-full bg-primary text-background font-bold">Commit to Ledger</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/10 p-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase">Total Caseload</p>
          <p className="text-3xl font-black text-primary">{stats.total}</p>
        </Card>
        <Card className={cn("bg-card/40 border-l-4 p-4", stats.linkageRate < 80 ? "border-l-destructive" : "border-l-primary")}>
          <p className="text-[10px] font-black text-muted-foreground uppercase">Clinic Linkage</p>
          <p className={cn("text-3xl font-black", stats.linkageRate < 80 ? "text-destructive" : "text-primary")}>{stats.linkageRate.toFixed(0)}%</p>
          {stats.linkageRate < 80 && <p className="text-[8px] text-destructive font-bold flex items-center gap-1 mt-1"><AlertCircle className="h-2 w-2" /> CRITICAL: Coverage &lt; 80%</p>}
        </Card>
        {Object.entries(CASELOAD_LIMITS).map(([type, limit]) => (
          <Card key={type} className={cn("bg-card/40 p-4 border-l-4", (stats.typeCounts[type] || 0) > limit ? "border-l-destructive" : "border-l-muted")}>
            <p className="text-[10px] font-black text-muted-foreground uppercase">{type} Load</p>
            <p className="text-2xl font-black">{stats.typeCounts[type] || 0} / {limit}</p>
            {(stats.typeCounts[type] || 0) > limit && <p className="text-[8px] text-destructive font-bold uppercase mt-1">Caseload Overload</p>}
          </Card>
        ))}
      </div>

      <Card className="bg-card/40 border-border/50">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-xl font-bold italic flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" /> Active Peers Ledger
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 text-[10px] font-black uppercase">
              <TableRow>
                <TableHead className="pl-6">UIN</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead className="text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, idx) => (
                <TableRow key={idx} className="group hover:bg-primary/5">
                  <TableCell className="font-bold pl-6">{entry.uin}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[9px] font-black border-primary/20">{entry.kpType}</Badge></TableCell>
                  <TableCell>
                    {entry.isRegistered ? (
                      <span className="text-primary flex items-center gap-1 text-[10px] font-bold"><CheckCircle2 className="h-3 w-3" /> Linked</span>
                    ) : (
                      <span className="text-destructive flex items-center gap-1 text-[10px] font-bold"><AlertCircle className="h-3 w-3" /> Unlinked</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{entry.date}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Badge variant="outline" className={cn("text-[9px] font-black", entry.status === 'Verified' ? "text-primary border-primary/20" : "text-accent border-accent/20")}>{entry.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
