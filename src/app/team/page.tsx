"use client";
import Image from "next/image";

export default function Team() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Наша команда</h1>
        <div className="text-center mb-8">
          <Image
            src="https://avatars.mds.yandex.net/get-images-cbir/401730/Ewk_OUlHY6Hvo8OyUERdwg137/ocr"
            alt="Наша команда"
            width={800}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          Слева направо: <br />
            <strong>Ярослав Евгеньевич</strong> - бекендер <br />
            <strong>Николай Максимович</strong> - фронтендер <br />
            <strong>Тимофей Денисович</strong> - фронтендер <br />
        </p>
      </div>
    </div>
  );
}
