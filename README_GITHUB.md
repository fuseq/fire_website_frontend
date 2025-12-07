# 🔥 Yangın Güvenlik E-Ticaret - Frontend

Next.js 16 + React + TypeScript ile geliştirilmiş modern e-ticaret frontend uygulaması.

## 🚀 Özellikler

- ✅ **Next.js 16** (App Router)
- ✅ **React 18** + **TypeScript**
- ✅ **Tailwind CSS 4** - Modern styling
- ✅ **Radix UI** - Accessible component library
- ✅ **Lucide React** - Beautiful icons
- ✅ **React Hook Form** + **Zod** - Form validation
- ✅ **Context API** - State management
- ✅ **Dark Mode** (next-themes)
- ✅ **Toast Notifications** (Sonner)
- ✅ **Responsive Design**
- ✅ **SEO Optimized**
- ✅ **Admin Panel**

## 📋 Teknolojiler

- **Framework:** Next.js 16.0.0
- **UI Library:** React 18.3.1
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4.1.9
- **Components:** Radix UI
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **State Management:** Context API

## 🎨 Sayfalar

### Public Pages:
- `/` - Ana sayfa
- `/about` - Hakkımızda
- `/contact` - İletişim
- `/products` - Ürünler listesi
- `/product/[id]` - Ürün detayı
- `/cart` - Sepet
- `/checkout` - Ödeme bilgileri
- `/payment/success` - Ödeme başarılı
- `/payment/failure` - Ödeme başarısız

### Auth Pages:
- `/login` - Kullanıcı girişi
- `/register` - Kullanıcı kaydı
- `/profile` - Kullanıcı profili
- `/forgot-password` - Şifre sıfırlama
- `/reset-password` - Yeni şifre

### Admin Pages:
- `/admin/login` - Admin girişi
- `/admin/dashboard` - Dashboard
- `/admin/products` - Ürün yönetimi
- `/admin/orders` - Sipariş yönetimi
- `/admin/users` - Kullanıcı yönetimi

## 🔌 API Entegrasyonu

Backend API ile tam entegre. API çağrıları `lib/api.ts` üzerinden yapılır.

### Environment Variable:
```env
NEXT_PUBLIC_API_URL=https://backend-yangin-guvenlik.yourdomain.com
```

## 🛠️ Yerel Kurulum

### 1. Repository'yi klonlayın
```bash
git clone https://github.com/yourusername/yangin-guvenlik-frontend.git
cd yangin-guvenlik-frontend
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Environment variables
`env.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Development sunucusunu başlatın
```bash
npm run dev
```

Uygulama: `http://localhost:3000`

### 5. Production build
```bash
npm run build
npm start
```

## 🚀 CapRover'a Deployment

Detaylı deployment rehberi: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Hızlı Başlangıç:

1. **Backend'in çalıştığından emin olun**
2. **Frontend App Oluştur** (CapRover)
3. **Environment Variable Ayarla:**
   ```
   NEXT_PUBLIC_API_URL=https://backend-yangin-guvenlik.yourdomain.com
   ```
4. **Deploy:**
```bash
caprover deploy
```

## 📦 Component Library

### UI Components (Radix UI):
- `Button`, `Input`, `Select`, `Checkbox`, `Radio`
- `Dialog`, `Sheet`, `Popover`, `Dropdown Menu`
- `Toast`, `Alert`, `Card`, `Badge`
- `Table`, `Tabs`, `Accordion`
- `Avatar`, `Calendar`, `Progress`
- ve daha fazlası...

### Custom Components:
- `Header` - Ana navigasyon
- `Footer` - Footer
- `ProductCard` - Ürün kartı
- `AdminHeader` - Admin navigasyon
- `AdminSidebar` - Admin yan menü
- `WhatsAppButton` - WhatsApp iletişim butonu

## 🎯 Context API

### UserContext:
- Kullanıcı bilgilerini tutar
- Login/Logout işlemleri
- Token yönetimi

### CartContext:
- Sepet yönetimi
- Ürün ekleme/çıkarma
- Miktar güncelleme
- localStorage ile persistence

### AdminContext:
- Admin oturum yönetimi
- Admin login/logout

## 📊 NPM Scripts

```bash
npm run dev        # Development server (localhost:3000)
npm run build      # Production build
npm start          # Production server
npm run lint       # ESLint kontrolü
```

## 📁 Proje Yapısı

```
frontend/
├── app/                 # Next.js pages (App Router)
│   ├── page.tsx         # Ana sayfa
│   ├── layout.tsx       # Root layout
│   ├── products/        # Ürün sayfaları
│   ├── admin/           # Admin panel
│   └── ...
├── components/          # React bileşenleri
│   ├── ui/              # Radix UI components
│   ├── header.tsx
│   ├── footer.tsx
│   └── ...
├── lib/                 # Utilities
│   ├── api.ts           # API client
│   ├── user-context.tsx # User context
│   ├── cart-context.tsx # Cart context
│   └── utils.ts         # Helper functions
├── public/              # Static files
├── styles/              # Global CSS
├── captain-definition   # CapRover deployment
└── package.json
```

## 🎨 Styling

### Tailwind CSS:
Modern utility-first CSS framework kullanılıyor.

### Color Scheme:
- Primary: Red/Orange (yangın teması)
- Dark mode desteği
- Responsive breakpoints

### Custom Classes:
`globals.css` içinde custom CSS değişkenleri tanımlı.

## 🔐 Authentication Flow

1. Kullanıcı `/login` veya `/register` sayfasına gider
2. Form submit → `authAPI.login()` / `authAPI.register()`
3. JWT token localStorage'a kaydedilir
4. UserContext güncellenir
5. Kullanıcı `/profile` veya `/admin` sayfasına yönlendirilir

### Protected Routes:
- `/profile` - Kullanıcı girişi gerekli
- `/checkout` - Kullanıcı girişi gerekli
- `/admin/*` - Admin yetkisi gerekli

## 🛒 Sepet Sistemi

- Context API ile state management
- localStorage ile persistence
- Otomatik toplam hesaplama
- Ürün miktarı güncelleme
- Ürün silme

## 👥 Admin Panel

### Özellikler:
- ✅ Dashboard (İstatistikler)
- ✅ Ürün yönetimi (CRUD)
- ✅ Sipariş yönetimi
- ✅ Kullanıcı yönetimi
- ✅ Sipariş durumu güncelleme
- ✅ Admin yetkisi verme/alma

### Giriş:
- URL: `/admin/login`
- Email: `admin@yanginguvenlik.com`
- Şifre: `admin123` (Production'da değiştirin!)

## 🔗 İlgili Repolar

- **Backend:** [yangin-guvenlik-backend](https://github.com/yourusername/yangin-guvenlik-backend)

## 🐛 Sorun Giderme

### API bağlantı hatası
```
Error: Failed to fetch
```
**Çözüm:** 
- `NEXT_PUBLIC_API_URL` environment variable'ını kontrol edin
- Backend'in çalıştığından emin olun

### Build hatası
```
Error: JavaScript heap out of memory
```
**Çözüm:** Node.js memory limit'i artırın:
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Hydration hatası
```
Error: Hydration failed
```
**Çözüm:** Server ve client render'ı farklı olabilir. localStorage kullanımını kontrol edin.

## 📱 Responsive Design

- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+

Tüm sayfalar mobil uyumlu.

## 🔍 SEO

- Next.js metadata API kullanılıyor
- Her sayfada dinamik meta tags
- Open Graph tags
- Sitemap (opsiyonel)

## 📄 Lisans

ISC

## 👤 Geliştirici

Yangın Güvenlik E-Ticaret Frontend

---

**🔗 Demo:** `https://yangin-guvenlik.yourdomain.com`

**📦 Backend API:** `https://backend-yangin-guvenlik.yourdomain.com`




