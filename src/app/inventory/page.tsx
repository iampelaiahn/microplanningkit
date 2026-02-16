
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { INITIAL_STOCK } from '@/lib/store'
import { Plus, History, ArrowDownToLine, ArrowUpToLine, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function InventoryPage() {
  const [stock] = useState(INITIAL_STOCK);

  const renderFacilityInventory = (facilityName: string) => {
    const filteredStock = stock.filter(item => item.facility === facilityName);
    
    const facilityReceived = filteredStock.reduce((acc, item) => acc + item.totalReceived, 0);
    const facilityDispensed = filteredStock.reduce((acc, item) => acc + item.totalDispensed, 0);
    const facilityInHand = filteredStock.reduce((acc, item) => acc + item.currentStock, 0);

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="p-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowDownToLine className="h-4 w-4 text-primary" />
                Total Received (Node)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-3xl font-black text-primary">{facilityReceived.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">From Warehouse</p>
            </CardContent>
          </Card>
          <Card className="bg-accent/10 border-accent/20">
            <CardHeader className="p-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowUpToLine className="h-4 w-4 text-accent" />
                Total Dispensed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-3xl font-black text-accent">{facilityDispensed.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">To Field Peers</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardHeader className="p-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4 text-green-600" />
                Current In Hand
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-3xl font-black text-green-600">{facilityInHand.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">At Facility Site</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Resource Units: {facilityName}</h2>
            <Badge variant="secondary" className="px-3 py-1">Active Monitoring</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStock.map((item) => (
              <Card key={item.id} className="relative overflow-hidden group hover:shadow-lg transition-all border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                  </div>
                  <CardDescription className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">{item.facility}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-primary">{item.currentStock.toLocaleString()}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">In Hand</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                      <span>Supply Utilization</span>
                      <span>{Math.round((item.totalDispensed / item.totalReceived) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          item.currentStock < 500 ? "bg-orange-500" : "bg-primary"
                        )}
                        style={{ width: `${(item.currentStock / item.totalReceived) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{facilityName} Logistics Ledger</CardTitle>
            <CardDescription>Real-time audit of Warehouse deliveries and Peer distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Item</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Dispensed</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">{item.name}</TableCell>
                    <TableCell className="text-right font-mono">{item.totalReceived.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{item.totalDispensed.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary">{item.currentStock.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={item.currentStock < 500 ? 'destructive' : 'secondary'}>
                        {item.currentStock < 500 ? 'Low Stock' : 'Stable'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Inventory Logistics</h1>
          <p className="text-muted-foreground">Mbare Supply Chain - Warehouse to Facility Nodes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            Audit Logs
          </Button>
          <Button className="gap-2 bg-primary">
            <Plus className="h-4 w-4" />
            Stock Entry
          </Button>
        </div>
      </div>

      <Tabs defaultValue="matapi" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
          <TabsTrigger value="matapi" className="text-base font-bold">Matapi Youth Hub</TabsTrigger>
          <TabsTrigger value="edith" className="text-base font-bold">Edith Opperman Clinic</TabsTrigger>
        </TabsList>
        <TabsContent value="matapi">
          {renderFacilityInventory('Matapi Youth Hub')}
        </TabsContent>
        <TabsContent value="edith">
          {renderFacilityInventory('Edith Opperman Clinic')}
        </TabsContent>
      </Tabs>
    </div>
  )
}
