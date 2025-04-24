'use client';

import { useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { API_ADRESS } from '@/lib/api/config';
import { useEffect } from "react";
import { useRouter } from "next/navigation";


interface ImportData {
  fullName: string;
  inn: string;
  phone: string;
  email: string;
  birthDate: string;
  achievements: string;
}

export default function ImportPage() {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/");
    }
  }, [router]);


  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_ADRESS}/upload-csv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке файла');
      }

      const result = await response.json();
      setMessage({ type: 'success', text: 'Файл успешно загружен' });
      setFile(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Произошла ошибка при загрузке файла' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Импорт данных из CSV</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Требования к файлу:</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Формат: CSV</li>
              <li>Кодировка: UTF-8</li>
              <li>Разделитель: запятая (,)</li>
              <li>Структура: ФИО, ИНН, Номер телефона, Электронная почта, Дата рождения, Достижения</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
                  </p>
                  <p className="text-xs text-gray-500">CSV файл</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {file && (
              <div className="text-sm text-gray-600">
                Выбран файл: {file.name}
              </div>
            )}

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || isLoading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                !file || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Загрузка...' : 'Загрузить файл'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 