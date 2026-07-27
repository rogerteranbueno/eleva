import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Aviso de Privacidad — ELEVA",
  description: "Cómo ELEVA recopila, usa y protege tu información personal.",
}

const SECTIONS = [
  {
    title: "Responsable del tratamiento",
    body: `ELEVA (Estudio Oasis) es responsable del tratamiento de los datos personales que nos proporciones. Puedes contactarnos en hola@elevaapp.io para cualquier consulta relacionada con el manejo de tu información.`,
  },
  {
    title: "Datos que recopilamos",
    body: `Recopilamos únicamente los datos que tú nos proporcionas de forma voluntaria a través de nuestros formularios de contacto y diagnóstico: nombre, correo electrónico, nombre del centro que diriges y cualquier información adicional que incluyas en tus mensajes. No recopilamos datos sensibles.`,
  },
  {
    title: "Finalidad del uso de datos",
    body: `Utilizamos tu información exclusivamente para: (1) responder a tu solicitud de diagnóstico o contacto; (2) enviarte información relevante sobre los servicios de ELEVA que hayas solicitado; (3) mejorar la calidad de nuestros servicios. No vendemos ni compartimos tu información con terceros con fines comerciales.`,
  },
  {
    title: "Base legal",
    body: `El tratamiento de tus datos se realiza con base en tu consentimiento explícito al enviar cualquier formulario en este sitio. Puedes retirar tu consentimiento en cualquier momento escribiéndonos a hola@elevaapp.io.`,
  },
  {
    title: "Conservación de datos",
    body: `Conservamos tus datos durante el tiempo necesario para atender tu solicitud y, en caso de una relación contractual, durante la vigencia del contrato más el periodo legal requerido en tu país de residencia.`,
  },
  {
    title: "Cookies y tecnologías de seguimiento",
    body: `Este sitio utiliza Vercel Analytics para medir el tráfico de forma agregada y anónima. No utilizamos cookies de terceros con fines publicitarios. Al continuar navegando en el sitio, aceptas el uso de cookies técnicas necesarias para su funcionamiento.`,
  },
  {
    title: "Tus derechos",
    body: `Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales (derechos ARCO). Para ejercerlos, escríbenos a hola@elevaapp.io indicando tu solicitud. Responderemos en un plazo máximo de 20 días hábiles.`,
  },
  {
    title: "Cambios a este aviso",
    body: `Podemos actualizar este aviso de privacidad ocasionalmente. La versión vigente estará siempre disponible en esta página con la fecha de última actualización.`,
  },
]

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-violet-400 hover:text-violet-300 transition-colors mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <div className="mb-10">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-black text-foreground mb-2">Aviso de Privacidad</h1>
          <p className="text-sm text-muted-foreground">Última actualización: julio 2026 · ELEVA (Estudio Oasis)</p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <div key={i} className="space-y-2">
              <h2 className="text-base font-black text-foreground">{i + 1}. {s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            ¿Preguntas sobre este aviso?{" "}
            <a href="mailto:hola@elevaapp.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              hola@elevaapp.io
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
