import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { CheckCircle, Users, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hakkımızda</h1>
            <p className="text-xl text-red-100">
              15+ yılı aşkın tecrübesiyle Türkiye'nin güvenlik ve yangın yönetim çözümleri lider şirketi
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img src="/professional-fire-safety-training.jpg" alt="Şirket" className="rounded-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Bizim Hikayemiz</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Şirket İsmi , 2010 yılında kurulmuş ve o günden beri yangın güvenliği alanında lider rol oynayan bir
                şirkettir. Milyonlarca insanın ve işletmenin güvenliğini sağlamak için çalışıyoruz.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Ürün kalitesi, müşteri hizmeti ve yenilikçi çözümler sunma konusundaki kararlılığımız, bizi bu sektörde
                güvenilir bir isim haline getirmiştir.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Tüm ürünlerimiz uluslararası standartlara uygun ve CE sertifikalıdır. Sürekli araştırma ve geliştirme
                ile en son teknoloji ürünlerini müşterilerimize sunmaktayız.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-50 py-16 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Değerlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <CheckCircle className="w-8 h-8" />,
                  title: "Kalite",
                  desc: "En yüksek standartlı ürünler sunuyoruz",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Müşteri Odaklı",
                  desc: "Müşteri memnuniyeti önceliğimiz",
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Güvenilirlik",
                  desc: "15+ yıl deneyim ve sertifikasyon",
                },
                {
                  icon: <Globe className="w-8 h-8" />,
                  title: "İnovasyon",
                  desc: "Teknolojinin en son gelişmelerini kullanıyoruz",
                },
              ].map((value, i) => (
                <div key={i} className="text-center group">
                  <div className="inline-block mb-4 p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-full text-red-600 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "15+", label: "Yıl Tecrübe" },
              { number: "50K+", label: "Mutlu Müşteri" },
              { number: "500+", label: "Kurumsal Ortağı" },
              { number: "1000+", label: "Ürün Türü" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <p className="text-4xl font-bold text-red-600 mb-2">{stat.number}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Sertifikasyonlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {["CE Certification", "ISO 9001", "ISO 14001", "TSE Belgesi"].map((cert, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700 hover:border-red-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Award className="w-8 h-8 text-red-600 mx-auto mb-3" />
                  <p className="font-semibold">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bize Verdiğiniz Güven İçin Teşekkür Ederiz</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Sizin ve sevdiklerinizin güvenliği için her gün çalışıyoruz
          </p>
          <Link
            href="/contact"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Iletişime Geçin
          </Link>
        </section>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}
