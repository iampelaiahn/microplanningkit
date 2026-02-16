
"use client"

import React from 'react'

interface StockCircularProgressProps {
  value: number;
  max: number;
  label: string;
}

export function StockCircularProgress({ value, max, label }: StockCircularProgressProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <circle
            className="text-muted stroke-current"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className="text-primary stroke-current transition-all duration-1000 ease-in-out glow-cyan"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-xs text-muted-foreground">{value} / {max} units</span>
    </div>
  )
}
