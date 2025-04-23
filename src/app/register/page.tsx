"use client"
import { OrganizationLoginForm } from './organization/page';

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Регистрация организации</h1>
          <p className="text-gray-600">Заполните форму для регистрации</p>
        </div>

        <OrganizationLoginForm/>
      </div>
    </div>
  );
}; 