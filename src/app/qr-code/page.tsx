"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { SparklesIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function QRCodePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [qrData, setQrData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      setQrData(decodeURIComponent(data));
    } else {
      setError('QR код не найден');
    }
  }, [searchParams]);

  const handleDownload = () => {
    if (!qrData) return;
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-2xl font-bold text-blue-600">
                <SparklesIcon className="h-8 w-8 mr-2" />
                Добродон
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Вернуться назад
            </button>
            <h1 className="text-2xl font-bold text-gray-800">QR-код</h1>
          </div>
          
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : qrData ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <QRCodeCanvas
                  value={qrData}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Скачать QR-код
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 