import { NextRequest, NextResponse } from 'next/server';
import { API_ADRESS } from './config';

interface ImportData {
  fullName: string;
  inn: string;
  phone: string;
  email: string;
  birthDate: string;
  achievements: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не был загружен' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(buffer);

    // Отправляем файл на бэкенд
    const response = await fetch(`${API_ADRESS}/api/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке файла на сервер');
    }

    const result = await response.json();

    return NextResponse.json({
      message: 'Данные успешно импортированы',
      result,
    });
  } catch (error) {
    console.error('Ошибка при обработке файла:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обработке файла' },
      { status: 500 }
    );
  }
}

export interface Organization {
  id: number;
  name: string;
  inn: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  category: string;
}

export async function fetchOrganizations(): Promise<string[]> {
  try {
    const response = await fetch(`${API_ADRESS}/organizations`);

    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }

    const organizations: Organization[] = await response.json();
    return organizations.map(org => org.name);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
}