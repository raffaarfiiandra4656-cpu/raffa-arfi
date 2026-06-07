"use client"

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function ExportCSVButton({ data, filename }: { data: any[], filename: string }) {
  
  const handleExport = () => {
    if (!data || data.length === 0) return
    
    // Get headers
    const headers = Object.keys(data[0])
    
    // Convert data to CSV format
    const csvRows = []
    csvRows.push(headers.join(',')) // Add header row
    
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header]
        // Escape quotes
        const escaped = ('' + val).replace(/"/g, '\\"')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    }
    
    const csvString = csvRows.join('\n')
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `${filename}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" /> Export CSV
    </Button>
  )
}
