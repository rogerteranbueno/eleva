import { Nav } from "@/components/landing/Nav"
import { HeroSection } from "@/components/landing/HeroSection"
import { ProblemaSection } from "@/components/landing/ProblemaSection"
import { SolucionSection } from "@/components/landing/SolucionSection"
import { CasoTeaserSection } from "@/components/landing/CasoTeaserSection"
import { PreciosPivotSection } from "@/components/landing/PreciosPivotSection"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { HistoriaTeaserSection } from "@/components/landing/HistoriaTeaserSection"
import { CierreSection } from "@/components/landing/CierreSection"
import { Footer } from "@/components/landing/Footer"

function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <HeroSection />
        <SectionDivider />
        <ProblemaSection />
        <SectionDivider />
        <SolucionSection />
        <SectionDivider />
        <CasoTeaserSection />
        <SectionDivider />
        <div id="como-empezar">
          <PreciosPivotSection />
        </div>
        <SectionDivider />
        <TestimonialsSection />
        <SectionDivider />
        <HistoriaTeaserSection />
        <SectionDivider />
        <CierreSection />
      </main>
      <Footer />
    </>
  )
}
