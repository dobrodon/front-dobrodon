"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { SparklesIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { API_ADRESS } from '@/lib/api/config';

interface QRResponse {
  hash_value: string;
  created_at: string;
  created_by: string;
  rating: number;
  message: string;
  id: number;
}

export default function QRCodePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [qrData, setQrData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrResponse, setQrResponse] = useState<QRResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('volunteer_email');
    if (storedEmail) {
      generateQRHash(storedEmail);
    } else {
      setError('Email не найден. Пожалуйста, авторизуйтесь.');
    }
  }, []);

  const generateQRHash = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_ADRESS}/generate-qr-hash?person_email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при генерации QR-хеша');
      }

      const data = await response.json();
      setQrResponse(data);
      
      // Create QR data with only the hash value
      setQrData(data.hash_value);
    } catch (err) {
      setError('Ошибка при генерации QR-хеша');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrData) return;
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Create a temporary canvas with optimal size
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) return;
      
      // Set optimal size for scanning
      const size = 512;
      tempCanvas.width = size;
      tempCanvas.height = size;
      
      // Clear with white background
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, size, size);
      
      // Draw the QR code with high quality
      tempCtx.imageSmoothingEnabled = false;
      tempCtx.drawImage(canvas, 0, 0, size, size);
      
      // Add a white border
      const borderSize = 20;
      tempCtx.strokeStyle = '#ffffff';
      tempCtx.lineWidth = borderSize;
      tempCtx.strokeRect(0, 0, size, size);
      
      // Convert to PNG with maximum quality
      const pngUrl = tempCanvas
        .toDataURL("image/png", 1.0)
        .replace("image/png", "image/octet-stream");
      
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleClearEmail = () => {
    localStorage.removeItem('volunteer_email');
    setQrResponse(null);
    setError('Email удален. Пожалуйста, отсканируйте QR-код снова.');
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
                  size={512}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  marginSize={4}
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : qrResponse ? (
                <div className="text-center space-y-2">
                  <p className="text-green-600">{qrResponse.message}</p>
                  <p className="text-sm text-gray-600">Хеш: {qrResponse.hash_value}</p>
                  <p className="text-sm text-gray-600">Создан: {new Date(qrResponse.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Создатель: {qrResponse.created_by}</p>
                  <p className="text-sm text-gray-600">Рейтинг: {qrResponse.rating}</p>
                  <p className="text-sm text-gray-600">ID: {qrResponse.id}</p>
                </div>
              ) : null}
              
              <div className="flex space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Скачать QR-код
                </button>
                <button
                  onClick={handleClearEmail}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Очистить email
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
