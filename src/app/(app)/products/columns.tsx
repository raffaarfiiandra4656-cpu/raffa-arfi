"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Product = {
  id: string
  sku: string
  name: string
  current_stock: number
  status: string
  category: { name: string } | null
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "Produk",
    cell: ({ row }) => {
      const category = row.original.category?.name || 'Tanpa Kategori'
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("name")}</span>
          <span className="text-xs text-muted-foreground">{category}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "current_stock",
    header: "Stok",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      let variant: "default" | "secondary" | "destructive" | "outline" = "default"
      
      if (status === "Low Stock") variant = "secondary"
      if (status === "Out Of Stock") variant = "destructive"
      
      const labelMap: Record<string, string> = {
        "In Stock": "Tersedia",
        "Low Stock": "Stok Rendah",
        "Out Of Stock": "Stok Habis"
      }

      return (
        <Badge variant={variant} className={status === "Low Stock" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : ""}>
          {labelMap[status] || status}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          {/* @ts-ignore */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.sku)}
            >
              Salin SKU
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Lihat detail</DropdownMenuItem>
            <DropdownMenuItem>Edit produk</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
