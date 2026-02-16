
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { INITIAL_STOCK } from '@/lib/store'
import { Plus, History, ArrowDownToLine, ArrowUpToLine, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function InventoryPage() {
  const [stock] = useState(INITIAL_STOCK);

  const totalReceived = stock.reduce((acc, item) => acc + item.totalReceived, 0);
  const totalDispensed = stock.reduce((acc, item) => acc + item.totalDispensed, 0);
  const totalInHand = stock.reduce((acc, item) => acc + item.currentStock, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Inventory Logistics</h1>
          <p className="text-muted-foreground">Warehouse to Facility (Matapi & Edith Opperman) Supply Chain</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            View Ledger
          </Button>
          <Button className="gap-2">
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
            <p className="text-xs text-muted-foreground">From Central Warehouse</p>
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
            <p className="text-xs text-muted-foreground">To Peers via Wards</p>
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
            <p className="text-xs text-muted-foreground">Available at Facilities</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Stock Ledger</CardTitle>
          <CardDescription>Real-time tracking from Warehouse to Facility nodes and Peer distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Item</TableHead>
                <TableHead>Facility Node</TableHead>
                <TableHead>Target Ward</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead className="text-right">Dispensed</TableHead>
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
                  <TableCell className="text-right font-mono">{item.totalReceived}</TableCell>
                  <TableCell className="text-right font-mono">{item.totalDispensed}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-primary">{item.currentStock}</TableCell>
                  <TableCell>
                    <Badge variant={item.currentStock < 200 ? 'destructive' : 'secondary'}>
                      {item.currentStock < 200 ? 'Low Stock' : 'Stable'}
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
