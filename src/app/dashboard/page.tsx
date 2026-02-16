"use client"

import React, { useState } from 'react'
import { StockCircularProgress } from '@/components/StockCircularProgress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Box, Upload, MapPin, AlertCircle, FileSpreadsheet, Package } from 'lucide-react'
import { INITIAL_STOCK } from '@/lib/store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export default function Dashboard() {
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [isUploading, setIsUploading] = useState(false);

  const totalStockInHand = stock.reduce((acc, item) => acc + item.currentStock, 0);
  const totalStockReceived = stock.reduce((acc, item) => acc + item.totalReceived, 0);

  const handleExcelUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Mock logic: sync from peer request forms
      setStock(prev => prev.map(s => s.name === 'Condoms' ? { ...s, totalDispensed: s.totalDispensed + 500, currentStock: s.currentStock - 500 } : s));
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Supervisor Intelligence</h1>
          <p className="text-muted-foreground">Mbare Community Microplanning - Wards 3, 4, 11, 12</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExcelUpload} disabled={isUploading}>
            <FileSpreadsheet className="h-4 w-4" />
            {isUploading ? 'Parsing Peers Form...' : 'Sync Peers Form'}
          </Button>
          <Button className="gap-2 bg-primary">
            <Box className="h-4 w-4" />
            Stock Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-white/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Resource Inventory</CardTitle>
            <CardDescription>Total In-Hand vs Received Capacity</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <StockCircularProgress value={totalStockInHand} max={totalStockReceived} label="Total Stock in Hand" />
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
               <Package className="h-4 w-4" /> Key Resource Units
             </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stock.slice(0, 4).map((item) => (
              <Card key={item.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardContent className="pt-6 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{item.facility}</p>
                    <h3 className="text-lg font-bold truncate max-w-[120px]">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary">{item.currentStock.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">In Hand</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Coverage Overlap Detected</AlertTitle>
        <AlertDescription>
          Two PEs in Ward 3 are tracking the same UIN (V-A-80063). Please verify and merge records.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Facility Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/mbaremap/800/400')] bg-cover opacity-30 grayscale" />
               <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-primary/20 flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded" />
                    <span className="text-xs font-bold">Matapi Youth Hub (Ward 3/4)</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-accent/20 flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent rounded" />
                    <span className="text-xs font-bold">Edith Opperman Clinic (Ward 11/12)</span>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-accent" />
              Inbound Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary transition-colors cursor-pointer">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-bold">Upload Hotspot Locator Excel</p>
                <p className="text-xs text-muted-foreground">Maps GPS coordinates to facility nodes</p>
              </div>
              <Button variant="secondary" size="sm">Select File</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
