"use client"
import { useState } from 'react';
import VolunteerLoginForm from './volunter/page';
import { OrganizationLoginForm } from './organization/page';

export default function RegistrationPage() {
  const [isVolunteer, setIsVolunteer] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Авторизация</h1>
          <p className="text-gray-600">Выберите роль авторизации</p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setIsVolunteer(true)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isVolunteer
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Я волонтёр
          </button>
          <button
            onClick={() => setIsVolunteer(false)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !isVolunteer
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Я организация
          </button>
        </div>

        <div className="transform transition-all duration-300 ease-in-out">
          {isVolunteer ? <VolunteerLoginForm /> : <OrganizationLoginForm />}
        </div>
      </div>
    </div>
  );
}; 