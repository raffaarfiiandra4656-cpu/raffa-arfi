"use client"

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Camera, X } from 'lucide-react'
import { toast } from 'sonner'

interface BarcodeScannerProps {
  onScan: (sku: string) => void
  label?: string
}

export function BarcodeScanner({ onScan, label = 'Scan Barcode / QR' }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (isScanning) {
      // Initialize scanner
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true
        },
        false
      )

      scannerRef.current.render(
        (decodedText) => {
          // On Success
          onScan(decodedText)
          toast.success(`Berhasil scan: ${decodedText}`)
          handleStopScan()
        },
        (error) => {
          // On Error (ignore frame errors)
        }
      )
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error("Failed to clear scanner", e))
        scannerRef.current = null
      }
    }
  }, [isScanning, onScan])

  const handleStopScan = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(e => console.error("Failed to clear scanner", e))
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  return (
    <div className="w-full">
      {!isScanning ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsScanning(true)}
          className="w-full h-12 rounded-xl border-dashed border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
        >
          <Camera className="w-5 h-5 mr-2" />
          {label}
        </Button>
      ) : (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-black relative">
          <Button 
            type="button" 
            variant="destructive" 
            size="icon"
            className="absolute top-2 right-2 z-50 rounded-full w-8 h-8"
            onClick={handleStopScan}
          >
            <X className="w-4 h-4" />
          </Button>
          <div id="qr-reader" className="w-full" style={{ border: 'none' }}></div>
        </div>
      )}
    </div>
  )
}
