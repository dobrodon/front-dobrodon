"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ADRESS } from "@/lib/api/config";

export default function VerifyEmailPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Переход к следующему полю, если введена цифра
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Введите все 6 цифр кода");
      setIsLoading(false);
      return;
    }

    try {
      // Здесь будет логика проверки кода
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // После успешной проверки перенаправляем на главную страницу
      router.push("/");
    } catch (err) {
      setError("Неверный код подтверждения");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendMessage("");
    
    try {
      const response = await fetch(`${API_ADRESS}/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          full_name: "Коля",
          email: "kozacenkonikolaj237@gmail.com"
        }),
      });

      const data = await response.json();
      setResendMessage(data.message);
    } catch (err) {
      setResendMessage("Ошибка при отправке кода");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white">Подтверждение email</h2>
            <p className="text-blue-100 mt-1">
              Введите код подтверждения, отправленный на ваш email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Код подтверждения *
              </label>
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    disabled={isLoading}
                  />
                ))}
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-2 ml-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.some(digit => !digit)}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                isLoading || code.some(digit => !digit)
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "Проверка..." : "Подтвердить"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className={`text-sm text-blue-600 hover:text-blue-700 font-medium ${
                  isResending ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isResending ? "Отправка..." : "Отправить код повторно"}
              </button>
              {resendMessage && (
                <p className="text-sm text-green-600 mt-2">{resendMessage}</p>
              )}
            </div>

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
    </div>
  );
} 