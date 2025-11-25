"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { ordersAPI } from "@/lib/api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [paymentDetails, setPaymentDetails] = useState({
    paymentId: "",
    conversationId: "",
    price: "",
  });
  const [orderCreated, setOrderCreated] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Sadece bir kez çalıştır
    if (hasRunRef.current) {
      console.log("⚠️ useEffect zaten çalıştı, atlanıyor");
      return;
    }
    hasRunRef.current = true;

    const paymentId = searchParams.get("paymentId") || "";
    const conversationId = searchParams.get("conversationId") || "";
    const price = searchParams.get("price") || "";

    setPaymentDetails({
      paymentId,
      conversationId,
      price,
    });

    // Siparişi oluştur
    if (paymentId) {
      createOrder(paymentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createOrder = async (paymentId: string) => {
    // localStorage'da sipariş oluşturulmuş mu kontrol et
    const orderAlreadyCreated = localStorage.getItem(`order_created_${paymentId}`);
    if (orderAlreadyCreated) {
      console.log("✅ Bu ödeme için sipariş zaten oluşturulmuş");
      setOrderCreated(true);
      return;
    }

    if (isCreating || orderCreated) {
      console.log("⚠️ Sipariş zaten oluşturuluyor veya oluşturuldu");
      return;
    }
    
    setIsCreating(true);
    console.log("🛒 Sipariş oluşturma başladı...");
    
    try {
      // localStorage'dan sipariş bilgilerini al
      const pendingOrderData = localStorage.getItem("pendingOrder");
      console.log("💾 pendingOrder:", pendingOrderData);
      
      if (!pendingOrderData) {
        console.error("❌ Bekleyen sipariş bilgisi bulunamadı");
        alert("❌ Sipariş bilgileri bulunamadı. Lütfen müşteri hizmetleri ile iletişime geçin.");
        setIsCreating(false);
        return;
      }
      
      const pendingOrder = JSON.parse(pendingOrderData);
      console.log("📦 Sepet (localStorage):", pendingOrder.cart);
      console.log("📍 Adres ID (localStorage):", pendingOrder.addressId);
      
      // Sepetteki ürünleri grupla
      const groupedCart = pendingOrder.cart.reduce((acc: Record<number, number>, id: number) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});
      console.log("📊 Gruplanmış sepet:", groupedCart);

      const items = Object.entries(groupedCart).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity: Number(quantity),
      }));
      console.log("📝 Sipariş öğeleri:", items);

      const shippingAddressId = pendingOrder.addressId;
      console.log("📍 Teslimat adresi ID:", shippingAddressId);

      if (!shippingAddressId || items.length === 0) {
        console.error("❌ Teslimat adresi veya ürün bulunamadı");
        alert("❌ Sipariş bilgileri eksik. Lütfen müşteri hizmetleri ile iletişime geçin.");
        setIsCreating(false);
        return;
      }

      console.log("🚀 API isteği gönderiliyor...");
      const response = await ordersAPI.create({
        items,
        shippingAddressId: Number(shippingAddressId),
        paymentMethod: "card",
        paymentId: paymentId,
      });

      console.log("📥 API yanıtı:", response);

      if (response.success) {
        console.log("✅ Sipariş başarıyla oluşturuldu:", response.data);
        setOrderCreated(true);
        setIsCreating(false);
        
        // Bu ödeme için sipariş oluşturuldu işaretle
        localStorage.setItem(`order_created_${paymentId}`, "true");
        
        // Sepeti temizle
        clearCart();
        console.log("🗑️ Sepet temizlendi");
        
        // localStorage'dan tüm sipariş bilgilerini temizle
        localStorage.removeItem("selectedAddressId");
        localStorage.removeItem("pendingOrder");
        console.log("🧹 localStorage temizlendi");
      } else {
        console.error("❌ Sipariş oluşturulamadı:", response);
        alert("Sipariş oluşturulamadı: " + (response.message || "Bilinmeyen hata"));
        setIsCreating(false);
      }
    } catch (error: any) {
      console.error("❌ Sipariş oluşturma hatası:", error);
      console.error("Hata detayı:", error.message);
      alert("Sipariş oluşturma hatası: " + error.message);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="mb-6">
          {orderCreated ? (
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
          ) : (
            <div className="w-24 h-24 mx-auto">
              <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-green-500"></div>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {orderCreated ? "Sipariş Oluşturuldu! 🎉" : "Sipariş Hazırlanıyor..."}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {orderCreated 
            ? "Siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya verilecektir."
            : "Ödemeniz onaylandı, siparişiniz oluşturuluyor..."}
        </p>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Ödeme ID:</span>
            <span className="font-mono text-sm font-semibold text-gray-800">
              {paymentDetails.paymentId}
            </span>
          </div>
          
          {paymentDetails.price && (
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-gray-600 text-sm">Ödenen Tutar:</span>
              <span className="text-lg font-bold text-green-600">
                ₺{paymentDetails.price}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {orderCreated && (
          <div className="space-y-3">
            <Link
              href="/profile?tab=orders"
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Siparişlerimi Görüntüle
            </Link>
            
            <Link
              href="/products"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-gray-500 mt-6">
          Sipariş detayları e-posta adresinize gönderilecektir.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
