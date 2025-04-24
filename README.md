# Dobrodon Frontend

Это фронтенд-приложение на Next.js для проекта Dobrodon, построенное с использованием современных веб-технологий и оптимизированное для производительности.

## 🚀 Возможности

- Next.js 15 с App Router
- TypeScript для типобезопасности
- TailwindCSS для стилизации
- Генерация и сканирование QR-кодов
- Современные возможности React 19
- Интеграция с бэкенд-сервисами

## 📋 Требования

- Node.js (рекомендуется LTS версия)
- npm или yarn

## 🛠️ Установка

1. Клонируйте репозиторий:
```bash
git clone [repository-url]
cd front-dobrodon
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

## 🚀 Разработка

Запустите сервер разработки:

```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## 🔧 Конфигурация

Приложение настроено на подключение к бэкенд API по адресу:
```
http://26.233.92.17:8020
```

Вы можете изменить адрес API в файле `src/lib/api/config.ts` при необходимости.

## 📦 Доступные скрипты

- `npm run dev` - Запуск сервера разработки с Turbopack
- `npm run build` - Сборка приложения для продакшена
- `npm run start` - Запуск продакшен-сервера
- `npm run lint` - Запуск ESLint для проверки качества кода

## 🛠️ Технологический стек

- **Фреймворк**: Next.js 15
- **Язык**: TypeScript
- **Стилизация**: TailwindCSS
- **UI Компоненты**: Heroicons
- **QR-код**: qrcode.react, jsqr
- **Утилиты**: Lodash

## 📚 Документация

- [Документация Next.js](https://nextjs.org/docs)
- [Документация React](https://react.dev)
- [Документация TailwindCSS](https://tailwindcss.com/docs)

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для вашей функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Добавлена потрясающая функция'`)
4. Отправьте изменения в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - подробности смотрите в файле LICENSE.
