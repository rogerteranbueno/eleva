"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useLang } from "@/lib/i18n"

// ─── ExpandableSection (only used here) ──────────────────────────────────────

function ExpandableSection({
  title,
  children,
}: {
  title: string
  subtitle?: string
  badge?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-foreground/2 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 border-t border-border pt-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── FAQSection ───────────────────────────────────────────────────────────────

export function FAQSection() {
  const { lang } = useLang()

  const c = lang === "en" ? {
    eyebrow: "Frequently asked questions",
    h2: "What people always ask.",
    faqs: [
      {
        q: "Does ELEVA replace word-of-mouth enrollment?",
        a: "No. Word of mouth is one of the most powerful engines this industry has and ELEVA doesn't eliminate it, it amplifies it. It adds digital channels so the center doesn't depend solely on that, and gives participants tools to make inviting easier and more natural.",
      },
      {
        q: "Is it a generic CRM?",
        a: "It has a CRM module, but it's much more. A generic CRM doesn't understand cohorts, transformation phases, Momentum Score or the enrollment model. ELEVA was built from scratch for this specific model.",
      },
      {
        q: "Does it work for small centers?",
        a: "Yes. It's designed to scale from centers with 50 participants to operations with thousands. A small center that retains better and operates cleaner grows faster, and the ROI is immediate.",
      },
      {
        q: "How long does implementation take?",
        a: "Basic onboarding is 2 weeks. First week: setup, migration of existing participants, staff training. Second week: first active cohort in the app.",
      },
      {
        q: "Do participants have to download an app?",
        a: "The participant experience works as a Progressive Web App (PWA): accessed from the phone's browser and can be installed without going through the App Store. Also available as a native app depending on the plan.",
      },
      {
        q: "Does it work for centers in multiple cities?",
        a: "ELEVA is multi-location by design. One account with multiple locations, cohorts by city, coaches assigned by location and consolidated or segmented reports.",
      },
    ],
  } : {
    eyebrow: "Preguntas frecuentes",
    h2: "Lo que siempre preguntan.",
    faqs: [
      {
        q: "¿ELEVA reemplaza el enrolamiento boca a boca?",
        a: "No. El boca a boca es uno de los motores más poderosos que tiene esta industria y ELEVA no lo elimina: lo amplifica. Agrega canales digitales para que el centro no dependa únicamente de eso, y da herramientas a los participantes para que invitar sea más fácil y más natural.",
      },
      {
        q: "¿Es un CRM genérico?",
        a: "Tiene un módulo de CRM, pero es mucho más. Un CRM genérico no entiende cohortes, fases de transformación, Momentum Score ni el modelo de enrolamiento. ELEVA fue construido desde cero para este modelo específico.",
      },
      {
        q: "¿Funciona para centros pequeños?",
        a: "Sí. Está diseñado para escalar desde centros con 50 participantes hasta operaciones con miles. Un centro pequeño que retiene mejor y opera más limpio crece más rápido, y el ROI es inmediato.",
      },
      {
        q: "¿Cuánto tiempo toma implementarlo?",
        a: "El onboarding básico es de 2 semanas. Primera semana: configuración, migración de participantes existentes, capacitación del staff. Segunda semana: primera cohorte activa en la app.",
      },
      {
        q: "¿Los participantes tienen que descargar una app?",
        a: "La experiencia del participante funciona como Progressive Web App (PWA): se accede desde el navegador del teléfono y se puede instalar sin pasar por la App Store. También disponible como app nativa según el plan.",
      },
      {
        q: "¿Funciona para centros en varias ciudades?",
        a: "ELEVA es multi-sede desde el diseño. Una sola cuenta con múltiples ubicaciones, cohortes por ciudad, coaches asignados por sede y reportes consolidados o segmentados.",
      },
    ],
  }

  return (
    <section className="px-6 py-16 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-4">{c.eyebrow}</p>
        <h2 className="text-4xl font-black text-foreground">{c.h2}</h2>
      </motion.div>

      <div className="space-y-3">
        {c.faqs.map((faq) => (
          <ExpandableSection key={faq.q} title={faq.q}>
            <p className="text-sm text-foreground/80 leading-relaxed">{faq.a}</p>
          </ExpandableSection>
        ))}
      </div>
    </section>
  )
}
