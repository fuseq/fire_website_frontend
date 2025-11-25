export interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
}

export const products = [
  {
    id: 1,
    name: "Yangın Söndürücü 1kg ABC",
    category: "Söndürücüler",
    price: 150,
    image: "/fire-extinguisher-red.jpg",
    images: ["/fire-extinguisher-red.jpg", "/fire-extinguisher-red.jpg", "/fire-extinguisher-red.jpg"],
    description: "Evler ve ofisler için ideal, taşınabilir 1kg ABC tipi yangın söndürücü",
    specs: ["1kg kapasite", "ABC tipi", "Kolay kullanım", "CE Sertifikalı"],
    inStock: true,
    reviews: [
      {
        id: 1,
        userName: "Ahmet Y.",
        rating: 5,
        comment: "Çok kaliteli bir ürün, evim için aldım çok memnunum.",
        date: "2024-11-15"
      },
      {
        id: 2,
        userName: "Mehmet K.",
        rating: 4,
        comment: "Fiyat performans açısından iyi, tavsiye ederim.",
        date: "2024-11-10"
      }
    ],
  },
  {
    id: 2,
    name: "Duman Detektörü Akıllı",
    category: "Alarm Sistemleri",
    price: 280,
    image: "/smart-smoke-detector.png",
    images: ["/smart-smoke-detector.png", "/smart-smoke-detector.png"],
    description: "WiFi bağlantılı, akıllı telefon uygulaması ile kontrol edilebilir duman detektörü",
    specs: ["WiFi Bağlantı", "Akıllı Bildirim", "10 yıl Pil Ömrü", "CE Sertifikalı"],
    inStock: true,
    reviews: [
      {
        id: 1,
        userName: "Ayşe D.",
        rating: 5,
        comment: "Telefona bildirim geldiği için çok güvenli hissediyorum.",
        date: "2024-11-12"
      }
    ],
  },
  {
    id: 3,
    name: "Acil Çıkış Işığı LED",
    category: "Aydınlatma",
    price: 95,
    image: "/emergency-exit-light-led.jpg",
    images: ["/emergency-exit-light-led.jpg"],
    description: "Yüksek parlaklıklı LED acil çıkış işığı, enerji tasarrufu sağlar",
    specs: ["LED Teknoloji", "Otomatik Şarj", "2-4 saat Çalışma", "IP65 Su Geçirmez"],
    inStock: true,
    reviews: [],
  },
  {
    id: 4,
    name: "Yangın Hortumu 20m",
    category: "Hortumlar",
    price: 320,
    image: "/fire-hose-20-meters.jpg",
    images: ["/fire-hose-20-meters.jpg", "/fire-hose-20-meters.jpg"],
    description: "Dayanıklı, parlak kırmızı renkli 20 metre yangın hortumu",
    specs: ["20 metre", "19mm Çap", "Dayanıklı Kumaş", "Pirinç Fittings"],
    inStock: true,
    reviews: [],
  },
  {
    id: 5,
    name: "Yangın Dolabı Metal",
    category: "Dolap ve Aksesuarlar",
    price: 450,
    image: "/fire-cabinet-metal.jpg",
    images: ["/fire-cabinet-metal.jpg", "/fire-cabinet-metal.jpg"],
    description: "Metal konstrüksiyonlu, yangın söndürücü ve ekipmanları saklamak için",
    specs: ["Çelik Konstrüksiyon", "Cam Kapı", "Duvar Montajlı", "500x400x200mm"],
    inStock: true,
    reviews: [],
  },
  {
    id: 6,
    name: "Yangın Güvenlik İşareti",
    category: "İşaretler",
    price: 35,
    image: "/fire-safety-sign.jpg",
    images: ["/fire-safety-sign.jpg"],
    description: "Fosforlu yangın söndürücü konumu işareti, kolay görülür",
    specs: ["Fosforlu", "210x210mm", "Yapışkanlı", "Gece Görünürlüğü"],
    inStock: true,
    reviews: [],
  },
]

export const categories = [
  "Tüm Ürünler",
  "Söndürücüler",
  "Alarm Sistemleri",
  "Aydınlatma",
  "Hortumlar",
  "Dolap ve Aksesuarlar",
  "İşaretler",
]
