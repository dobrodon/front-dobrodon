"use client"

import { SparklesIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/");
    }
  }, [router]);



  // В реальном приложении данные будут загружаться из API
  const user = {
    id: parseInt(params.id),
    name: "Иван Петров",
    email: "ivan@example.com",
    role: "volunteer",
    registrationDate: "2024-01-15"
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
            <div className="flex items-center space-x-4">
              <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
                Назад к списку
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Редактирование пользователя</h1>
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-gray-600">Администратор</span>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={user.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={user.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Роль
              </label>
              <select
                id="role"
                name="role"
                defaultValue={user.role}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="volunteer">Волонтер</option>
                <option value="organization">Организация</option>
                <option value="admin">Администратор</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/users"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отмена
              </Link>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 