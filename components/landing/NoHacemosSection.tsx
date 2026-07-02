"use client"

import { motion } from "framer-motion"
import { useInView } from "@/lib/use-in-view"
import { X } from "lucide-react"

const NO_HACEMOS = [
  {
    title: "No somos un software de gestión.",
    body: "ELEVA no es un CRM ni un ERP. Es una implementación que instala capacidad, y ELEVA OS es la herramienta que la sostiene, no el producto principal.",
  },
  {
    title: "No reemplazamos tu metodología.",
    body: "No venimos a decirte cómo enseñar transformación. Venimos a asegurarnos de que lo que ya sabes hacer pueda ser enseñado, medido y escalado por tu equipo.",
  },
  {
    title: "No formamos coaches genéricos.",
    body: "No certificamos en metodologías genéricas. Formamos a tu gente bajo tu metodología, con tus estándares, para tu centro.",
  },
  {
    title: "No somos un proveedor de contenido.",
    body: "No vendemos cursos online. No tenemos biblioteca de videos. Hacemos implementación presencial y estratégica, con resultados medibles.",
  },
  {
    title: "No hacemos enrolamiento agresivo.",
    body: "No vendemos con presión. Seleccionamos activamente los centros con los que trabajamos. Si no hay fit real, no avanzamos.",
  },
  {
    title: "No prometemos crecimiento sin trabajo.",
    body: "Lo que instalamos es estructura y sistema. El crecimiento es consecuencia del trabajo del equipo sobre esa estructura, nunca promesas vacías.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function NoHacemosSection() {
  const { ref, inView } = useInView(0.08)

  return (
    <section ref={ref} className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} className="space-y-12">
        <motion.div custom={0} variants={fadeUp} className="max-w-2xl space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Claridad antes de avanzar
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
            Lo que ELEVA<br />
            <span className="text-muted-foreground font-light">no hace.</span>
          </h2>
          <p className="text-muted-foreground text-base">
            Ser honestos sobre los límites de lo que hacemos es parte de cómo construimos confianza con los centros que nos eligen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NO_HACEMOS.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i + 1}
              variants={fadeUp}
              className="glass rounded-2xl p-5 border border-foreground/6 space-y-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-red-400" />
                </div>
                <p className="font-black text-foreground text-sm leading-snug">{item.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-9">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p custom={7} variants={fadeUp} className="text-center text-muted-foreground text-sm max-w-xl mx-auto">
          Esta claridad no es modestia. Es respeto por tu tiempo y el nuestro.
        </motion.p>
      </motion.div>
    </section>
  )
}
