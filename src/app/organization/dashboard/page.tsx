"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SparklesIcon, UserIcon, GiftIcon, UsersIcon, ClockIcon, Cog6ToothIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { API_ADRESS } from '@/lib/api/config';
import jsQR from 'jsqr';  
import axios from 'axios';

interface Volunteer {
  id: string;
  fullName: string;
  email: string;
  date: string;
}

interface Bonus {
  id: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

interface Organization {
  name: string;
  email: string;
  phone: string;
  category: string;
  address?: string;
  about?: string;
  inn?: string;
}

interface BonusErrors {
  description?: string;
  discountPercentage?: string;
  startDate?: string;
  endDate?: string;
}

interface QRCodeData {
  hash_value: string;
  created_at: string;
  created_by: string;
  rating: number;
  message: string;
  id: number;
}

const mockOrganization: Organization = {
  name: 'ООО "Донмак"',
  email: "help@example.com",
  phone: "+7 (999) 123-45-67",
  category: "Питание",
  address: "г. Москва, ул. Примерная, д. 1",
  about: "Организация, занимающаяся благотворительностью и помощью нуждающимся",
  inn: "1234567890"
};

const mockVolunteers: Volunteer[] = [
  {
    id: "1",
    fullName: "Иванов Иван Иванович",
    email: "ivanov@example.com",
    date: "2024-03-15",
  },
  {
    id: "2",
    fullName: "Петрова Мария Сергеевна",
    email: "petrova@example.com",
    date: "2024-03-14",
  },
  {
    id: "3",
    fullName: "Сидоров Алексей Петрович",
    email: "sidorov@example.com",
    date: "2024-03-13",
  },
  {
    id: "4",
    fullName: "Козлова Елена Дмитриевна",
    email: "kozlova@example.com",
    date: "2024-03-12",
  },
  {
    id: "5",
    fullName: "Михайлов Дмитрий Алексеевич",
    email: "mikhailov@example.com",
    date: "2024-03-11",
  },
];

const navigationItems = [
  { name: 'Обзор', icon: SparklesIcon, href: '#overview' },
  { name: 'Профиль', icon: UserIcon, href: '#profile' },
  { name: 'История', icon: ClockIcon, href: '#history' },
  { name: 'Бонусы', icon: GiftIcon, href: '#bonuses' },
  { name: 'Отсканировать QR-код', icon: QrCodeIcon, href: '#scan' },
];

const categories = ["Питание", "Здоровье", "Одежда"];

const fetchQrHashData = async (): Promise<QRCodeData[]> => {
  try {
    const response = await axios.post(`${API_ADRESS}/check-qr-hash`, {}); // Замените {} на данные для запроса
    return response.data as QRCodeData[];
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    return [];
  }
};

export default function OrganizationDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('обзор');
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [organization, setOrganization] = useState<Organization>(mockOrganization);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Organization>(mockOrganization);
  const [editErrors, setEditErrors] = useState<Partial<Organization>>({});
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState<QRCodeData | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [newBonus, setNewBonus] = useState<Bonus>({
    id: '',
    description: '',
    discountPercentage: 0,
    startDate: '',
    endDate: ''
  });
  const [bonusErrors, setBonusErrors] = useState<BonusErrors>({});
  const [qrData, setQrData] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);

  const usedBonusesCount = volunteers.filter(v => v.id !== "").length;

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "organization") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchQrHashData();
      setQrData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone.replace(/\s+/g, ""));
  };

  const validateInn = (inn: string) => {
    const re = /^[0-9]{10}$|^[0-9]{12}$/;
    return re.test(inn.replace(/\s+/g, ""));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "inn") {
      const numericValue = value.replace(/\D/g, "");
      setEditFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (editErrors[name as keyof Organization]) {
      setEditErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Organization> = {};

    if (!editFormData.name.trim()) {
      newErrors.name = "Название организации обязательно";
    }

    if (!editFormData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!validateEmail(editFormData.email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!editFormData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    } else if (!validatePhone(editFormData.phone)) {
      newErrors.phone = "Неверный формат телефона";
    }

    if (!editFormData.address?.trim()) {
      newErrors.address = "Адрес обязателен";
    }

    if (!editFormData.about?.trim()) {
      newErrors.about = "Описание компании обязательно";
    }

    if (!editFormData.inn?.trim()) {
      newErrors.inn = "ИНН обязателен";
    } else if (!validateInn(editFormData.inn)) {
      newErrors.inn = "ИНН должен содержать 10 или 12 цифр";
    }

    if (!editFormData.category) {
      newErrors.category = "Категория обязательна";
    }

    setEditErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setOrganization(editFormData);
      setIsEditing(false);
    }
  };

  const handleScanClick = () => {
    setActiveTab('scan');
    setIsScanModalOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous results
    setScanResult(null);
    setScanError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setScanError("Пожалуйста, выберите файл изображения");
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setScanError("Не удалось создать контекст для обработки изображения");
        return;
      }

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0);

      try {
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Try to decode QR code with different options
        const qrCode = jsQR(
          imageData.data,
          imageData.width,
          imageData.height,
          {
            inversionAttempts: "attemptBoth"
          }
        );

        if (qrCode) {
          console.log("Raw QR code data:", qrCode.data);
          try {
            // Parse QR code data
            const qrData = JSON.parse(qrCode.data) as QRCodeData;
            
            // Validate required fields
            if (!qrData.hash_value || !qrData.created_at || !qrData.created_by) {
              throw new Error("Неверный формат данных QR-кода");
            }

            // Format the date for display
            const formattedDate = new Date(qrData.created_at).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            setScanResult({
              ...qrData,
              created_at: formattedDate
            });
            setScanError(null);
            console.log("QR-код успешно распознан:", qrData);
          } catch (error) {
            console.error("Ошибка при парсинге QR-кода:", error);
            console.error("Сырые данные QR-кода:", qrCode.data);
            setScanError("Неверный формат данных в QR-коде. Проверьте, что QR-код содержит правильные данные.");
          }
        } else {
          console.log("Не удалось распознать QR-код. Размер изображения:", canvas.width, "x", canvas.height);
          setScanError("Не удалось распознать QR-код на изображении. Убедитесь, что:\n" +
            "1. Изображение четкое и хорошо освещено\n" +
            "2. QR-код занимает значительную часть изображения\n" +
            "3. QR-код не поврежден и не искажен");
        }
      } catch (error) {
        console.error("Ошибка при обработке изображения:", error);
        setScanError("Ошибка при обработке изображения. Попробуйте другое изображение.");
      }
    };

    img.onerror = () => {
      setScanError("Ошибка при загрузке изображения");
    };

    img.src = URL.createObjectURL(file);
  };

  const handleBonusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: BonusErrors = {};

    if (!newBonus.description.trim()) {
      newErrors.description = "Описание обязательно";
    }

    if (typeof newBonus.discountPercentage !== 'number' || newBonus.discountPercentage <= 0 || newBonus.discountPercentage > 100) {
      newErrors.discountPercentage = "Процент скидки должен быть от 1 до 100";
    }

    if (!newBonus.startDate) {
      newErrors.startDate = "Дата начала обязательна";
    }

    if (!newBonus.endDate) {
      newErrors.endDate = "Дата окончания обязательна";
    }

    if (newBonus.startDate && newBonus.endDate && newBonus.startDate > newBonus.endDate) {
      newErrors.endDate = "Дата окончания должна быть позже даты начала";
    }

    setBonusErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const bonusWithId = {
        ...newBonus,
        id: Date.now().toString()
      };
      setBonuses([...bonuses, bonusWithId]);
      setNewBonus({
        id: '',
        description: '',
        discountPercentage: 0,
        startDate: '',
        endDate: ''
      });
      setIsBonusModalOpen(false);
    }
  };

  const handleBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBonus(prev => ({
      ...prev,
      [name]: name === 'discountPercentage' ? (parseInt(value) || 0) as number : value
    }));
    if (bonusErrors[name as keyof BonusErrors]) {
      setBonusErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
              <p className="mt-1 text-sm text-gray-500">Добро пожаловать, {organization.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <nav className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          if (item.name === 'Отсканировать QR-код') {
                            handleScanClick();
                          } else {
                            setActiveTab(item.name.toLowerCase());
                          }
                        }}
                        className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          activeTab === item.name.toLowerCase()
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          <main className="flex-1">
            {activeTab === 'обзор' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Волонтёров использовали бонусы</h3>
                      <p className="mt-1 text-3xl font-semibold text-blue-600">
                        {usedBonusesCount} человек(а)
                      </p>
                    </div>

                  </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Последние волонтёры</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {volunteers.map((volunteer) => (
                      <div key={volunteer.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{volunteer.fullName}</p>
                            <p className="text-sm text-gray-500">{volunteer.email}</p>
                          </div>
                          <div className="text-right">

                            <p className="text-sm text-gray-500">{formatDate(volunteer.date)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'профиль' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Профиль организации</h3>
                </div>
                {!isEditing ? (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Название</label>
                      <p className="mt-1 text-sm text-gray-900">{organization.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{organization.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Телефон</label>
                      <p className="mt-1 text-sm text-gray-900">{organization.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Категория</label>
                      <p className="mt-1 text-sm text-gray-900">{organization.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Адрес</label>
                      <p className="mt-1 text-sm text-gray-900">{organization.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">О компании</label>
                      <p className="mt-1 text-sm text-gray-900">{organization.about}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ИНН</label>
                      <p className="mt-1 text-sm text-gray-900">{organization.inn}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditFormData(organization);
                        setIsEditing(true);
                      }}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Редактировать
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Название организации *</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${editErrors.name ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                      />
                      {editErrors.name && <p className="text-sm text-red-500 mt-2 ml-1">{editErrors.name}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">ИНН *</label>
                      <input
                        type="text"
                        name="inn"
                        value={editFormData.inn}
                        onChange={handleEditChange}
                        maxLength={12}
                        className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${editErrors.inn ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                      />
                      {editErrors.inn && <p className="text-sm text-red-500 mt-2 ml-1">{editErrors.inn}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${editErrors.email ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                      />
                      {editErrors.email && <p className="text-sm text-red-500 mt-2 ml-1">{editErrors.email}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${editErrors.phone ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                      />
                      {editErrors.phone && <p className="text-sm text-red-500 mt-2 ml-1">{editErrors.phone}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Адрес *</label>
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${editErrors.address ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                      />
                      {editErrors.address && <p className="text-sm text-red-500 mt-2 ml-1">{editErrors.address}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">О компании *</label>
                      <textarea
                        name="about"
                        value={editFormData.about}
                        onChange={handleEditChange}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${editErrors.about ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                      />
                      {editErrors.about && <p className="text-sm text-red-500 mt-2 ml-1">{editErrors.about}</p>}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditChange}
                        className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${editErrors.category ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {editErrors.category && <p className="text-sm text-red-500 mt-2 ml-1">{editErrors.category}</p>}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'история' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">История посещений</h3>
                  <p className="mt-1 text-sm text-gray-500">Все волонтёры, посетившие организацию</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {volunteers.map((volunteer) => {
                    // Извлекаем имя (второе слово) из полного ФИО
                    const nameParts = volunteer.fullName.split(' ');
                    const firstName = nameParts.length > 1 ? nameParts[1] : volunteer.fullName;

                    // Определяем название бонуса на основе категории организации
                    const bonusName = organization.category === "Питание" ? "Обед" :
                      organization.category === "Здоровье" ? "Медосмотр" :
                        "Комплект одежды";

                    return (
                      <div key={volunteer.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{firstName}</p>
                            <p className="text-sm text-gray-500">Получен бонус: {bonusName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{formatDate(volunteer.date)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'бонусы' && (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-xl font-semibold text-gray-900">Управление бонусами</h3>
      <button
        onClick={() => setIsBonusModalOpen(true)}
        className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        <GiftIcon className="h-5 w-5 mr-2" />
        Создать бонус
      </button>
    </div>

    <div className="p-6">
      {bonuses.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <GiftIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-lg font-medium">Нет активных бонусов</p>
          <p className="text-sm mt-1">Создайте первый бонус для вашей организации</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bonuses.map((bonus) => (
            <div key={bonus.id} className="border border-gray-200 rounded-xl shadow hover:shadow-md transition p-5 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold text-gray-900">{bonus.description}</h4>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {bonus.discountPercentage}%
                </span>
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                {formatDate(bonus.startDate)} – {formatDate(bonus.endDate)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

            {isBonusModalOpen && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 ease-out">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Создание бонуса</h3>
                      <button
                        onClick={() => setIsBonusModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleBonusSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание *</label>
                        <input
                          type="text"
                          name="description"
                          value={newBonus.description}
                          onChange={handleBonusChange}
                          placeholder="Например: Скидка на обед"
                          className={`w-full px-4 py-2.5 rounded-lg border ${
                            bonusErrors.description ? 'border-red-400' : 'border-gray-200'
                          } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors`}
                        />
                        {bonusErrors.description && (
                          <p className="mt-1.5 text-sm text-red-600">{bonusErrors.description}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Процент скидки *</label>
                        <div className="relative">
                          <input
                            type="number"
                            name="discountPercentage"
                            value={newBonus.discountPercentage}
                            onChange={handleBonusChange}
                            min="1"
                            max="100"
                            placeholder="10"
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              bonusErrors.discountPercentage ? 'border-red-400' : 'border-gray-200'
                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors`}
                          />
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                            %
                          </div>
                        </div>
                        {bonusErrors.discountPercentage && (
                          <p className="mt-1.5 text-sm text-red-600">{bonusErrors.discountPercentage}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала *</label>
                          <input
                            type="date"
                            name="startDate"
                            value={newBonus.startDate}
                            onChange={handleBonusChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              bonusErrors.startDate ? 'border-red-400' : 'border-gray-200'
                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors`}
                          />
                          {bonusErrors.startDate && (
                            <p className="mt-1.5 text-sm text-red-600">{bonusErrors.startDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания *</label>
                          <input
                            type="date"
                            name="endDate"
                            value={newBonus.endDate}
                            onChange={handleBonusChange}
                            className={`w-full px-4 py-2.5 rounded-lg border ${
                              bonusErrors.endDate ? 'border-red-400' : 'border-gray-200'
                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors`}
                          />
                          {bonusErrors.endDate && (
                            <p className="mt-1.5 text-sm text-red-600">{bonusErrors.endDate}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsBonusModalOpen(false)}
                          className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Отмена
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          Создать
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scan' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Сканирование QR-кода</h3>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <QrCodeIcon className="h-5 w-5 mr-2" />
                    Выбрать изображение
                  </button>
                  
                  {scanError && (
                    <p className="mt-4 text-sm text-red-600">{scanError}</p>
                  )}
                  
                  {scanResult && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                      <h4 className="text-lg font-medium text-green-800 mb-2">Информация из QR-кода:</h4>
                      <div className="space-y-2 text-left">
                        <p className="text-sm text-gray-600"><span className="font-medium">Хеш:</span> {scanResult.hash_value}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Создан:</span> {scanResult.created_at}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Создатель:</span> {scanResult.created_by}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Рейтинг:</span> {scanResult.rating}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">ID:</span> {scanResult.id}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Сообщение:</span> {scanResult.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      
      
    </div>
  );
}