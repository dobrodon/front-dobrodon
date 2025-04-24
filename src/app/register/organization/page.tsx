"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_ADRESS } from "@/lib/api/config";

interface OrganizationLoginData {
  name: string;
  email: string;
  password: string;
  hashed_password: string;
  phone: string;
  address: string;
  inn: string;
  description: string;
  submit?: string;
  category: string;
  code: string;
}

const categories = ["Питание", "Здоровье", "Одежда"];

export const OrganizationLoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<OrganizationLoginData>({
    name: "",
    email: "",
    password: "",
    hashed_password: "",
    phone: "",
    address: "",
    inn: "",
    description: "",
    category: "",
    code: "test", // Default code for testing
  });

  const [errors, setErrors] = useState<Partial<OrganizationLoginData>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Для ИНН разрешаем только цифры
    if (name === "inn") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof OrganizationLoginData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<OrganizationLoginData> = {};

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (formData.password !== formData.hashed_password) {
      newErrors.hashed_password = "Пароли не совпадают";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Неверный формат телефона";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Адрес обязателен";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание компании обязательно";
    }

    if (!formData.inn.trim()) {
      newErrors.inn = "ИНН обязателен";
    } else if (!validateInn(formData.inn)) {
      newErrors.inn = "ИНН должен содержать 10 или 12 цифр";
    }

    if (!formData.category) {
      newErrors.category = "Категория обязательна";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        console.log('Sending registration request with data:', {
          email: formData.email,
          name: formData.name,
          inn: formData.inn,
          phone: formData.phone,
          hashed_password: formData.password,
          address: formData.address,
          description: formData.description,
          category: formData.category,
          code: formData.code,
        });

        const response = await fetch(`${API_ADRESS}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            inn: formData.inn,
            phone: formData.phone,
            hashed_password: formData.password,
            address: formData.address,
            description: formData.description,
            category: formData.category,
            code: formData.code,
          }),
        });

        console.log('Registration response status:', response.status);
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let errorData;
        try {
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          errorData = {};
        }

        if (!response.ok) {
          console.error('Registration error response:', errorData);
          const errorMessage = errorData.detail?.[0]?.msg || errorData.message || `Ошибка при регистрации (${response.status})`;
          throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText);
        console.log('Успешная регистрация:', data);
        
        // Сохраняем токен и роль в localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('userRole', 'organization');
        localStorage.setItem('userEmail', data.email);
        
        router.push("/");
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          setErrors({ submit: 'Сервер недоступен. Пожалуйста, попробуйте позже.' });
        } else if (error instanceof Error) {
          setErrors({ submit: error.message });
        } else {
          setErrors({ submit: 'Произошла ошибка при регистрации. Проверьте подключение к серверу.' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white">Регистрация организации</h2>
          <p className="text-blue-100 mt-1">Заполните все поля для регистрации</p>
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
              ИНН *
            </label>
            <input
              type="text"
              name="inn"
              value={formData.inn}
              onChange={handleChange}
              placeholder="1234567890"
              maxLength={12}
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.inn ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.inn && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.inn}</p>
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
              Телефон *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 999-99-99"
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.phone}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Адрес *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="г. Москва, ул. Примерная, д. 1"
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.address ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.address}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              О компании *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите деятельность вашей компании..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none`}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.description}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.category ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.category}</p>
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

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтверждение пароля *
            </label>
            <input
              type="password"
              name="hashed_password"
              value={formData.hashed_password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.hashed_password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.hashed_password && (
              <p className="text-sm text-red-500 mt-2 ml-1">{errors.hashed_password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
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