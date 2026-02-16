
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Shield, UserCog, Users, Lock, Unlock, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function Home() {
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(false);
  const REQUIRED_PIN = "3524!6";

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === REQUIRED_PIN) {
      setIsAuthorized(true);
      setError(false);
      toast({
        title: "Access Granted",
        description: "Sentinel surveillance modules unlocked.",
      });
    } else {
      setError(true);
      toast({
        variant: "destructive",
        title: "Authorization Failed",
        description: "Incorrect PIN. Security log recorded.",
      });
    }
  };

  if (!isAuthorized) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 bg-grid">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="inline-block p-4 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Lock className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-primary glow-cyan tracking-tighter uppercase italic">
              Sentinel Access
            </h1>
            <p className="text-muted-foreground font-medium">
              Authorization required for field intelligence modules.
            </p>
          </div>

          <Card className="cyber-border border-primary/20 bg-card/40 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-700">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest">
                Identity Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2 text-left">
                  <Label htmlFor="pin" className="text-[10px] font-black uppercase text-primary/60">
                    Security PIN
                  </Label>
                  <Input 
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError(false);
                    }}
                    placeholder="••••••••"
                    className={cn(
                      "text-center text-2xl tracking-[0.5em] font-black bg-background/50 border-primary/20 h-14",
                      error && "border-destructive animate-shake"
                    )}
                    autoFocus
                  />
                  {error && (
                    <p className="text-destructive text-[10px] font-bold flex items-center gap-1 mt-2">
                      <AlertCircle className="h-3 w-3" /> INVALID AUTHORIZATION CODE
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full h-12 bg-primary text-background font-black uppercase tracking-widest gap-2">
                  Verify & Unlock <Unlock className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
            Restricted System • Wards 3, 4, 11, 12
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 animate-in fade-in duration-1000">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4 border border-primary/20">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-primary glow-cyan uppercase italic">
            Sentinel Mbare
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic font-medium">
            High-tech health surveillance and microplanning for community impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:border-primary transition-all duration-300 cyber-border bg-card/40 backdrop-blur-sm group">
            <CardHeader className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-lg w-fit border border-primary/20">
                <UserCog className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight italic">Supervisor</CardTitle>
                <CardDescription className="font-medium">
                  CHM access for resource intelligence, stock management, and field oversight.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full h-14 text-lg bg-primary text-background font-black uppercase tracking-widest gap-2 group-hover:scale-[1.02] transition-transform">
                <Link href="/dashboard">Access Dashboard <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-accent transition-all duration-300 cyber-border border-accent/20 bg-card/40 backdrop-blur-sm group">
            <CardHeader className="space-y-4">
              <div className="p-3 bg-accent/10 rounded-lg w-fit border border-accent/20">
                <Users className="h-10 w-10 text-accent" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight italic">Field Kit</CardTitle>
                <CardDescription className="font-medium">
                  PE access for real-time service tracking, UIN registration, and risk assessment.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full h-14 text-lg bg-accent text-background hover:bg-accent/90 font-black uppercase tracking-widest gap-2 group-hover:scale-[1.02] transition-transform">
                <Link href="/field">Go to Field Kit <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
