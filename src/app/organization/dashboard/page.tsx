"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SparklesIcon, UserIcon, GiftIcon, UsersIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface Volunteer {
  id: string;
  fullName: string;
  email: string;
  date: string;
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
];

const categories = ["Питание", "Здоровье", "Одежда"];

export default function OrganizationDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('обзор');
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [organization, setOrganization] = useState<Organization>(mockOrganization);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Organization>(mockOrganization);
  const [editErrors, setEditErrors] = useState<Partial<Organization>>({});

  const usedBonusesCount = volunteers.filter(v => v.id !== "").length;

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
                        onClick={() => setActiveTab(item.name.toLowerCase())}
                        className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === item.name.toLowerCase()
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
          </main>
        </div>
      </div>
    </div>
  );
}