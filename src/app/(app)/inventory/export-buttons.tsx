"use client"

import { Button } from '@/components/ui/button'
import { FileText, FileSpreadsheet } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export function ExportButtons({ transactions }: { transactions: any[] }) {

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text('Laporan Riwayat Inventaris', 14, 15)
    
    const tableData = transactions.map(t => [
      format(new Date(t.date), 'dd MMM yyyy, HH:mm', { locale: localeId }),
      t.products?.name || '-',
      t.type === 'IN' ? 'Masuk' : 'Keluar',
      t.quantity,
      t.after_stock,
      t.profiles?.full_name || 'Sistem'
    ])

    ;(doc as any).autoTable({
      head: [['Tanggal', 'Produk', 'Tipe', 'Kuantitas', 'Stok Akhir', 'Pengguna']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] } // indigo-600
    })

    doc.save(`Laporan_Inventaris_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`)
  }

  const handleExportExcel = () => {
    const excelData = transactions.map(t => ({
      'Tanggal': format(new Date(t.date), 'dd MMM yyyy, HH:mm', { locale: localeId }),
      'Produk': t.products?.name || '-',
      'SKU': t.products?.sku || '-',
      'Tipe': t.type === 'IN' ? 'Masuk' : 'Keluar',
      'Kuantitas': t.quantity,
      'Stok Sebelum': t.before_stock,
      'Stok Sesudah': t.after_stock,
      'Catatan': t.notes || '-',
      'Pengguna': t.profiles?.full_name || 'Sistem'
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat")
    
    // Auto-size columns roughly
    const wscols = [
      {wch: 20}, {wch: 25}, {wch: 15}, {wch: 10}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 20}, {wch: 15}
    ]
    worksheet['!cols'] = wscols

    XLSX.writeFile(workbook, `Laporan_Inventaris_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`)
  }

  return (
    <div className="flex gap-2 w-full md:w-auto">
      <Button variant="outline" onClick={handleExportExcel} className="flex-1 md:flex-none border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
        <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
      </Button>
      <Button variant="outline" onClick={handleExportPDF} className="flex-1 md:flex-none border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800">
        <FileText className="w-4 h-4 mr-2" /> PDF
      </Button>
    </div>
  )
}
