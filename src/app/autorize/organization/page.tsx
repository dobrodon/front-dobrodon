"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_ADRESS } from "@/lib/api/config";

interface OrganizationLoginData {
  name: string;
  email: string;
  password: string;
}

interface LoginErrors extends Partial<OrganizationLoginData> {
  submit?: string;
}

export const OrganizationLoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<OrganizationLoginData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OrganizationLoginData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: LoginErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название организации обязательно";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Пароль обязателен";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_ADRESS}/login`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка при авторизации');
        }

        const data = await response.json();
        console.log('Успешная авторизация:', data);
        
        // Сохраняем токен в localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('userRole', 'organization');
        
        router.push("/");
      } catch (error) {
        console.error('Ошибка при авторизации:', error);
        setErrors({ submit: error instanceof Error ? error.message : 'Произошла ошибка при авторизации' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white">Авторизация организации</h2>
          <p className="text-blue-100 mt-1">Введите данные для входа</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название организации *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ООО 'Пример'"
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="corp@example.com"
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Авторизация..." : "Войти"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium transition duration-200"
            >
              ← Вернуться в главное меню
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 