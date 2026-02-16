
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  RefreshCw, 
  CloudUpload, 
  ShieldCheck, 
  Database, 
  Wifi, 
  WifiOff,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function SyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSync, setLastSync] = useState("Never");
  const [isOnline, setIsOnline] = useState(true);

  const handleSync = () => {
    if (!isOnline) {
      toast({
        title: "Sync Blocked",
        description: "Network offline. Establish uplink before syncing.",
        variant: "destructive"
      });
      return;
    }

    setSyncing(true);
    setProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        setSyncing(false);
        setLastSync(new Date().toLocaleTimeString());
        toast({
          title: "Uplink Complete",
          description: "Field data successfully pushed to central database.",
        });
      } else {
        setProgress(currentProgress);
      }
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">
            Sync Intelligence
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Database className="h-4 w-4" /> Secure Field-to-Hub Data Uplink
          </p>
        </div>
        <div className={cn(
          "px-4 py-2 rounded-full border flex items-center gap-3 transition-all",
          isOnline ? "bg-primary/10 border-primary/20 text-primary" : "bg-destructive/10 border-destructive/20 text-destructive"
        )}>
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          <span className="text-xs font-black uppercase tracking-widest">
            {isOnline ? "Uplink Active" : "No Uplink"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 cyber-border bg-card/40 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudUpload className="h-5 w-5 text-primary" />
              Deployment Pipeline
            </CardTitle>
            <CardDescription>Upload local records for supervisor verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 py-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pushing Status</p>
                  <p className="text-lg font-bold">{syncing ? "Encrypted Transfer in Progress..." : "Ready for Deployment"}</p>
                </div>
                <span className="text-2xl font-black text-primary italic">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-muted/50 border border-primary/5 shadow-[0_0_10px_rgba(0,255,255,0.1)]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-muted/20 p-4 rounded-lg border border-primary/5 space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Pending Records</p>
                  <p className="text-2xl font-black text-foreground">14</p>
               </div>
               <div className="bg-muted/20 p-4 rounded-lg border border-primary/5 space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Last Verified</p>
                  <p className="text-sm font-bold text-primary flex items-center gap-2">
                    <Clock className="h-3 w-3" /> {lastSync}
                  </p>
               </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSync} 
              disabled={syncing}
              className="w-full h-14 bg-primary text-background font-black uppercase tracking-widest gap-3 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-[1.02] transition-all"
            >
              {syncing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
              Initiate Full System Sync
            </Button>
          </CardFooter>
        </Card>

        <Card className="cyber-border bg-background border-primary/5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sync Manifest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded border border-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold">Hotspot Diary</span>
                </div>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">8 Items</span>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded border border-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold">Risk Assessments</span>
                </div>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">4 Items</span>
              </div>
              <div className="flex items-center justify-between group opacity-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded border border-border">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-bold">GPS Meta Logs</span>
                </div>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">0 Items</span>
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary/60 tracking-tighter">
                <ShieldCheck className="h-3 w-3" />
                End-to-End Encryption Enabled
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Toggle for Mock Testing */}
      <div className="flex justify-center pt-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOnline(!isOnline)}
          className="text-[10px] font-black uppercase text-muted-foreground/40 hover:text-primary transition-colors"
        >
          [ Developer Toggle: {isOnline ? "Disable Uplink" : "Enable Uplink"} ]
        </Button>
      </div>
    </div>
  )
}
