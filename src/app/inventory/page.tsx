
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { INITIAL_STOCK } from '@/lib/store'
import { Plus, History, ArrowDownToLine, ArrowUpToLine, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function InventoryPage() {
  const [stock] = useState(INITIAL_STOCK);

  const totalReceived = stock.reduce((acc, item) => acc + item.totalReceived, 0);
  const totalDispensed = stock.reduce((acc, item) => acc + item.totalDispensed, 0);
  const totalInHand = stock.reduce((acc, item) => acc + item.currentStock, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Inventory Logistics</h1>
          <p className="text-muted-foreground">Warehouse to Facility nodes (Matapi & Edith Opperman) Supply Chain</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            View Ledger
          </Button>
          <Button className="gap-2 bg-primary">
            <Plus className="h-4 w-4" />
            Inbound Stock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4 text-primary" />
              Total Received
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-black text-primary">{totalReceived.toLocaleString()}</p>
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
            <p className="text-3xl font-black text-accent">{totalDispensed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">To Peers (Field)</p>
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
            <p className="text-3xl font-black text-green-600">{totalInHand.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">At Facility Nodes</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Stock Items in Hand</h2>
          <Badge variant="secondary" className="px-3 py-1">Active Monitoring</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stock.map((item) => (
            <Card key={item.id} className="relative overflow-hidden group hover:shadow-lg transition-all border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">{item.ward}</Badge>
                </div>
                <CardDescription className="text-[10px] font-medium text-muted-foreground">{item.facility}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-primary">{item.currentStock.toLocaleString()}</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase">Units In Hand</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                    <span>Utilization</span>
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
          <CardTitle>Global Supply Chain Ledger</CardTitle>
          <CardDescription>Detailed transaction tracking from Warehouse through Facility nodes to Field distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Item</TableHead>
                <TableHead>Facility Node</TableHead>
                <TableHead>Target Ward</TableHead>
                <TableHead className="text-right">Received (Whse)</TableHead>
                <TableHead className="text-right">Dispensed (Peers)</TableHead>
                <TableHead className="text-right">In Hand</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold">{item.name}</TableCell>
                  <TableCell className="text-xs">{item.facility}</TableCell>
                  <TableCell>{item.ward}</TableCell>
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
  )
}
