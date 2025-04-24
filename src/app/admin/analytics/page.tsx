"use client"
import { SparklesIcon, ShieldCheckIcon, ChartBarIcon, UserGroupIcon, CalendarIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      router.push("/");
    }
  }, [router]);

  // Пример данных - в реальном приложении они будут приходить из API
  const stats = {
    totalUsers: 1250,
    activeVolunteers: 850,
    activeOrganizations: 120,
    totalEvents: 45,
    upcomingEvents: 12,
    completedEvents: 33
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
            <div className="flex items-center">
              <Link href="/cabinet" className="text-gray-600 hover:text-gray-900">
                Назад в кабинет
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Аналитика</h1>
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-gray-600">Администратор</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-green-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Активных волонтеров</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeVolunteers}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-8 w-8 text-purple-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Активных организаций</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeOrganizations}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-yellow-500 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего мероприятий</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
                </div>
              </div>
            </div>
          </div>


          {/* История использования бонусов */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">История использования бонусов</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Бонус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата использования</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      id: 1,
                      user: "Иван Петров",
                      bonus: "Скидка 10% в кафе",
                      date: "2024-03-15"
                    },
                    {
                      id: 2,
                      user: "ООО Помощь",
                      bonus: "Бесплатный вход в музей",
                      date: "2024-03-14"
                    },
                    {
                      id: 3,
                      user: "Алексей Сидоров",
                      bonus: "Скидка 15% на курсы",
                      date: "2024-03-13"
                    }
                  ].map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.bonus}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString('ru-RU')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}