"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { XCircle, RefreshCcw } from "lucide-react";

function FailureContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    setErrorMessage(error || "Bilinmeyen bir hata oluştu");
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="mb-6">
          <XCircle className="w-24 h-24 text-red-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Ödeme Başarısız 😞
        </h1>
        
        <p className="text-gray-600 mb-4">
          Üzgünüz, ödemeniz tamamlanamadı.
        </p>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-red-700 font-medium">
            {errorMessage}
          </p>
        </div>

        {/* Possible Reasons */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">
            Olası Sebepler:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Kart bilgileri hatalı olabilir</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Kartınızda yeterli bakiye bulunmayabilir</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>3D Secure doğrulaması başarısız olmuş olabilir</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Bankanız işlemi reddetmiş olabilir</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <RefreshCcw className="w-5 h-5" />
            Tekrar Dene
          </Link>
          
          <Link
            href="/cart"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Sepete Dön
          </Link>

          <Link
            href="/products"
            className="block w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-200"
          >
            Alışverişe Devam Et
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Sorun devam ederse{" "}
            <Link href="/contact" className="text-red-500 hover:underline">
              müşteri hizmetleri
            </Link>
            {" "}ile iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <FailureContent />
    </Suspense>
  );
}
