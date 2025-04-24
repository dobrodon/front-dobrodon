"use client"
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import Image from "next/image";
import Link from "next/link";
import { SparklesIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { API_ADRESS } from '@/lib/api/config';

interface Organization {
  id: number;
  name: string;
  inn: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  category: string;
}

const categories = ["Все", "Питание", "Здоровье", "Одежда"];

export default function PartnersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${API_ADRESS}/organizations`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке организаций');
        }

        const data = await response.json();
        setOrganizations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
        console.error('Ошибка:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const filtered = organizations.filter(org =>
        org.name.toLowerCase().includes(term.toLowerCase()) &&
        (selectedCategory === "Все" || org.category === selectedCategory)
      );
      setOrganizations(filtered);
    }, 300),
    [selectedCategory, organizations]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const filtered = organizations.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "Все" || org.category === category)
    );
    setOrganizations(filtered);
  };

  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }
  }, []);

  const isAuthorized = userRole === 'volunteer' || userRole === 'admin' || userRole === 'organization';



  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (

    
    <div>
      <nav className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-2xl font-bold text-blue-600">
                <SparklesIcon className="h-8 w-8 mr-2" />
                Добродон
              </Link>
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Главная</Link>
              {!isAuthorized && (
                <Link href="/register" className="text-gray-700 hover:text-blue-600">Регистрация организации</Link>
              )}
              <Link 
                href={isAuthorized ? "/cabinet" : "/autorize"} 
                className="text-gray-700 hover:text-blue-600"
              >
                {isAuthorized ? "Личный кабинет" : "Вход"}
              </Link>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-sm">
            <div className="space-y-4 px-4 py-4">
              <Link href="/" className="block text-gray-700 hover:text-blue-600">Главная</Link>
              {!isAuthorized && (
                <Link href="/register" className="block text-gray-700 hover:text-blue-600">Регистрация организации</Link>
              )}
              <Link 
                href={isAuthorized ? "/cabinet" : "/autorize"} 
                className="block text-gray-700 hover:text-blue-600"
              >
                {isAuthorized ? "Личный кабинет" : "Вход"}
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Организации-партнёры
        </h1>


        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по названию организации"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-4 h-20">
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {org.name}
                  </h2>
                </div>
                <div className="mb-4 h-24">
                  <p className="text-gray-600 line-clamp-3">{org.description}</p>
                </div>
                <div className="mb-4 h-8">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {org.category}
                  </span>
                </div>
                <div className="h-12">
                  <p className="text-gray-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="line-clamp-2">{org.address}</span>
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  onClick={() => {
                    // Handle "Подробнее" click
                    console.log(`View details for ${org.name}`);
                  }}
                >
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    
  );
}
