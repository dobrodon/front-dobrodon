"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_ADRESS } from "@/lib/api/config";

interface VolunteerLoginData {
  fullName: string;
  email: string;
}

export const VolunteerLoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<VolunteerLoginData>({
    fullName: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<VolunteerLoginData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof VolunteerLoginData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<VolunteerLoginData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "ФИО обязательно";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_ADRESS}/send-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            full_name: formData.fullName,
            email: formData.email
          }),
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке кода');
        }

        const data = await response.json();
        console.log("Вход волонтёра:", formData);
        router.push(`/register/verify?full_name=${encodeURIComponent(formData.fullName)}&email=${encodeURIComponent(formData.email)}`);
      } catch (err) {
        setErrors({ email: "Ошибка при отправке кода" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Успешный вход</h2>
          <p className="text-gray-700">Добро пожаловать, {formData.fullName}!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white">Вход для волонтёров</h2>
          <p className="text-blue-100 mt-1">Введите ФИО и email для входа</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Иванов Иван Иванович"
              className={`w-full px-4 py-3 rounded-lg border text-gray-800 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-sm text-red-500 mt-2 ml-1">{errors.fullName}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className={`w-full px-4 py-3 rounded-lg border text-gray-800 ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500 mt-2 ml-1">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Вход..." : "Войти"}
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