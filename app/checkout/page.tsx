"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@/lib/user-context"
import { productsAPI } from "@/lib/api"
import { 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  ChevronRight,
  ChevronLeft,
  Truck,
  Package,
  ShoppingBag
} from "lucide-react"

type CheckoutStep = "address" | "payment" | "complete"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { isLoggedIn, user } = useUser()
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address")
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    user?.addresses.find(a => a.isDefault)?.id || null
  )
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("card")
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [threeDSHtml, setThreeDSHtml] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [installments, setInstallments] = useState<any[]>([])
  const [selectedInstallment, setSelectedInstallment] = useState(1)
  const [loadingInstallments, setLoadingInstallments] = useState(false)

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll()
        if (response.success) {
          setProducts(response.data)
        }
      } catch (error) {
        console.error("Ürünler yüklenemedi:", error)
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  // Calculate cart details
  const groupedCart = cart.reduce((acc: Record<number, number>, id) => {
    acc[id] = (acc[id] || 0) + 1
    return acc
  }, {})

  const cartDetails = Object.entries(groupedCart).map(([id, quantity]) => {
    const product = products.find(p => p.id === Number(id))
    return {
      product,
      quantity,
      subtotal: product ? product.price * quantity : 0
    }
  })

  const subtotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  const steps = [
    { id: "address", label: "Teslimat", icon: MapPin },
    { id: "payment", label: "Ödeme", icon: CreditCard },
    { id: "complete", label: "Tamamlandı", icon: CheckCircle }
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const handleNextStep = async () => {
    if (currentStep === "address") {
      if (!selectedAddressId) {
        alert("Lütfen bir teslimat adresi seçin")
        return
      }
      // Seçilen adresi localStorage'a kaydet (success sayfasında kullanmak için)
      localStorage.setItem("selectedAddressId", selectedAddressId.toString())
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      // Payment validation
      if (paymentMethod === "card") {
        if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvv) {
          alert("Lütfen tüm kart bilgilerini doldurun")
          return
        }
        // Process card payment with İyzico
        await processCardPayment()
      } else {
        // Transfer payment
        setTimeout(() => {
          setCurrentStep("complete")
          setTimeout(() => {
            clearCart()
          }, 3000)
        }, 1500)
      }
    }
  }

  const processCardPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Ödeme öncesi sepet ve adres bilgilerini localStorage'a kaydet
      const orderData = {
        cart: cart,
        addressId: selectedAddressId,
        timestamp: Date.now()
      }
      localStorage.setItem("pendingOrder", JSON.stringify(orderData))
      console.log("💾 Sipariş bilgileri kaydedildi:", orderData)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${apiUrl}/api/payment/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: total.toString(),
          email: user?.email || "test@example.com",
          installment: selectedInstallment,
          cardInfo: {
            number: cardInfo.number,
            name: cardInfo.name,
            expiry: cardInfo.expiry,
            cvv: cardInfo.cvv,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Ödeme başlatılamadı")
      }

      const htmlContent = await response.text()
      setThreeDSHtml(htmlContent)
      
      // İframe'e HTML içeriğini yaz ve formu otomatik submit et
      setTimeout(() => {
        if (iframeRef.current?.contentWindow) {
          const iframeDoc = iframeRef.current.contentWindow.document
          iframeDoc.open()
          iframeDoc.write(htmlContent)
          iframeDoc.close()
        }
      }, 100)
    } catch (error) {
      console.error("Ödeme hatası:", error)
      alert("Ödeme işlemi başlatılırken bir hata oluştu. Lütfen tekrar deneyin.")
      setIsProcessing(false)
    }
  }

  const handleClose3DS = () => {
    setThreeDSHtml(null)
    setIsProcessing(false)
  }

  // Card number formatting
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.substring(0, 19) // Max 16 digits + 3 spaces
  }

  // Expiry date formatting
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  // CVV formatting
  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 3)
  }

  // Taksit bilgilerini yükle
  const fetchInstallments = async (cardNumber: string) => {
    const cleanedNumber = cardNumber.replace(/\s/g, '')
    if (cleanedNumber.length < 6) {
      setInstallments([])
      return
    }

    setLoadingInstallments(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${apiUrl}/api/payment/installments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: total.toString(),
          binNumber: cleanedNumber.substring(0, 6),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.installmentDetails && data.installmentDetails.length > 0) {
          setInstallments(data.installmentDetails[0].installmentPrices || [])
        }
      }
    } catch (error) {
      console.error("Taksit bilgisi alınamadı:", error)
    } finally {
      setLoadingInstallments(false)
    }
  }

  const handlePrevStep = () => {
    if (currentStep === "payment") setCurrentStep("address")
    else if (currentStep === "address") router.push("/cart")
  }

  // Login check
  if (!isLoggedIn && currentStep !== "complete") {
    router.push("/login?redirect=/checkout")
    return null
  }

  if (cart.length === 0 && currentStep !== "complete") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-8">Ödeme yapabilmek için önce ürün eklemelisiniz</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Alışverişe Başla
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* 3D Secure Modal */}
      {threeDSHtml && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Güvenli Ödeme - 3D Secure</h3>
              <button
                onClick={handleClose3DS}
                className="text-white hover:bg-red-800 rounded-full p-2 transition"
                aria-label="Kapat"
              >
                ×
              </button>
            </div>
            <div className="h-[600px] overflow-auto">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="3D Secure"
                sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-top-navigation-by-user-activation"
              />
            </div>
            <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
              <p>🔒 Güvenli ödeme sayfasında telefonunuza gelen doğrulama kodunu giriniz.</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className={currentStep === "complete" ? "mb-12" : "mb-8"}>
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index <= currentStepIndex
                const isCurrent = step.id === currentStep
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center px-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-red-200" : ""}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 w-32 md:w-48 mx-2 transition-all ${
                          index < currentStepIndex ? "bg-red-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-8 ${currentStep === "complete" ? "lg:grid-cols-1 max-w-3xl mx-auto" : "lg:grid-cols-3"}`}>
            {/* Main Content */}
            <div className={currentStep === "complete" ? "" : "lg:col-span-2"}>
              {/* Step 1: Address Selection */}
              {currentStep === "address" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Teslimat Adresi</h2>
                  {user?.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {user.addresses.map((address) => (
                        <button
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                            selectedAddressId === address.id
                              ? "border-red-600 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{address.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                              <p className="text-sm text-gray-600">
                                {address.city} {address.zipCode}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                            </div>
                            {selectedAddressId === address.id && (
                              <CheckCircle className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Kayıtlı adresiniz yok</p>
                      <button
                        onClick={() => router.push("/profile?tab=addresses")}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Adres Ekle
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === "payment" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Ödeme Bilgileri</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Ödeme Yöntemi
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          paymentMethod === "card"
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                        <p className="font-semibold text-gray-900">Kredi Kartı</p>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("transfer")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          paymentMethod === "transfer"
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                        <p className="font-semibold text-gray-900">Havale/EFT</p>
                      </button>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      {/* Test Card Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 text-sm mb-2">💳 Test Kart Bilgileri (Sandbox)</h4>
                        <div className="text-xs text-blue-800 space-y-1">
                          <p><strong>Kart No:</strong> 5528 7900 0000 0008</p>
                          <p><strong>İsim:</strong> TEST USER</p>
                          <p><strong>Son Kullanma:</strong> 12/30</p>
                          <p><strong>CVV:</strong> 123</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Numarası
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={cardInfo.number}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value)
                            setCardInfo({ ...cardInfo, number: formatted })
                            fetchInstallments(formatted)
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Üzerindeki İsim
                        </label>
                        <input
                          type="text"
                          placeholder="AHMET YILMAZ"
                          value={cardInfo.name}
                          onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value.toUpperCase() })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Son Kullanma Tarihi
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo({ ...cardInfo, expiry: formatExpiry(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={3}
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: formatCVV(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>

                      {/* Taksit Seçenekleri */}
                      {installments.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Taksit Seçenekleri
                          </label>
                          {loadingInstallments ? (
                            <div className="text-center py-4">
                              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                              <p className="text-sm text-gray-600 mt-2">Taksit bilgileri yüklenyor...</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {installments.map((installment: any) => (
                                <button
                                  key={installment.installmentNumber}
                                  type="button"
                                  onClick={() => setSelectedInstallment(installment.installmentNumber)}
                                  className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                                    selectedInstallment === installment.installmentNumber
                                      ? "border-red-600 bg-red-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-semibold text-gray-900">
                                        {installment.installmentNumber === 1
                                          ? "Tek Çekim"
                                          : `${installment.installmentNumber} Taksit`}
                                      </p>
                                      {installment.installmentNumber > 1 && (
                                        <p className="text-sm text-gray-600">
                                          Aylık {installment.installmentPrice?.toFixed(2)} ₺
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-gray-900">
                                        {installment.totalPrice?.toFixed(2)} ₺
                                      </p>
                                      {installment.installmentNumber === 1 ? (
                                        <p className="text-xs text-green-600 font-medium">Faiz yok</p>
                                      ) : (
                                        <p className="text-xs text-gray-500">
                                          Toplam
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800">
                          ⚠️ <strong>Güvenlik Notu:</strong> Gerçek kart bilgileriniz güvenli bir şekilde İyzico üzerinden işlenir.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Transfer Payment Info */}
                  {paymentMethod === "transfer" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Banka Bilgileri</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>Banka:</strong> Ziraat Bankası</p>
                        <p><strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00</p>
                        <p><strong>Alıcı:</strong> Ülküm Yangın Sistemleri</p>
                        <p className="mt-3 text-gray-600">
                          Havale/EFT açıklamasına sipariş numaranızı yazınız.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Order Complete */}
              {currentStep === "complete" && (
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center w-full">
                  <div className="inline-block p-8 bg-gradient-to-br from-green-100 to-green-50 rounded-full mb-8 animate-pulse">
                    <CheckCircle className="w-20 h-20 text-green-600" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Siparişiniz Alındı!
                  </h2>
                  <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
                    Siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya verilecektir.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push("/profile?tab=orders")}
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl"
                    >
                      Siparişlerimi Görüntüle
                    </button>
                    <button
                      onClick={() => router.push("/")}
                      className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Ana Sayfaya Dön
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {currentStep !== "complete" && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h3>
                
                <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-semibold">₺{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                      {shipping === 0 ? "Ücretsiz" : `₺${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV (%18)</span>
                    <span className="font-semibold">₺{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                  <span>Toplam</span>
                  <span className="text-red-600">₺{total.toLocaleString()}</span>
                </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleNextStep}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          {currentStep === "payment" ? "Siparişi Tamamla" : "Devam Et"}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    {currentStep !== "address" && (
                      <button
                        onClick={handlePrevStep}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Geri
                      </button>
                    )}
                </div>

                {/* Shipping Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Truck className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Hızlı Teslimat</p>
                      <p>Siparişiniz 2-3 iş günü içinde kargoya verilecektir.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}
