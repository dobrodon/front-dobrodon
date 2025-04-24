"use client"
import Image from "next/image";
import Link from "next/link";
import { SparklesIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { fetchOrganizations } from "@/lib/api/import";
import { shuffle } from "lodash";

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [organizations, setOrganizations] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }

    async function loadOrganizations() {
      const orgs = await fetchOrganizations();
      const shuffledOrgs = shuffle(orgs).slice(0, 4);
      setOrganizations(shuffledOrgs);
    }

    loadOrganizations();
  }, []);

  const isAuthorized = userRole === 'volunteer' || userRole === 'admin' || userRole === 'organization';

  return (
    <div className="min-h-screen bg-white">
      {/* Навигационная панель */}
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

      {/* Hero секция */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Начните свой путь инноваций с Добродон
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Найдите организацию. Используйте бонусы. Предложите свои услуги.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Зарегистрировать организацию
              </Link>
              <Link href="/partners" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors">
                Использовать бонусы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Секция партнеров */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Наши партнеры</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {organizations.map((org, index) => (
              <div key={index} className="bg-white h-20 flex items-center justify-center rounded-lg shadow-sm text-gray-800">
                {org}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">О нас</h3>
              <ul className="space-y-2">
                <li><Link href="/team" className="hover:text-blue-400">Команда</Link></li>
              </ul>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-blue-400">Связаться с нами</Link></li>
              </ul>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Социальные сети</h3>
              <ul className="space-y-2">
                <li><Link href="https://vk.com/y.vasilchenko" className="hover:text-blue-400">ВКонтакте</Link></li>
                <li><Link href="https://t.me/aip_fikita" className="hover:text-blue-400">Телеграм</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>© 2025 Добродон. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
