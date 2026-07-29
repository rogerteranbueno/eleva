import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos y Condiciones — ELEVA",
  description: "Términos y condiciones de uso de los servicios de ELEVA.",
}

const SECTIONS = [
  {
    title: "Aceptación de los términos",
    body: `Al acceder a este sitio web o contratar cualquier servicio de ELEVA (Estudio Oasis), aceptas quedar vinculado por estos términos y condiciones. Si no estás de acuerdo con alguno de ellos, te pedimos que no utilices nuestros servicios.`,
  },
  {
    title: "Descripción de los servicios",
    body: `ELEVA ofrece servicios de consultoría, formación y acompañamiento para centros de transformación personal, incluyendo el Diagnóstico 360, la implementación PACTO y el programa de acompañamiento continuo ELEVA Partner. Los alcances específicos de cada servicio se detallan en el contrato individual que se firma entre las partes.`,
  },
  {
    title: "Diagnóstico 360",
    body: `El Diagnóstico 360 es un servicio de evaluación con un costo desde USD $1,500. Incluye tres semanas de revisión de ventas, operación, equipo, continuidad y riesgos, y concluye con un plan de acción de 90 días. Previo al diagnóstico se realiza una llamada de calificación sin costo para verificar el fit entre el centro y ELEVA. El monto del diagnóstico se descuenta al contratar el programa PACTO.`,
  },
  {
    title: "Resultados y garantías",
    body: `ELEVA no garantiza resultados específicos de crecimiento, retención o facturación. Los resultados mostrados en este sitio (casos de estudio y testimonios) corresponden a experiencias reales de clientes bajo NDA y pueden no ser representativos de todos los centros. Los resultados individuales varían según el punto de partida, el equipo y el nivel de implementación de cada centro.`,
  },
  {
    title: "Propiedad intelectual",
    body: `Todo el contenido de este sitio — textos, diseños, metodologías, herramientas y materiales formativos — es propiedad exclusiva de ELEVA (Estudio Oasis). Queda prohibida su reproducción, distribución o uso comercial sin autorización escrita expresa. Los materiales entregados a los clientes durante la implementación pueden ser utilizados por el centro para su operación interna, pero no pueden ser revendidos ni cedidos a terceros.`,
  },
  {
    title: "Confidencialidad",
    body: `Toda información compartida durante el proceso de diagnóstico e implementación es estrictamente confidencial. ELEVA no divulgará información del centro sin consentimiento escrito. Los casos de estudio publicados en este sitio están protegidos por acuerdos de confidencialidad (NDA) y las identidades de los centros han sido protegidas.`,
  },
  {
    title: "Limitación de responsabilidad",
    body: `ELEVA no será responsable por daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso de sus servicios. La responsabilidad máxima de ELEVA en cualquier caso estará limitada al monto efectivamente pagado por el cliente en los tres meses previos al reclamo.`,
  },
  {
    title: "Ley aplicable",
    body: `Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia que no pueda resolverse de forma amigable se someterá a los tribunales competentes de la Ciudad de México.`,
  },
  {
    title: "Modificaciones",
    body: `ELEVA se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos al publicarse en esta página. El uso continuado de los servicios tras la publicación de cambios constituye aceptación de los nuevos términos.`,
  },
]

export default function TerminosPage() {
  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-violet-400 hover:text-violet-300 transition-colors mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <div className="mb-10">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-black text-foreground mb-2">Términos y Condiciones</h1>
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
            ¿Preguntas sobre estos términos?{" "}
            <a href="mailto:hola@elevaapp.io" className="text-violet-400 hover:text-violet-300 transition-colors">
              hola@elevaapp.io
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
