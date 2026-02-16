"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Search, FileText, ShieldCheck, Loader2 } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const INITIAL_ENTRIES = [
  { uin: 'UIN-001', date: '2024-07-20', hotspotId: 'h1', notes: 'Discussed condom negotiation. Client was receptive.', status: 'Pending' },
  { uin: 'UIN-003', date: '2024-07-20', hotspotId: 'h1', notes: 'Client reported instance of violence. Referred to services. High-risk follow-up needed.', status: 'Verified' },
  { uin: 'UIN-004', date: '2024-07-19', hotspotId: 'h2', notes: 'Provided condoms and information materials.', status: 'Verified' },
];

export default function HotspotDiaryPage() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const formData = new FormData(e.currentTarget);
      const newEntry = {
        uin: formData.get('uin') as string,
        date: new Date().toISOString().split('T')[0],
        hotspotId: formData.get('hotspotId') as string,
        notes: formData.get('notes') as string,
        status: 'Pending'
      };
      
      setEntries([newEntry, ...entries]);
      setLoading(false);
      setIsDialogOpen(false);
      toast({
        title: "Entry Recorded",
        description: `Diary entry for ${newEntry.uin} has been securely logged.`,
      });
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary glow-cyan tracking-tight">Hotspot Diary</h1>
          <p className="text-muted-foreground">Securely view and manage confidential diary entries.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-background hover:bg-primary/90 font-bold gap-2">
              <PlusCircle className="h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="cyber-border bg-background border-primary/20 top-[50%]">
            <DialogHeader>
              <DialogTitle className="text-primary glow-cyan">Log New Interaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEntry} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uin">Unique Identifier (UIN)</Label>
                  <Input id="uin" name="uin" placeholder="e.g. UIN-005" required className="bg-muted/20 border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotspotId">Hotspot ID</Label>
                  <Input id="hotspotId" name="hotspotId" placeholder="e.g. h3" required className="bg-muted/20 border-primary/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Intervention Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Describe the interaction..." required className="bg-muted/20 border-primary/10 min-h-[100px]" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full bg-primary text-background font-bold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Commit to Diary"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Card */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl">
        <CardHeader className="border-b border-border/50 pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Recent Entries
              </CardTitle>
              <CardDescription>Displaying all recorded interactions.</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search UIN..." className="pl-10 bg-background/50 border-border/50 h-9 text-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[150px] text-xs font-black uppercase text-muted-foreground/70 tracking-widest pl-6">UIN</TableHead>
                <TableHead className="w-[150px] text-xs font-black uppercase text-muted-foreground/70 tracking-widest">Date</TableHead>
                <TableHead className="w-[120px] text-xs font-black uppercase text-muted-foreground/70 tracking-widest">Hotspot ID</TableHead>
                <TableHead className="text-xs font-black uppercase text-muted-foreground/70 tracking-widest">Notes</TableHead>
                <TableHead className="w-[120px] text-xs font-black uppercase text-muted-foreground/70 tracking-widest text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, idx) => (
                <TableRow key={idx} className="border-border/50 group hover:bg-primary/5 transition-colors">
                  <TableCell className="font-bold text-foreground pl-6">{entry.uin}</TableCell>
                  <TableCell className="text-muted-foreground font-medium">{entry.date}</TableCell>
                  <TableCell className="font-mono text-primary/80">{entry.hotspotId}</TableCell>
                  <TableCell className="text-sm text-foreground/80 leading-relaxed max-w-md">
                    {entry.notes}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Badge 
                      variant="outline"
                      className={cn(
                        "font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter",
                        entry.status === 'Pending' 
                          ? "bg-orange-500/10 text-orange-500 border-orange-500/30 glow-orange" 
                          : "bg-purple-500/10 text-purple-500 border-purple-500/30"
                      )}
                    >
                      {entry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {entries.length === 0 && (
            <div className="py-20 text-center space-y-4 opacity-40">
              <ShieldCheck className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-lg font-medium">No diary entries found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 pt-4">
        <div className="h-[1px] w-12 bg-border/50" />
        Encrypted Field Intelligence Ledger
        <div className="h-[1px] w-12 bg-border/50" />
      </div>
    </div>
  )
}