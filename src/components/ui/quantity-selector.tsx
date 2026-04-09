"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  quantity: number
  max: number
  onChange: (val: number) => void
  primaryColor?: string
}

export function QuantitySelector({ quantity, max, onChange, primaryColor = "#0a192f" }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(Math.max(1, quantity - 1));
        }}
        className="h-8 w-8 rounded-full border border-red-500 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors relative z-10"
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-lg font-bold min-w-[1.5rem] text-center">{quantity}</span>
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(Math.min(max, quantity + 1));
        }}
        className="h-8 w-8 rounded-full border border-red-500 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors relative z-10"
        disabled={quantity >= max}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
