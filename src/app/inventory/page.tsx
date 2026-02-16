
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { INITIAL_STOCK } from '@/lib/store'
import { Box, Plus, History, ArrowDownToLine, ArrowUpToLine } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function InventoryPage() {
  const [stock] = useState(INITIAL_STOCK);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Inventory Logistics</h1>
          <p className="text-muted-foreground">Manage service supply chains across Mbare Wards</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Active SKU Count</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-black">06</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Total Inbound (M-T-D)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-green-500" />
            <p className="text-2xl font-black">2,450</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Total Outbound (M-T-D)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center gap-2">
            <ArrowUpToLine className="h-5 w-5 text-accent" />
            <p className="text-2xl font-black">1,120</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/10 border-accent/20">
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-accent">Critical Restock</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-black text-accent">HIVST</p>
            <p className="text-xs font-medium">Ward 11 & 12</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Stock Ledger</CardTitle>
          <CardDescription>Real-time inventory levels synchronized from field submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Item</TableHead>
                <TableHead>Ward</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold">{item.name}</TableCell>
                  <TableCell>{item.ward}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={item.quantity < 300 ? 'destructive' : 'secondary'}>
                      {item.quantity < 300 ? 'Low Stock' : 'Good'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Adjust</Button>
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
