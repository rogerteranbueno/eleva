"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, X, Send, RefreshCw, BookOpen, Lightbulb, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Knowledge base ───────────────────────────────────────────────────────────

const CHARLAS: { tema: string; tag: string; contenido: string }[] = [
  {
    tema: "Compromiso vs. motivación",
    tag: "apertura",
    contenido: `**HOOK:** ¿Cuántas veces has empezado algo con todo el fuego del mundo... y tres semanas después ya no quedaba ni la brasa?

**DATO INTERESANTE:** Estudios de neurociencia del comportamiento muestran que la motivación intrínseca dura en promedio 11 días antes de que el sistema límbico empiece a buscar el camino de menor resistencia. 11 días. Eso es menos de dos semanas.

**¿QUIÉN HA VISTO ESTO?** Alguien que en enero se inscribió al gym, pagó tres meses por adelantado, fue dos semanas... y luego no volvió en todo el año. Esa persona puede ser cualquiera de nosotros. Y no es falta de carácter, es biología.

**LOS SERES HUMANOS TENDEMOS A** confundir motivación con compromiso. La motivación es emocional, fluctúa, depende de cómo te sientes hoy. El compromiso es una decisión que tomaste cuando estabas en tu mejor versión, y que aplicas aunque hoy no te sientas en tu mejor versión.

**POR ESO, para lograr una transformación real,** no podemos depender de sentir ganas. Tenemos que construir una promesa que sea más grande que nuestro estado de ánimo. Una promesa que tenga nombre, fecha y testigos.

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** La motivación te trae al punto de partida. El compromiso es lo que determina hasta dónde llegas. No esperes sentirte listo, decide serlo.`,
  },
  {
    tema: "La identidad como base del cambio",
    tag: "transformación",
    contenido: `**HOOK:** ¿Qué pasa si el problema no es lo que haces, sino quién crees que eres?

**DATO INTERESANTE:** James Clear, en Hábitos Atómicos, documenta que el 95% de los cambios de comportamiento fallidos tienen un origen en común: la persona intentó cambiar el resultado sin cambiar la identidad. Intentaron "hacer ejercicio" sin volverse "alguien que se mueve". Intentaron "ahorrar" sin convertirse en "alguien que administra bien su dinero".

**¿QUIÉN HA VISTO ESTO?** Alguien que deja de fumar por un mes... y en el primer momento de estrés vuelve, porque en el fondo seguía creyendo que era fumador en pausa, no alguien que ya no fuma. La historia que nos contamos sobre quiénes somos determina lo que hacemos.

**LOS SERES HUMANOS TENDEMOS A** creer que somos el resultado de nuestras circunstancias. Pero la neuroplasticidad nos dice algo diferente: el cerebro se reorganiza alrededor de lo que repetimos, no de lo que queremos, sino de lo que hacemos y de lo que creemos sobre nosotros mismos.

**POR ESO, para lograr un cambio que dure,** primero tienes que decidir quién eres. No quién quieres ser, quién eres, hoy, en este momento. Y desde ahí actuar en consecuencia.

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** El cambio de afuera hacia adentro es temporal. El cambio de adentro hacia afuera es permanente. Primero la identidad, luego las acciones, luego los resultados.`,
  },
  {
    tema: "La incomodidad como indicador de crecimiento",
    tag: "mindset",
    contenido: `**HOOK:** ¿Y si lo que más te cuesta es exactamente lo que más necesitas?

**DATO INTERESANTE:** La zona de aprendizaje óptimo, lo que los psicólogos llaman la "zona de desarrollo próximo" de Vygotsky, existe exactamente en el límite de la incomodidad. Ni tan fácil que se vuelva aburrido, ni tan difícil que paralice. El crecimiento vive en ese filo.

**¿QUIÉN HA VISTO ESTO?** Alguien que evita dar una presentación porque le da miedo. Alguien que no aplica para ese trabajo porque "seguro no califico". Alguien que no tiene la conversación difícil con esa persona porque "no es buen momento". La incomodidad siempre tiene una salida fácil, y esa salida tiene un costo.

**LOS SERES HUMANOS TENDEMOS A** interpretar la incomodidad como una señal de peligro. El sistema nervioso no distingue entre el miedo al tigre y el miedo al escenario, activa la misma respuesta. Pero la diferencia es que el tigre te puede matar. El escenario no.

**POR ESO, para lograr expandir lo que eres capaz de hacer,** tienes que redefinir tu relación con la incomodidad. No como amenaza, sino como señal de que estás en territorio nuevo. Donde estás incómodo, estás creciendo.

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** La comodidad es el cementerio del potencial. Cada vez que sientes incomodidad y decides avanzar de todas formas, estás eligiendo quién vas a ser mañana.`,
  },
  {
    tema: "La consistencia invisible",
    tag: "disciplina",
    contenido: `**HOOK:** ¿Qué están haciendo las personas que logran lo que tú quieres lograr, cuando nadie los está mirando?

**DATO INTERESANTE:** Un estudio de la University College London encontró que formar un nuevo hábito toma en promedio 66 días, no 21, como dice el mito. Y más importante: el progreso no es lineal. Hay periodos de plateau donde parece que nada está pasando... y de repente hay un salto.

**¿QUIÉN HA VISTO ESTO?** Un atleta que entrena en la oscuridad del gimnasio a las 5am, sin público, sin aplausos, sin nadie que lo vea. Un emprendedor que trabaja en su proyecto a las 10pm después de que se durmieron sus hijos. Un escritor que escribe 500 palabras cada día aunque ese día nadie las lea. El mundo ve el resultado, pero no ve el trabajo invisible.

**LOS SERES HUMANOS TENDEMOS A** sobrestimar lo que podemos lograr en un mes y subestimar radicalmente lo que podemos lograr en un año de trabajo consistente. Queremos resultados rápidos en procesos que requieren tiempo.

**POR ESO, para lograr algo que valga la pena,** el reto no es hacer el esfuerzo grande una vez. Es hacer el esfuerzo pequeño todos los días, especialmente cuando no tienes ganas, especialmente cuando nadie te está mirando.

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** Los grandes logros no son el resultado de un momento heroico. Son el resultado de mil momentos ordinarios que nadie vio, acumulados con paciencia y constancia.`,
  },
  {
    tema: "El precio del siguiente nivel",
    tag: "crecimiento",
    contenido: `**HOOK:** Todo el mundo quiere llegar al siguiente nivel. Muy pocos están dispuestos a pagar lo que cuesta.

**DATO INTERESANTE:** En psicología positiva existe el concepto de "pérdida de identidad de transición", cuando subimos de nivel en cualquier área de vida, primero tenemos que soltar quiénes éramos antes de poder convertirnos en quiénes vamos a ser. Y ese soltarse duele. Es un duelo real.

**¿QUIÉN HA VISTO ESTO?** Un profesional que recibe un ascenso y de repente siente que "no merece" el nuevo puesto. Un emprendedor que lleva años queriendo escalar su negocio pero inconscientemente sabotea cada oportunidad. Una persona que dice querer relaciones profundas pero sigue eligiendo vínculos superficiales. El siguiente nivel tiene un precio emocional que pocas personas calculan.

**LOS SERES HUMANOS TENDEMOS A** querer los resultados del siguiente nivel sin querer soltar la comodidad del nivel actual. Pero el siguiente nivel no cabe en la vida que tienes hoy. Para que entre algo nuevo, algo tiene que salir.

**POR ESO, para lograr llegar al siguiente nivel,** primero tienes que preguntarte: ¿Qué estoy dispuesto a soltar? ¿Qué creencia, qué hábito, qué relación, qué versión de mí mismo ya no tiene cabida en el lugar al que quiero llegar?

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** El siguiente nivel no es una recompensa por quién eres hoy. Es el resultado de convertirte en alguien distinto. Y esa transformación tiene un precio. La pregunta no es si puedes pagarlo, es si estás dispuesto.`,
  },
  {
    tema: "La tribu como espejo",
    tag: "comunidad",
    contenido: `**HOOK:** Las personas con quienes pasas el tiempo no solo te influencian. Te definen.

**DATO INTERESANTE:** El sociólogo Nicholas Christakis documentó en su investigación de Harvard que los comportamientos, incluyendo el éxito económico, los hábitos de salud y el bienestar emocional, se contagian hasta tres grados de separación. No solo te afecta tu círculo cercano. Te afecta el círculo del círculo del círculo.

**¿QUIÉN HA VISTO ESTO?** Una persona que regresa de un retiro o entrenamiento transformacional completamente encendida... y en dos semanas está exactamente igual que antes, porque regresó al mismo entorno con las mismas personas y los mismos patrones. El entorno ganó.

**LOS SERES HUMANOS TENDEMOS A** subestimar el poder del entorno sobre el comportamiento. Creemos que somos individuos autónomos que tomamos decisiones racionales. Pero la realidad es que somos seres sociales profundamente influenciados por las normas, valores y expectativas de nuestra tribu.

**POR ESO, para lograr una transformación que perdure,** necesitas una comunidad que la sostenga. No puedes ser la única persona en tu entorno que está creciendo. Necesitas personas que ya viven lo que tú quieres vivir, que te normalicen el estándar al que aspiras.

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** Eres el promedio de las personas con quienes te rodeas. Elige con quién compartes tu tiempo como si de eso dependiera tu destino, porque de eso depende.`,
  },
  {
    tema: "El problema del 'después'",
    tag: "urgencia",
    contenido: `**HOOK:** "Lo voy a hacer cuando..." Es la frase más cara que existe.

**DATO INTERESANTE:** El psicólogo Piers Steel estudió la procrastinación durante 10 años y llegó a esta fórmula: entre más lejana percibimos una recompensa en el tiempo, más la descontamos. El cerebro humano valora 100 pesos hoy como si valieran más que 110 pesos en un mes. Nuestro cerebro literalmente no cree en el futuro.

**¿QUIÉN HA VISTO ESTO?** "Lo empiezo el lunes." "Cuando termine este proyecto." "Cuando los niños estén más grandes." "Cuando tenga más dinero." "Cuando me sienta listo." El después es una ilusión. Siempre habrá otra razón para esperar.

**LOS SERES HUMANOS TENDEMOS A** sobrevalorar el costo de empezar hoy y subvalorar el costo de no empezar. No calculamos el precio del tiempo perdido, de las oportunidades que no regresarán, de la persona en que no nos convertimos mientras esperábamos el momento perfecto.

**POR ESO, para lograr algo que realmente importa,** la pregunta no es "¿cuándo es el mejor momento?" La pregunta es "si no es ahora, ¿cuándo?" Y si la respuesta honesta es "nunca", al menos sé honesto contigo mismo sobre esa elección.

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** El momento perfecto no existe. El único momento que existe es este. Empieza con lo que tienes, donde estás, con quien eres hoy. La acción imperfecta siempre gana a la inacción perfecta.`,
  },
  {
    tema: "Por qué la visión importa más que el talento",
    tag: "liderazgo",
    contenido: `**HOOK:** ¿Conoces a alguien extraordinariamente talentoso... que no ha logrado nada extraordinario?

**DATO INTERESANTE:** Angela Duckworth, en su investigación sobre "grit" en West Point, descubrió que el predictor número uno del éxito a largo plazo no era el talento, ni la inteligencia, ni los recursos, era la capacidad de perseverar en pos de un objetivo de largo plazo. Le llama "grit": pasión + perseverancia. Y el origen del grit es una visión que te importa lo suficiente.

**¿QUIÉN HA VISTO ESTO?** El estudiante más brillante de la clase que 10 años después está atascado. El deportista más talentoso del equipo que nunca llegó a profesional. La persona con todos los recursos que sigue esperando el momento correcto. El talento sin dirección es como un motor sin volante, mucho ruido, pocos kilómetros.

**LOS SERES HUMANOS TENDEMOS A** creer que el talento es el recurso más valioso. Pero el talento sin visión se dispersa. La visión sin talento se entrena. Una persona con visión clara y disciplina promedio casi siempre llega más lejos que una persona con talento extraordinario y visión difusa.

**POR ESO, para lograr lo que realmente quieres,** primero tienes que poder verlo con tanta claridad que cuando cierres los ojos lo sientas real. No como deseo, como destino. La visión no es un sueño. Es una dirección.

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** El talento es el punto de partida. La visión es el destino. Sin destino, el talento más brillante solo da vueltas en círculos.`,
  },
  {
    tema: "La segunda oportunidad que sí existe",
    tag: "resiliencia",
    contenido: `**HOOK:** ¿Cuántas veces has decidido que ya es demasiado tarde para ti?

**DATO INTERESANTE:** El neurocientífico Norman Doidge documentó en "El Cerebro que se Cambia a Sí Mismo" que el cerebro adulto tiene una capacidad de reorganización y aprendizaje que durante décadas se creyó imposible. Pacientes que perdieron funciones motrices después de un accidente cerebrovascular las recuperaron. Personas con traumas profundos los reescribieron. El cerebro no tiene fecha de vencimiento.

**¿QUIÉN HA VISTO ESTO?** La persona que a los 40 años decidió estudiar lo que siempre quiso. La que a los 50 empezó el negocio que había postergado. La que después de un divorcio, una quiebra, una pérdida, encontró algo nuevo que no habría encontrado si las cosas hubieran salido como planeaba.

**LOS SERES HUMANOS TENDEMOS A** escribir capítulos de nuestra historia con tinta permanente cuando en realidad siempre es lápiz. Decidimos demasiado rápido que "eso ya no es para mí", que "ya pasó mi momento", que "con lo que cargo, eso no es posible". Pero la historia humana está llena de comienzos tardíos que resultaron ser los mejores comienzos.

**POR ESO, para lograr lo que crees que ya no puedes,** el primer paso es cuestionarse la historia que te estás contando. ¿Es verdad que es demasiado tarde? ¿O solo es incómodo empezar de nuevo?

**NOS CONVIENE RECORDAR ESTE PRINCIPIO:** El mejor momento para empezar fue hace años. El segundo mejor momento es hoy. Y hoy siempre está disponible.`,
  },
]

const CONSEJOS: { keywords: string[]; role: string[]; respuesta: string }[] = [
  {
    keywords: ["participante", "quiere cancelar", "quiere salir", "bajas", "abandono", "salirse"],
    role: ["owner", "coach", "ops"],
    respuesta: `**Cuando un participante quiere cancelar, protocolo de retención**

Antes de aceptar la cancelación, hay que entender que el 70% de las intenciones de cancelación son en realidad una solicitud de ser visto.

**Paso 1, No reacciones, escucha.** La primera respuesta no es ofrecer descuentos ni argumentar. Es preguntar: "¿Qué está pasando?" con genuina curiosidad. El participante necesita sentir que alguien lo escucha antes de que se tome cualquier decisión.

**Paso 2, Identifica el tipo de cancelación:**
- *Logística* (dinero, tiempo, distancia) → tiene solución técnica: plan de pago, reagendamiento, formato alterno
- *Emocional* (se siente estancado, invisible, sin avance) → necesita una conversación de reencuadre con su coach
- *Relacional* (algo pasó con alguien del grupo) → necesita intervención del líder del clan o el Capitán
- *De identidad* (siente que "esto no es para mí") → es el más delicado, necesita trabajar con el coach la historia que se está contando

**Paso 3, Involucra al coach.** El coach debe tener una conversación personal, no por WhatsApp, dentro de las siguientes 24 horas. Sin proceso, sin scripting, solo presencia genuina.

**Paso 4, Ofrece una salida con dignidad.** Si después de la conversación decide cancelar, que sea con un cierre limpio. Un participante que se va bien tratado puede volver, o puede referir a alguien más.

**Insight clave:** El momento en que alguien quiere cancelar es, paradójicamente, uno de los momentos con más potencial de transformación. La incomodidad que siente es exactamente la que produce el cambio. Pero requiere acompañamiento, no argumentos.`,
  },
  {
    keywords: ["enrolamiento", "enrolar", "conversión", "invitar", "pipeline", "leads"],
    role: ["owner", "ops", "coach"],
    respuesta: `**Maximizar conversión en semana de enrolamiento, estrategia completa**

El enrolamiento no empieza la semana del evento. Empieza 3 semanas antes.

**Semana -3: Preparación del terreno**
Cada participante activo de VIA debe tener claro a quién está invitando y por qué. No una lista de contactos, una persona específica con un motivo específico. "Pienso en ti porque..." es el inicio de toda conversación de enrolamiento efectiva.

**Semana -2: Activación del compromiso**
El Capitán del Tribu convoca una sesión de Impacto Visión. Cada miembro del clan identifica a su invitado, escribe su nombre, lo visualiza en el programa y hace el compromiso público ante su clan. Los compromisos públicos tienen 3x más tasa de cumplimiento que los privados.

**Semana -1: El contacto**
La conversación de enrolamiento no es una venta, es una invitación desde el propio crecimiento. "Esto cambió algo en mí, y pienso que podría cambiar algo en ti." La autenticidad es el mejor argumento. Si el participante de VIA intenta "vender" el programa en lugar de compartir su experiencia, la conversación se siente forzada.

**Día del evento: La acogida**
El invitado llega nervioso. Quien lo invitó debe ser quien lo recibe, lo presenta con la tribu, lo cuida durante el día. El primer día de Despertar decide el 80% de las inscripciones al siguiente nivel.

**Post-evento: El seguimiento**
En las siguientes 48 horas, el participante de VIA hace un seguimiento con su invitado. No para presionar, para acompañar el proceso emocional que el evento activó. La decisión de inscribirse generalmente se toma en ese window de 48-72 horas.

**Métrica clave a trackear en ELEVA:** Compromisos formales de enrolamiento vs. confirmaciones vs. inscripciones. Si ves una brecha grande entre compromisos y confirmaciones, el problema está en el seguimiento, no en la metodología.`,
  },
  {
    keywords: ["momentum", "bajo", "grupo decaído", "energía baja", "participantes desmotivados", "generación estancada"],
    role: ["owner", "coach"],
    respuesta: `**Cuando el momentum de una generación está bajo, diagnóstico y reactivación**

Antes de actuar, diagnostica. Un momentum bajo puede tener tres orígenes muy diferentes:

**Origen 1, Logístico**
Faltan sesiones, hay ausencias acumuladas, el calendario tiene huecos largos. Solución: reagendar, comprimir, crear un evento de re-activación que genere urgencia y comunidad.

**Origen 2, Relacional**
Hay tensión no resuelta en la tribu, un conflicto entre miembros, un Capitán que perdió autoridad moral, un clan que se fragmentó. Esto es invisible en los números pero se siente en la sala. Solución: una conversación de limpieza facilitada por el coach, trabajando el perdón y el compromiso renovado.

**Origen 3, De significado**
La generación perdió contacto con el "por qué" del proceso. Entraron con una visión de transformación y en algún momento se volvió rutina. Solución: una sesión de re-conexión con el propósito original, regresar a las promesas del inicio, releer los compromisos, celebrar el camino recorrido.

**Táctica de reactivación probada:**
Una "Noche de reconocimiento" donde cada participante reconoce públicamente el crecimiento de otro. El reconocimiento externo activa el sistema de recompensa del cerebro y reconstruye el sentido de pertenencia grupal en una sola sesión.

**Lo que NO hacer:**
No forzar energía artificial con dinámicas de "hype", el entusiasmo forzado se percibe inmediatamente y genera el efecto contrario. El momentum auténtico nace del significado, no de la adrenalina.

**Señal de alerta en ELEVA:** Si el Momentum Score baja más de 15 puntos en dos semanas consecutivas, es señal de que hay algo que resolver, no solo en los números sino en la dinámica humana del grupo.`,
  },
  {
    keywords: ["brief", "coach", "preparar sesión", "contexto coach", "antes de sesión"],
    role: ["coach", "owner"],
    respuesta: `**Cómo construir un brief de coaching que realmente cambie la sesión**

El brief de coach no es un resumen administrativo. Es la diferencia entre llegar a ciegas y llegar con intención.

**Los 5 elementos de un brief efectivo:**

**1. Estado actual documentado**
No solo "está bien" o "está batallando". Qué specific está pasando en su vida hoy, trabajo, relaciones, salud, finanzas. El contexto hace que las preguntas del coach sean 10x más poderosas.

**2. La última conversación**
¿Qué se comprometió en la sesión anterior? ¿Lo cumplió? Si no, ¿qué pasó? El coaching sin continuidad no es coaching, es una serie de charlas desconectadas.

**3. El estado de sus promesas**
¿En qué fase está? ¿Cuándo es su próxima revisión de promesas? ¿Hay alguna promesa que esté en riesgo? Las promesas son el mapa del proceso de transformación, el coach debe saber dónde está el participante en ese mapa.

**4. La temperatura emocional**
¿Cómo llegó a la última sesión? ¿Abierto, cerrado, con miedo, con energía? Esta información cambia completamente el tipo de pregunta que conviene hacer al inicio.

**5. La pregunta que el coach quiere explorar**
Antes de llegar, el coach formula una pregunta que quiere explorar con el participante, una que empuje sin romper, que invite sin forzar.

**Práctica recomendada:**
El coach dedica 5-7 minutos antes de cada sesión a revisar el expediente del participante en ELEVA. No para seguir un guión, sino para llegar con contexto y presencia real.

**Insight:** El participante siente inmediatamente si el coach llegó preparado o no. Esa percepción -"mi coach me conoce, le importo"- es uno de los factores más poderosos de retención en programas de transformación.`,
  },
  {
    keywords: ["morosidad", "cobrar", "pago pendiente", "cobranza", "no ha pagado", "deuda"],
    role: ["owner", "ops"],
    respuesta: `**Estrategia de cobranza que preserva la relación y recupera el dinero**

La cobranza en un centro de transformación tiene una tensión única: el dinero importa, pero la relación también. La buena noticia es que no tienes que elegir entre los dos.

**Principio fundamental:**
El problema rara vez es que "no quieren pagar". El problema casi siempre es que no tienen el hábito de pagar a tiempo o que algo externo (crisis de liquidez, olvido, vergüenza) interrumpió el flujo.

**El protocolo de los 3 momentos:**

**Momento 1, Día 3 después del vencimiento (recordatorio suave)**
Mensaje breve, sin tono de cobro: "Hola [Nombre], vi que tienes un saldo pendiente de [monto]. ¿Todo bien por tu lado?" El tono de preocupación genuina funciona mejor que el tono de cobro.

**Momento 2, Día 7 (conversación directa)**
Llamada o mensaje más directo: "Necesito que resolvamos el tema del pago esta semana. ¿Puedes hacer la transferencia hoy o mañana?" Claro, sin agresión, sin dar más plazo sin un compromiso concreto.

**Momento 3, Día 14 (conversación de fondo)**
Aquí ya hay que entender qué está pasando. A veces la morosidad es un síntoma de que el participante está considerando salirse. Una conversación honesta en este punto puede resolver tanto el pago como la retención.

**Qué NO hacer:**
- Cobrar por WhatsApp grupal o delante de otros participantes
- Dar plazos indefinidos sin acuerdo concreto
- Permitir que el participante llegue a sesiones mientras la deuda crece sin conversación

**ELEVA te da:** alertas automáticas en días 3, 7 y 14, historial de conversaciones y registro de compromisos de pago, para que el proceso sea consistente sin que dependa de que alguien recuerde.`,
  },
  {
    keywords: ["revisión de promesas", "promesas", "sabio", "beca", "revisión formal"],
    role: ["coach", "owner"],
    respuesta: `**Cómo facilitar una Revisión de Promesas que realmente transforme**

La Revisión de Promesas no es una evaluación. Es un ritual de rendición de cuentas que activa los mecanismos más profundos del compromiso humano.

**Preparación (72 horas antes):**
El participante escribe en su expediente el estado de cada promesa, no para presentar una versión bonita, sino para confrontarse con honestidad. El coach la revisa y prepara 3-5 preguntas específicas basadas en lo que documenta.

**La apertura (15 min):**
No empieces con las promesas. Empieza con la persona. "¿Cómo llegaste hoy?" La respuesta a esa pregunta le dice al coach en qué estado emocional está el participante antes de entrar al proceso.

**El recorrido por las promesas (45-60 min):**
Para cada promesa, el participante comparte: qué comprometió, qué cumplió, qué no cumplió y por qué. El coach no juzga, hace preguntas que profundizan la reflexión. "¿Qué crees que te detuvo?" "¿Qué dice eso de ti?"

**El reconocimiento del camino:**
Antes de cerrar, el coach nombra explícitamente el crecimiento que observa. No el progreso en las promesas, el crecimiento en la persona. "Lo que veo en ti hoy que no estaba hace 6 meses es..."

**La beca como reconocimiento:**
Si el participante demuestra compromiso y crecimiento genuino, la beca no se otorga como descuento comercial, se otorga como reconocimiento de que este proceso ha valido la pena y vale la pena continuar. Eso cambia completamente cómo la recibe.

**Lo que hace a una revisión memorable:**
La honestidad del participante y la presencia total del coach. Una revisión donde el participante se escuchó a sí mismo por primera vez en meses vale más que mil charlas motivacionales.`,
  },
  {
    keywords: ["primera generación", "nuevo grupo", "inicio", "primer entrenamiento", "despertar"],
    role: ["coach", "owner", "ops"],
    respuesta: `**Cómo preparar el primer entrenamiento de una nueva generación**

Los primeros 90 minutos de Despertar definen el tono de todo el proceso. Lo que pasa ahí se queda en la memoria emocional de los participantes más tiempo que cualquier contenido que venga después.

**Antes del evento:**

*Logística:*
Confirmar asistencia de todos los invitados 48 horas antes. Tener los gafetes listos, el espacio preparado con 30 minutos de anticipación, el equipo asignado a recepción con nombres memorizados. El participante que llega y alguien lo llama por su nombre en la puerta ya sintió algo diferente.

*El equipo:*
Briefing completo del equipo la noche anterior: quién llega, cuál es su contexto, quién los invitó, qué expectativas traen. El equipo no son decoración, son la primera experiencia de comunidad que el nuevo participante va a tener.

**Durante el evento:**

*La acogida:* No hay segunda oportunidad para una primera impresión. Calidez genuina, no protocolo.

*La apertura:* El primer ejercicio debe hacer dos cosas: romper el hielo y crear pertenencia inmediata. Algo que les haga hablar de sí mismos con personas que acaban de conocer.

*La visión del proceso:* Que quede claro desde el inicio qué van a vivir, qué se espera de ellos y qué pueden esperar del programa. La claridad en el contrato inicial previene el 60% de los problemas de compromiso que aparecen después.

**Después del primer día:**
El coach o el Capitán envía un mensaje personal a cada nuevo participante antes de que acabe el día. No un mensaje grupal, uno personal. "Vi algo en ti hoy que quiero que sepas..."

**La métrica que importa:**
Si el 80%+ de los participantes del primer día regresan al segundo, lo hiciste bien.`,
  },
  {
    keywords: ["retención", "retener participantes", "que se queden", "perder participantes"],
    role: ["owner", "coach"],
    respuesta: `**Estrategia de retención: los 3 pilares que deciden si alguien se queda**

La retención no se decide en el momento en que alguien quiere irse. Se construye o se destruye en los momentos ordinarios del proceso.

**Pilar 1, El sentido de pertenencia**
El participante que tiene amigos reales dentro del programa no se va. La tribu y los clanes no son decoración del método, son el mecanismo de retención más poderoso que existe. Un participante que formó vínculos reales tiene un costo emocional altísimo de salirse.

*Palanca de acción:* Facilitar encuentros fuera del programa, cenas de clan, llamadas entre sabios y participantes, grupos de seguimiento. El tiempo entre sesiones es donde se pierde o se consolida el vínculo.

**Pilar 2, El progreso visible**
Las personas se quedan en procesos donde sienten que están avanzando. Si alguien no puede responder "¿en qué soy diferente hoy que hace 3 meses?", está en riesgo de salirse.

*Palanca de acción:* Las revisiones de promesas periódicas son el mecanismo de visibilización del avance. El coach debe hacer explícito el crecimiento que el participante no puede ver por sí mismo. "Hace 4 meses no podías decir lo que acabas de decir."

**Pilar 3, La relación con el coach**
El participante que siente que su coach lo conoce realmente, no como "un participante del grupo" sino como persona, tiene 3x más probabilidad de completar el proceso.

*Palanca de acción:* Una llamada personal de 15 minutos al mes fuera del programa. No para revisar promesas ni para cobrar, solo para saber cómo está. Este gesto simple tiene el mayor ROI de retención de cualquier táctica.

**La pregunta que el dueño debe hacerse:**
¿Cuántos de mis participantes, si les preguntaras hoy, dirían que esta comunidad es una parte importante de su vida? Esa respuesta es tu verdadero índice de retención.`,
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Msg = { role: "user" | "ai"; content: string; type?: "charla" | "consejo" }
type Tab = "charlas" | "consulta"

// ─── Typewriter ───────────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 8) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed(""); setDone(false)
    if (!text) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])
  return { displayed, done }
}

// ─── Markdown-lite renderer ──────────────────────────────────────────────────

function renderMD(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**") && line.indexOf("**", 2) === line.length - 2) {
      return <p key={i} className="font-black text-white text-[11px] uppercase tracking-wider mt-3 mb-0.5">{line.slice(2, -2)}</p>
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-[11px] text-white/70 leading-relaxed mb-1.5">
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} className="text-white font-bold">{p.slice(2, -2)}</strong>
            : p
        )}
      </p>
    )
  })
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function AIMessage({ msg, isLast }: { msg: Msg; isLast: boolean }) {
  const { displayed, done } = useTypewriter(
    msg.role === "ai" && isLast ? msg.content : msg.content, 4
  )
  const content = msg.role === "ai" && isLast ? displayed : msg.content

  return (
    <div className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
      {msg.role === "ai" && (
        <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3 text-violet-400" />
        </div>
      )}
      <div className={cn(
        "rounded-xl px-3 py-2.5 max-w-[88%] space-y-0.5",
        msg.role === "user"
          ? "bg-violet-600 text-white text-[11px] leading-relaxed"
          : "bg-white/[0.06] border border-white/8"
      )}>
        {msg.role === "ai" ? renderMD(content) : <p className="text-[11px]">{content}</p>}
        {msg.role === "ai" && !done && <span className="inline-block w-1.5 h-3 bg-violet-400 animate-pulse ml-0.5" />}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AIAssistant({ role }: { role: "owner" | "coach" | "ops" }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>("charlas")
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [charlaIdx, setCharlaIdx] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const roleLabel = role === "owner" ? "dueño" : role === "coach" ? "coach" : "operaciones"

  function generateCharla(idx?: number) {
    const i = idx !== undefined ? idx : charlaIdx
    const charla = CHARLAS[i % CHARLAS.length]
    const userMsg: Msg = { role: "user", content: `Genera una charla sobre: ${charla.tema}`, type: "charla" }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", content: charla.contenido, type: "charla" }])
      setIsTyping(false)
    }, 600)
    setCharlaIdx((i + 1) % CHARLAS.length)
  }

  function handleSend() {
    if (!input.trim() || isTyping) return
    const q = input.trim()
    setInput("")
    const userMsg: Msg = { role: "user", content: q }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      const lq = q.toLowerCase()
      const match = CONSEJOS.find(
        (c) => c.role.includes(role) && c.keywords.some((k) => lq.includes(k))
      )
      const response = match
        ? match.respuesta
        : `**Sobre tu pregunta**\n\nEsta es un área importante para cualquier centro de transformación. Te recomiendo considerar tres ángulos:\n\n**El ángulo humano:** Antes de cualquier decisión operativa, identifica qué está sintiendo o necesitando la persona o el grupo involucrado. Los problemas de centro son casi siempre problemas humanos con síntomas operativos.\n\n**El ángulo sistémico:** ¿Es esto un evento aislado o hay un patrón? Si es patrón, la solución no está en el caso individual sino en el proceso que lo genera.\n\n**El ángulo de datos:** ELEVA tiene la información que necesitas para tomar esta decisión con claridad, revisa el historial del participante, el momentum de la generación o el estado financiero del período. Los datos eliminan la ambigüedad.\n\nPara una consulta más específica, cuéntame más contexto: ¿es un tema de una persona, del grupo, del equipo o del negocio?`
      setMessages((prev) => [...prev, { role: "ai", content: response }])
      setIsTyping(false)
    }, 800)
  }

  const charlaActual = CHARLAS[charlaIdx % CHARLAS.length]

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all",
          open
            ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
        )}
      >
        <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
        <span className="flex-1 text-left">Asistente IA</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-0 left-0 md:left-60 right-0 md:right-auto md:w-[340px] z-50 flex flex-col"
          style={{ height: "min(520px, 75vh)" }}>
          <div className="flex flex-col h-full bg-[#0e0e1a] border border-violet-500/20 rounded-t-2xl shadow-2xl shadow-black/60 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-violet-600/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white">Asistente ELEVA</p>
                  <p className="text-[9px] text-white/30">Metodología VIA · Vista {roleLabel}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/70 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/8 flex-shrink-0">
              {([
                { id: "charlas" as Tab, label: "Charlas", icon: BookOpen },
                { id: "consulta" as Tab, label: "Consultar", icon: Lightbulb },
              ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold transition-colors",
                    tab === id ? "text-violet-300 border-b-2 border-violet-500" : "text-white/30 hover:text-white/60"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">

              {/* CHARLAS TAB */}
              {tab === "charlas" && (
                <div className="p-3 space-y-3 h-full flex flex-col">
                  {messages.filter(m => m.type === "charla" || messages.indexOf(m) >= messages.findLastIndex(m => m.type === "charla") - 1).length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white mb-1">Generador de charlas</p>
                        <p className="text-[11px] text-white/40 leading-relaxed">
                          Charlas motivacionales con estructura probada: hook, dato, patrón humano, principio. Listas para usar en tus sesiones.
                        </p>
                      </div>
                      <div className="w-full space-y-1.5">
                        {CHARLAS.slice(0, 4).map((c, i) => (
                          <button
                            key={i}
                            onClick={() => generateCharla(i)}
                            className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 hover:bg-violet-600/15 hover:border-violet-500/25 transition-colors text-[10px] text-white/60 hover:text-white/90"
                          >
                            <span className="text-violet-400 mr-1.5">→</span>
                            {c.tema}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-3 overflow-y-auto pb-2">
                      {messages.filter(m => m.type === "charla").map((m, i, arr) => (
                        <AIMessage key={i} msg={m} isLast={i === arr.length - 1 && m.role === "ai"} />
                      ))}
                      {isTyping && (
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3 h-3 text-violet-400" />
                          </div>
                          <div className="bg-white/[0.06] rounded-xl px-3 py-2.5 flex gap-1 items-center">
                            {[0, 1, 2].map(i => <div key={i} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                          </div>
                        </div>
                      )}
                      <div ref={bottomRef} />
                    </div>
                  )}

                  {/* Charla actions */}
                  <div className="flex-shrink-0 space-y-2 pt-2 border-t border-white/8">
                    <p className="text-[9px] text-white/25 uppercase tracking-wider font-semibold">Siguiente: {charlaActual.tema}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => generateCharla()}
                        disabled={isTyping}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold transition-colors disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3" />
                        Generar charla
                      </button>
                      <button
                        onClick={() => setMessages([])}
                        className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                        title="Limpiar"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {CHARLAS.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => generateCharla(i)}
                          disabled={isTyping}
                          className="text-[9px] px-2 py-1 rounded-full bg-white/[0.04] border border-white/8 text-white/40 hover:text-violet-300 hover:border-violet-500/30 hover:bg-violet-600/10 transition-colors disabled:opacity-40"
                        >
                          {c.tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CONSULTA TAB */}
              {tab === "consulta" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.filter(m => !m.type).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white mb-1">Consultor estratégico</p>
                          <p className="text-[11px] text-white/40 leading-relaxed">
                            Pregunta sobre operación del centro, retención, enrolamiento, coaching, finanzas o cualquier situación específica.
                          </p>
                        </div>
                        <div className="w-full space-y-1.5">
                          {[
                            "¿Cómo manejo un participante que quiere cancelar?",
                            "¿Cómo mejorar el enrolamiento esta semana?",
                            "¿Cómo reactivar una generación con momentum bajo?",
                            "¿Cómo hacer un brief de coach efectivo?",
                          ].map((q) => (
                            <button
                              key={q}
                              onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 100) }}
                              className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 hover:bg-indigo-600/15 hover:border-indigo-500/25 transition-colors text-[10px] text-white/60 hover:text-white/90"
                            >
                              <span className="text-indigo-400 mr-1.5">→</span>
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {messages.filter(m => !m.type).map((m, i, arr) => (
                          <AIMessage key={i} msg={m} isLast={i === arr.length - 1 && m.role === "ai"} />
                        ))}
                        {isTyping && (
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-3 h-3 text-violet-400" />
                            </div>
                            <div className="bg-white/[0.06] rounded-xl px-3 py-2.5 flex gap-1 items-center">
                              {[0, 1, 2].map(i => <div key={i} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                            </div>
                          </div>
                        )}
                        <div ref={bottomRef} />
                      </>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex-shrink-0 p-3 border-t border-white/8">
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Pregunta algo sobre tu centro..."
                        className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder:text-white/25 outline-none focus:border-violet-500/50 focus:bg-white/[0.08] transition-colors"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => setMessages([])}
                      className="mt-1.5 text-[9px] text-white/20 hover:text-white/40 transition-colors w-full text-center"
                    >
                      limpiar conversación
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
