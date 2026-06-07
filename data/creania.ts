import type {
  Coach,
  Specialist,
  Cohorte,
  Participant,
  Mission,
  FeedPost,
  LeaderboardEntry,
  CenterStats,
  CRMParticipant,
  CoachMetrics,
  Center,
} from "@/lib/types"

export const CENTER = {
  name: "Creania",
  fullName: "Creania Transformación",
  city: "Ciudad de México",
  founder: "Carlos Mendoza",
  model: "Despertar (3 días) → Expansión (4 días) → Vía Creania (5 meses)",
}

export const CENTERS: Center[] = [
  {
    id: "cdmx",
    name: "Creania CDMX",
    fullName: "Creania Transformación CDMX",
    city: "Ciudad de México",
    country: "México",
    founder: "Carlos Mendoza",
    activeParticipants: 247,
    atRiskCount: 14,
    averageMomentum: 67,
    mrr: 247400,
    coaches: 3,
    activeCohortes: 3,
    nextEventDays: 4,
    monthlyGrowth: 12,
    monthlyRevenue: 342200,
    collected: 293600,
    pending: 48600,
    netMargin: 72.6,
  },
  {
    id: "mty",
    name: "Creania Monterrey",
    fullName: "Creania Transformación Monterrey",
    city: "Monterrey",
    country: "México",
    founder: "Gabriela Salazar",
    activeParticipants: 134,
    atRiskCount: 7,
    averageMomentum: 71,
    mrr: 148600,
    coaches: 2,
    activeCohortes: 2,
    nextEventDays: 8,
    monthlyGrowth: 18,
    monthlyRevenue: 183200,
    collected: 162000,
    pending: 21200,
    netMargin: 68.4,
  },
  {
    id: "mia",
    name: "Creania Miami",
    fullName: "Creania Transformation Miami",
    city: "Miami",
    country: "USA",
    founder: "Andrés Bermúdez",
    activeParticipants: 89,
    atRiskCount: 4,
    averageMomentum: 74,
    mrr: 112000,
    coaches: 2,
    activeCohortes: 2,
    nextEventDays: 12,
    monthlyGrowth: 24,
    monthlyRevenue: 138500,
    collected: 124000,
    pending: 14500,
    netMargin: 74.2,
  },
]

export const STATS: CenterStats = {
  activeParticipants: 247,
  atRiskCount: 14,
  activeCohortes: 3,
  nextEventDays: 4,
  averageMomentum: 67,
  monthlyGrowth: 12,
}

export const COACHES: Coach[] = [
  { id: "c1", name: "Ana Reyes", avatar: "AR", cohorte: "Generación Omega", lastContactDaysAgo: 9 },
  { id: "c2", name: "Marco Fuentes", avatar: "MF", cohorte: "Generación Norte", lastContactDaysAgo: 2 },
  { id: "c3", name: "Daniela Torres", avatar: "DT", cohorte: "Generación Vía 12", lastContactDaysAgo: 0 },
  { id: "c4", name: "Rodrigo Peña", avatar: "RP", cohorte: "General", lastContactDaysAgo: 5 },
  { id: "c5", name: "Sofía Villanueva", avatar: "SV", cohorte: "General", lastContactDaysAgo: 1 },
  { id: "c6", name: "Luis Herrera", avatar: "LH", cohorte: "General", lastContactDaysAgo: 3 },
]

export const SPECIALISTS: Specialist[] = [
  { id: "s1", name: "Laura Medina", specialty: "Coach Financiero", avatar: "LM", available: true },
  { id: "s2", name: "Dr. Arturo Vega", specialty: "Psicólogo", avatar: "AV", available: true },
  { id: "s3", name: "Lic. Carla Soto", specialty: "Nutrióloga", avatar: "CS", available: false },
  { id: "s4", name: "Fernanda Ruiz", specialty: "Terapeuta de Pareja", avatar: "FR", available: true },
  { id: "s5", name: "Ing. Samuel Torres", specialty: "Coach de Negocios", avatar: "ST", available: true },
  { id: "s6", name: "Dra. Mónica Lima", specialty: "Psicóloga", avatar: "ML", available: true },
  { id: "s7", name: "Carlos Ibáñez", specialty: "Coach de Liderazgo", avatar: "CI", available: true },
  { id: "s8", name: "Lic. Patricia Wong", specialty: "Coach Financiero", avatar: "PW", available: false },
]

export const COHORTES: Cohorte[] = [
  {
    id: "omega",
    name: "Generación Omega",
    phase: "Vía Creania",
    phaseDetail: "Mes 3 de 5",
    participants: 89,
    momentum: 74,
    status: "active",
    coach: "Ana Reyes",
  },
  {
    id: "norte",
    name: "Generación Norte",
    phase: "Expansión",
    phaseDetail: "Completada",
    participants: 67,
    momentum: 58,
    status: "attention",
    coach: "Marco Fuentes",
  },
  {
    id: "via12",
    name: "Generación Vía 12",
    phase: "Despertar",
    phaseDetail: "Completado",
    participants: 91,
    momentum: 81,
    status: "thriving",
    coach: "Daniela Torres",
  },
]

export const VALERIA: Participant = {
  id: "p1",
  name: "Valeria Romo",
  avatar: "VR",
  cohorte: "Generación Omega",
  phase: "Vía Creania",
  phaseDetail: "Mes 3 de 5",
  momentum: 23,
  streak: 0,
  bestStreak: 22,
  inactiveDays: 11,
  coachId: "c1",
  riskLevel: "high",
  missionsCompleted: 3,
  missionsTotal: 12,
  pendingMissions: 3,
  lastAccess: "hace 11 días",
  objective: {
    title: "Independencia financiera",
    progress: 40,
    specialistId: "s1",
  },
  coachNote: "Hablar con Valeria sobre sus compromisos de semana 8. Siento que está evitando la conversación de finanzas.",
  coachNoteDate: "hace 9 días",
  payments: [
    { concept: "Vía Creania — Mes 1", amount: 4200, date: "1 mar 2025", status: "paid" },
    { concept: "Vía Creania — Mes 2", amount: 4200, date: "1 abr 2025", status: "paid" },
    { concept: "Vía Creania — Mes 3", amount: 4200, date: "1 may 2025", status: "paid" },
    { concept: "Vía Creania — Mes 4", amount: 4200, date: "1 jun 2025", status: "pending" },
  ],
  activity: [
    ...Array.from({ length: 19 }, (_, i) => ({
      date: `día ${30 - i}`,
      active: Math.random() > 0.35,
      daysAgo: 30 - i,
    })),
    ...Array.from({ length: 11 }, (_, i) => ({
      date: `día ${11 - i}`,
      active: false,
      daysAgo: 11 - i,
    })),
  ],
}

export const DIEGO: Participant = {
  id: "p2",
  name: "Diego Salinas",
  avatar: "DS",
  cohorte: "Generación Vía 12",
  phase: "Vía Creania",
  phaseDetail: "Mes 1 de 5",
  momentum: 94,
  streak: 22,
  bestStreak: 22,
  inactiveDays: 0,
  coachId: "c3",
  riskLevel: "low",
  missionsCompleted: 9,
  missionsTotal: 12,
  pendingMissions: 0,
  lastAccess: "hoy",
  objective: {
    title: "Escalar mi negocio",
    progress: 75,
    specialistId: "s5",
  },
  coachNote: "Diego está siendo un embajador increíble. Considerar para mentor de próxima gen.",
  coachNoteDate: "hace 2 días",
  payments: [
    { concept: "Despertar", amount: 6500, date: "15 ene 2025", status: "paid" },
    { concept: "Expansión", amount: 8900, date: "8 feb 2025", status: "paid" },
    { concept: "Vía Creania — Mes 1", amount: 4200, date: "1 may 2025", status: "paid" },
  ],
  activity: Array.from({ length: 30 }, (_, i) => ({
    date: `día ${30 - i}`,
    active: true,
    daysAgo: 30 - i,
  })),
}

export const MARIANA: Participant = {
  id: "p3",
  name: "Mariana Ortiz",
  avatar: "MO",
  cohorte: "Generación Norte",
  phase: "Expansión",
  phaseDetail: "Completada",
  momentum: 51,
  streak: 3,
  bestStreak: 14,
  inactiveDays: 0,
  coachId: "c2",
  riskLevel: "medium",
  missionsCompleted: 6,
  missionsTotal: 12,
  pendingMissions: 1,
  lastAccess: "hace 2 días",
  objective: {
    title: "Mejorar mis relaciones personales",
    progress: 55,
    specialistId: "s4",
  },
  coachNote: "Mariana asiste pero no se compromete entre sesiones. Necesita activación.",
  coachNoteDate: "hace 4 días",
  payments: [
    { concept: "Despertar", amount: 6500, date: "10 dic 2024", status: "paid" },
    { concept: "Expansión", amount: 8900, date: "18 ene 2025", status: "paid" },
  ],
  activity: Array.from({ length: 30 }, (_, i) => ({
    date: `día ${30 - i}`,
    active: Math.random() > 0.5,
    daysAgo: 30 - i,
  })),
}

export const AT_RISK_PARTICIPANTS = [
  { ...VALERIA },
  {
    id: "p4", name: "Roberto Campos", avatar: "RC", momentum: 31, inactiveDays: 8,
    cohorte: "Generación Norte", riskLevel: "high" as const, coachId: "c2",
    pendingMissions: 2, phase: "Expansión" as const,
  },
  {
    id: "p5", name: "Lucía Fernández", avatar: "LF", momentum: 38, inactiveDays: 6,
    cohorte: "Generación Omega", riskLevel: "high" as const, coachId: "c1",
    pendingMissions: 1, phase: "Vía Creania" as const,
  },
  {
    id: "p6", name: "Andrés Mora", avatar: "AM", momentum: 42, inactiveDays: 4,
    cohorte: "Generación Norte", riskLevel: "medium" as const, coachId: "c2",
    pendingMissions: 1, phase: "Expansión" as const,
  },
  { ...MARIANA },
  {
    id: "p7", name: "Gabriela Cruz", avatar: "GC", momentum: 45, inactiveDays: 3,
    cohorte: "Generación Vía 12", riskLevel: "medium" as const, coachId: "c3",
    pendingMissions: 0, phase: "Despertar" as const,
  },
]

export const CURRENT_MISSION: Mission = {
  id: "m1",
  week: 12,
  title: "Tu compromiso de esta semana",
  description: "15 minutos de reflexión diaria + una acción concreta hacia tu objetivo de independencia financiera. Documenta qué hiciste y qué aprendiste.",
  completed: false,
  dueInDays: 2,
  requiresEvidence: true,
}

export const FEED_POSTS: FeedPost[] = [
  {
    id: "f0",
    author: "Ana Reyes",
    avatar: "AR",
    content: "Generación Omega: esta semana el reto es la consistencia, no la intensidad. 15 minutos todos los días valen más que 2 horas una vez. Estoy con ustedes.",
    minutesAgo: 45,
    reactions: 34,
    comments: 8,
    isPinned: true,
    isCoach: true,
  },
  {
    id: "f1",
    author: "Diego Salinas",
    avatar: "DS",
    content: "Día 22 de racha. Hoy tuve la conversación más difícil con mi socio sobre finanzas. No fue perfecta pero fue honesta. Eso cuenta.",
    minutesAgo: 120,
    reactions: 47,
    comments: 12,
  },
  {
    id: "f2",
    author: "Carmen Valdés",
    avatar: "CV",
    content: "Completé la misión de la semana antes del miércoles por primera vez. Se siente diferente cuando lo haces por ti y no por el check.",
    minutesAgo: 180,
    reactions: 29,
    comments: 6,
  },
  {
    id: "f3",
    author: "Héctor Ramírez",
    avatar: "HR",
    content: "Tuve mi primera sesión con Laura (coach financiero) y me voló la cabeza. Recomendado para todos los que tienen objetivos de dinero este mes.",
    minutesAgo: 360,
    reactions: 22,
    comments: 9,
  },
]

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Diego Salinas", avatar: "DS", streak: 22 },
  { rank: 2, name: "Carmen Valdés", avatar: "CV", streak: 18 },
  { rank: 3, name: "Héctor Ramírez", avatar: "HR", streak: 15 },
  { rank: 4, name: "Priya Nair", avatar: "PN", streak: 12 },
  { rank: 5, name: "Valeria Romo", avatar: "VR", streak: 0, isCurrentUser: true },
]

export const MOMENTUM_HISTORY = [
  { day: "30", value: 68 },
  { day: "29", value: 71 },
  { day: "28", value: 65 },
  { day: "27", value: 73 },
  { day: "26", value: 70 },
  { day: "25", value: 69 },
  { day: "24", value: 72 },
  { day: "23", value: 68 },
  { day: "22", value: 74 },
  { day: "21", value: 70 },
  { day: "20", value: 66 },
  { day: "19", value: 71 },
  { day: "18", value: 63 },
  { day: "17", value: 58 },
  { day: "16", value: 52 },
  { day: "15", value: 48 },
  { day: "14", value: 43 },
  { day: "13", value: 39 },
  { day: "12", value: 35 },
  { day: "11", value: 31 },
  { day: "10", value: 28 },
  { day: "9", value: 26 },
  { day: "8", value: 25 },
  { day: "7", value: 24 },
  { day: "6", value: 24 },
  { day: "5", value: 23 },
  { day: "4", value: 23 },
  { day: "3", value: 23 },
  { day: "2", value: 23 },
  { day: "hoy", value: 23 },
]

export const VALERIA_JOURNEY = {
  leadSource: "Referida por Diego Salinas",
  leadDate: "20 ene 2025",
  webinarAttended: "Webinar: Poder Sin Límites — 18 ene 2025",
  despertar: {
    date: "15 feb 2025",
    coachNote: "Valeria llegó cerrada el día 1 pero al día 3 tuvo un quiebre poderoso. Potencial alto, objetivo financiero claro. Recomiendo seguimiento semanal.",
    activationScore: "Alta" as const,
    daysToExpansion: 12,
  },
  expansion: {
    date: "27 feb 2025",
    contentPct: 82,
    missionsCompleted: 7,
    coachNote: "Muy aplicada durante Expansión. Conectó bien con el módulo de creencias sobre dinero. Entró a Vía Creania con momentum alto.",
    momentumAtEntry: 71,
  },
}

// ─── Nivel 3 — Graduation scores ─────────────────────────────────────────────

export interface Nivel3Participant {
  id: string; name: string; avatar: string; cohorte: string; coachId: string
  weekendActive: 1 | 2 | 3          // which enrollment weekend they're in
  enrolled: number                   // people they've successfully enrolled
  enrollTarget: number               // needed to graduate comfortably
  attendancePct: number              // 0–100
  goalsCompleted: number; goalsTotal: number
  coachingCalls: number; coachingCallsTotal: number
  graduationScore: number            // 0–100 calculated
  atRisk: boolean
}

export const NIVEL3_PARTICIPANTS: Nivel3Participant[] = [
  { id: "n1", name: "Diego Salinas",    avatar: "DS", cohorte: "Vía 12", coachId: "c3",
    weekendActive: 2, enrolled: 5, enrollTarget: 4, attendancePct: 100,
    goalsCompleted: 3, goalsTotal: 3, coachingCalls: 4, coachingCallsTotal: 4,
    graduationScore: 91, atRisk: false },
  { id: "n2", name: "Carmen Valdés",    avatar: "CV", cohorte: "Vía 12", coachId: "c3",
    weekendActive: 2, enrolled: 3, enrollTarget: 4, attendancePct: 95,
    goalsCompleted: 2, goalsTotal: 3, coachingCalls: 3, coachingCallsTotal: 4,
    graduationScore: 72, atRisk: false },
  { id: "n3", name: "Héctor Ramírez",   avatar: "HR", cohorte: "Vía 12", coachId: "c3",
    weekendActive: 2, enrolled: 2, enrollTarget: 4, attendancePct: 88,
    goalsCompleted: 2, goalsTotal: 3, coachingCalls: 2, coachingCallsTotal: 4,
    graduationScore: 54, atRisk: true },
  { id: "n4", name: "Priya Nair",       avatar: "PN", cohorte: "Vía 12", coachId: "c3",
    weekendActive: 3, enrolled: 4, enrollTarget: 4, attendancePct: 100,
    goalsCompleted: 3, goalsTotal: 3, coachingCalls: 4, coachingCallsTotal: 4,
    graduationScore: 88, atRisk: false },
  { id: "n5", name: "Sofía Guerrero",   avatar: "SG", cohorte: "Vía 12", coachId: "c3",
    weekendActive: 1, enrolled: 1, enrollTarget: 4, attendancePct: 75,
    goalsCompleted: 1, goalsTotal: 3, coachingCalls: 1, coachingCallsTotal: 4,
    graduationScore: 31, atRisk: true },
  { id: "n6", name: "Marco Fuentes",    avatar: "MF", cohorte: "Norte", coachId: "c2",
    weekendActive: 3, enrolled: 6, enrollTarget: 4, attendancePct: 100,
    goalsCompleted: 3, goalsTotal: 3, coachingCalls: 4, coachingCallsTotal: 4,
    graduationScore: 97, atRisk: false },
  { id: "n7", name: "Isabel Peñaloza",  avatar: "IP", cohorte: "Norte", coachId: "c2",
    weekendActive: 2, enrolled: 2, enrollTarget: 4, attendancePct: 92,
    goalsCompleted: 2, goalsTotal: 3, coachingCalls: 3, coachingCallsTotal: 4,
    graduationScore: 58, atRisk: true },
]

// ─── Pre-Basic training — enrolled but not confirmed ──────────────────────────

export interface PreTrainingPending {
  id: string; name: string; avatar: string
  enrolledBy: string                // name of Level 3 participant who invited them
  enrolledByAvatar: string
  enrollDate: string
  trainingDate: string
  daysUntilTraining: number
  price: number
  confirmed: boolean
  contactAttempts: number
  phone: string
}

export const PRE_TRAINING_PENDING: PreTrainingPending[] = [
  { id: "pt1", name: "Rodrigo Espinosa", avatar: "RE", enrolledBy: "Diego Salinas",    enrolledByAvatar: "DS", enrollDate: "28 may", trainingDate: "13 jun", daysUntilTraining: 7, price: 6500, confirmed: false, contactAttempts: 0, phone: "+52 55 1234 5678" },
  { id: "pt2", name: "Ana Paula Vidal",  avatar: "AV", enrolledBy: "Carmen Valdés",    enrolledByAvatar: "CV", enrollDate: "29 may", trainingDate: "13 jun", daysUntilTraining: 7, price: 6500, confirmed: false, contactAttempts: 1, phone: "+52 55 8765 4321" },
  { id: "pt3", name: "Luis Torres",      avatar: "LT", enrolledBy: "Diego Salinas",    enrolledByAvatar: "DS", enrollDate: "27 may", trainingDate: "13 jun", daysUntilTraining: 7, price: 6500, confirmed: true,  contactAttempts: 0, phone: "+52 55 2345 6789" },
  { id: "pt4", name: "Paola Mendez",     avatar: "PM", enrolledBy: "Héctor Ramírez",   enrolledByAvatar: "HR", enrollDate: "30 may", trainingDate: "13 jun", daysUntilTraining: 7, price: 6500, confirmed: false, contactAttempts: 2, phone: "+52 55 3456 7890" },
  { id: "pt5", name: "Carlos Ibáñez",    avatar: "CI", enrolledBy: "Marco Fuentes",    enrolledByAvatar: "MF", enrollDate: "26 may", trainingDate: "13 jun", daysUntilTraining: 7, price: 6500, confirmed: true,  contactAttempts: 0, phone: "+52 55 4567 8901" },
  { id: "pt6", name: "Fernanda Ruiz",    avatar: "FR", enrolledBy: "Sofía Guerrero",   enrolledByAvatar: "SG", enrollDate: "1 jun",  trainingDate: "13 jun", daysUntilTraining: 7, price: 6500, confirmed: false, contactAttempts: 0, phone: "+52 55 5678 9012" },
  { id: "pt7", name: "Javier Morales",   avatar: "JM", enrolledBy: "Isabel Peñaloza",  enrolledByAvatar: "IP", enrollDate: "2 jun",  trainingDate: "13 jun", daysUntilTraining: 7, price: 6500, confirmed: false, contactAttempts: 1, phone: "+52 55 6789 0123" },
  { id: "pt8", name: "Daniela Castro",   avatar: "DC", enrolledBy: "Priya Nair",       enrolledByAvatar: "PN", enrollDate: "3 jun",  trainingDate: "13 jun", daysUntilTraining: 7, price: 6500, confirmed: true,  contactAttempts: 0, phone: "+52 55 7890 1234" },
]

export const FINANCIALS = {
  monthlyRevenue: 342200,
  mrr: 247400,
  enrollments: 94800,
  collected: 293600,
  pending: 48600,
  vsLastMonth: 12,
  coachesCost: 54000,
  staffCost: 18000,
  platformCost: 8500,
  totalCosts: 80500,
  netMargin: 72.6,
  netIncome: 213100,
  projectionNextMonth: 361000,
  projectionGrowth: 6,
  byCohorte: [
    { name: "Generación Omega", participants: 89, rate: 4200, expected: 373800, collected: 344400, pending: 29400 },
    { name: "Generación Norte", rate: null, inscriptions: 14, avgTicket: 7700, expected: 107800, collected: 98900, pending: 8900 },
    { name: "Generación Vía 12", participants: 91, rate: 4200, expected: 382200, collected: 343800, pending: 38400 },
  ],
  pendingParticipants: [
    { name: "Valeria Romo", avatar: "VR", amount: 4200, cohorte: "Gen. Omega", overdueDays: 3 },
    { name: "Omar Castillo", avatar: "OC", amount: 4200, cohorte: "Gen. Omega", overdueDays: 5 },
    { name: "Paola Serrano", avatar: "PS", amount: 8900, cohorte: "Gen. Norte", overdueDays: 7 },
    { name: "Carlos Peñafiel", avatar: "CP", amount: 4200, cohorte: "Gen. Vía 12", overdueDays: 0 },
  ],
}

export const REGISTRATION_COHORTES = [
  {
    id: "omega",
    name: "Generación Omega",
    coach: "Ana Reyes",
    coachAvatar: "AR",
    phase: "Vía Creania" as const,
    phaseDetail: "Mes 3 de 5",
    participants: 89,
    capacity: 100,
    momentum: 74,
    available: 11,
  },
  {
    id: "norte",
    name: "Generación Norte",
    coach: "Marco Fuentes",
    coachAvatar: "MF",
    phase: "Expansión" as const,
    phaseDetail: "Completada",
    participants: 67,
    capacity: 80,
    momentum: 58,
    available: 13,
  },
  {
    id: "via12",
    name: "Generación Vía 12",
    coach: "Daniela Torres",
    coachAvatar: "DT",
    phase: "Vía Creania" as const,
    phaseDetail: "Mes 1 de 5",
    participants: 91,
    capacity: 100,
    momentum: 81,
    available: 9,
  },
]

export const RECENT_ACTIVITY = [
  { text: "Diego Salinas completó su misión de semana 22", time: "hace 45 min", type: "success" },
  { text: "Carmen Valdés agendó sesión con Laura Medina (Coach Financiero)", time: "hace 2 hrs", type: "specialist" },
  { text: "Nuevo participante en Generación Norte: Sofía Garza", time: "hace 3 hrs", type: "new" },
  { text: "Héctor Ramírez rompió su racha de 15 días", time: "hace 5 hrs", type: "warning" },
  { text: "Próximo evento: Sesión en vivo Generación Omega — jueves 7pm", time: "en 4 días", type: "event" },
]

export const CRM_PARTICIPANTS: CRMParticipant[] = [
  // Generación Omega — coach Ana Reyes (c1)
  { id: "p1",  name: "Valeria Romo",       avatar: "VR", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 23,  lastAccessDays: 11, paymentStatus: "pending",  paymentAmount: 4200, riskLevel: "high",   coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 3,  missionsTotal: 12 },
  { id: "p10", name: "Carmen Valdés",      avatar: "CV", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 88,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 11, missionsTotal: 12, tag: "destacado" },
  { id: "p11", name: "Héctor Ramírez",     avatar: "HR", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 62,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 8,  missionsTotal: 12 },
  { id: "p12", name: "Lucía Fernández",    avatar: "LF", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 38,  lastAccessDays: 6,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "high",   coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 4,  missionsTotal: 12 },
  { id: "p13", name: "Priya Nair",         avatar: "PN", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 79,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 10, missionsTotal: 12 },
  { id: "p14", name: "Fernando Ríos",      avatar: "FR", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 55,  lastAccessDays: 3,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "medium", coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 7,  missionsTotal: 12 },
  { id: "p15", name: "Isabel Gutiérrez",   avatar: "IG", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 71,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 9,  missionsTotal: 12 },
  { id: "p16", name: "Omar Castillo",      avatar: "OC", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 44,  lastAccessDays: 5,  paymentStatus: "overdue", paymentAmount: 4200, riskLevel: "medium", coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 5,  missionsTotal: 12 },
  { id: "p17", name: "Daniela Espinosa",   avatar: "DE", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 83,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 10, missionsTotal: 12 },
  { id: "p18", name: "Javier Montes",      avatar: "JM", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 49,  lastAccessDays: 4,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "medium", coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 6,  missionsTotal: 12 },
  { id: "p19", name: "Claudia Méndez",     avatar: "CM", cohorte: "Generación Omega", cohorteId: "omega", phase: "Vía Creania", phaseDetail: "Mes 3 de 5", momentum: 92,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 12, missionsTotal: 12, tag: "destacado" },

  // Generación Norte — coach Marco Fuentes (c2)
  { id: "p4",  name: "Roberto Campos",     avatar: "RC", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 31,  lastAccessDays: 8,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "high",   coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 2,  missionsTotal: 8 },
  { id: "p6",  name: "Andrés Mora",        avatar: "AM", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 42,  lastAccessDays: 4,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "medium", coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 5,  missionsTotal: 8 },
  { id: "p3",  name: "Mariana Ortiz",      avatar: "MO", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 51,  lastAccessDays: 2,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "medium", coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 6,  missionsTotal: 8 },
  { id: "p20", name: "Sofía Garza",        avatar: "SG", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 67,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "low",    coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 7,  missionsTotal: 8, tag: "nuevo" },
  { id: "p21", name: "Miguel Ángel Lara",  avatar: "ML", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 73,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "low",    coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 8,  missionsTotal: 8 },
  { id: "p22", name: "Paola Serrano",      avatar: "PS", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 29,  lastAccessDays: 9,  paymentStatus: "overdue", paymentAmount: 8900, riskLevel: "high",   coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 1,  missionsTotal: 8 },
  { id: "p23", name: "Tomás Ibarra",       avatar: "TI", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 60,  lastAccessDays: 2,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "low",    coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 6,  missionsTotal: 8 },
  { id: "p24", name: "Rebeca Alonso",      avatar: "RA", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 55,  lastAccessDays: 3,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "low",    coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 5,  missionsTotal: 8 },
  { id: "p25", name: "Ernesto Vargas",     avatar: "EV", cohorte: "Generación Norte", cohorteId: "norte", phase: "Expansión",     phaseDetail: "Completada",  momentum: 37,  lastAccessDays: 7,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "high",   coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 2,  missionsTotal: 8 },

  // Generación Vía 12 — coach Daniela Torres (c3)
  { id: "p2",  name: "Diego Salinas",      avatar: "DS", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 94,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 9,  missionsTotal: 12, tag: "destacado" },
  { id: "p7",  name: "Gabriela Cruz",      avatar: "GC", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Despertar",    phaseDetail: "Completado", momentum: 45,  lastAccessDays: 3,  paymentStatus: "paid",    paymentAmount: 6500, riskLevel: "medium", coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 4,  missionsTotal: 8 },
  { id: "p30", name: "Renata Domínguez",   avatar: "RD", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 82,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 8,  missionsTotal: 12 },
  { id: "p31", name: "Alejandro Fuente",   avatar: "AF", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 77,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 7,  missionsTotal: 12 },
  { id: "p32", name: "Natalia Vega",       avatar: "NV", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 88,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 10, missionsTotal: 12, tag: "destacado" },
  { id: "p33", name: "Ximena Palacios",    avatar: "XP", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 56,  lastAccessDays: 2,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 6,  missionsTotal: 12 },
  { id: "p34", name: "Carlos Peñafiel",    avatar: "CP", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 35,  lastAccessDays: 7,  paymentStatus: "pending", paymentAmount: 4200, riskLevel: "high",   coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 3,  missionsTotal: 12 },
  { id: "p35", name: "Beatriz Huerta",     avatar: "BH", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 69,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 7,  missionsTotal: 12 },
  { id: "p36", name: "Rodrigo Sánchez",    avatar: "RS", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 91,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 11, missionsTotal: 12, tag: "destacado" },
  { id: "p37", name: "Andrea Castañeda",   avatar: "AC", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 74,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 8,  missionsTotal: 12 },
  { id: "p38", name: "Pablo Guerrero",     avatar: "PG", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Despertar",    phaseDetail: "Completado", momentum: 52,  lastAccessDays: 4,  paymentStatus: "paid",    paymentAmount: 6500, riskLevel: "medium", coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 5,  missionsTotal: 8 },
  { id: "p39", name: "Valeria Torres",     avatar: "VT", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 63,  lastAccessDays: 2,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 6,  missionsTotal: 12 },
  { id: "p40", name: "Eduardo Blanco",     avatar: "EB", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 78,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 9,  missionsTotal: 12 },
  { id: "p41", name: "Mónica Estrella",    avatar: "ME", cohorte: "Generación Vía 12", cohorteId: "via12", phase: "Vía Creania", phaseDetail: "Mes 1 de 5", momentum: 43,  lastAccessDays: 6,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "medium", coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 4,  missionsTotal: 12 },
]

export const COACH_METRICS: CoachMetrics[] = [
  {
    id: "c1",
    name: "Ana Reyes",
    avatar: "AR",
    cohorte: "Generación Omega",
    cohorteId: "omega",
    participantCount: 89,
    lastGroupContactDays: 9,
    lastOneOnOneDays: 12,
    sessionsThisMonth: 3,
    sessionsPlanned: 6,
    groupMomentum: 74,
    momentumTrend: 2,
    atRiskCount: 6,
    missedSessions: 3,
  },
  {
    id: "c2",
    name: "Marco Fuentes",
    avatar: "MF",
    cohorte: "Generación Norte",
    cohorteId: "norte",
    participantCount: 67,
    lastGroupContactDays: 2,
    lastOneOnOneDays: 5,
    sessionsThisMonth: 5,
    sessionsPlanned: 6,
    groupMomentum: 58,
    momentumTrend: -7,
    atRiskCount: 8,
    missedSessions: 1,
  },
  {
    id: "c3",
    name: "Daniela Torres",
    avatar: "DT",
    cohorte: "Generación Vía 12",
    cohorteId: "via12",
    participantCount: 91,
    lastGroupContactDays: 0,
    lastOneOnOneDays: 3,
    sessionsThisMonth: 6,
    sessionsPlanned: 6,
    groupMomentum: 81,
    momentumTrend: 4,
    atRiskCount: 2,
    missedSessions: 0,
  },
]

// Event for today's Mesa de Registro
export const TODAY_EVENT = {
  id: "ev1",
  name: "Sesión en Vivo — Generación Omega",
  date: "Jueves 5 de junio 2025",
  time: "7:00 pm",
  location: "Sala Principal · Creania CDMX",
  cohorte: "Generación Omega",
  expectedAttendees: 89,
  registeredCount: 62,
  checkedInCount: 0,
}

export const EVENT_CHECKIN_LIST = [
  { id: "p1",  name: "Valeria Romo",     avatar: "VR", phone: "+52 55 1234 5678", confirmed: true,  checkedIn: false, paymentStatus: "pending" as const },
  { id: "p10", name: "Carmen Valdés",    avatar: "CV", phone: "+52 55 2345 6789", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const },
  { id: "p11", name: "Héctor Ramírez",   avatar: "HR", phone: "+52 55 3456 7890", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const },
  { id: "p12", name: "Lucía Fernández",  avatar: "LF", phone: "+52 55 4567 8901", confirmed: false, checkedIn: false, paymentStatus: "paid" as const },
  { id: "p13", name: "Priya Nair",       avatar: "PN", phone: "+52 55 5678 9012", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const },
  { id: "p14", name: "Fernando Ríos",    avatar: "FR", phone: "+52 55 6789 0123", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const },
  { id: "p15", name: "Isabel Gutiérrez", avatar: "IG", phone: "+52 55 7890 1234", confirmed: false, checkedIn: false, paymentStatus: "paid" as const },
  { id: "p16", name: "Omar Castillo",    avatar: "OC", phone: "+52 55 8901 2345", confirmed: true,  checkedIn: false, paymentStatus: "overdue" as const },
  { id: "p17", name: "Daniela Espinosa", avatar: "DE", phone: "+52 55 9012 3456", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const },
  { id: "p18", name: "Javier Montes",    avatar: "JM", phone: "+52 55 0123 4567", confirmed: false, checkedIn: false, paymentStatus: "paid" as const },
  { id: "p19", name: "Claudia Méndez",   avatar: "CM", phone: "+52 55 1234 0001", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const },
]

// ─── Cohort funnel data ───────────────────────────────────────────────────────

export interface CohortFunnelLevel {
  id: string
  label: string
  sublabel: string
  count: number
  retentionPct: number        // % that made it from previous level
  coach: string
  coachAvatar: string
  startDate: string
  endDate: string | null
  status: "completed" | "active" | "upcoming"
  color: string
  notes: string | null
}

export interface CohortFunnelData {
  id: string
  name: string
  status: "active" | "completed"
  startDate: string
  completedDate: string | null
  initialCount: number        // people who enrolled at Despertar
  currentPhase: string
  avgMomentum: number
  levels: CohortFunnelLevel[]
}

export const COHORT_FUNNELS: CohortFunnelData[] = [
  {
    id: "omega",
    name: "Generación Omega",
    status: "active",
    startDate: "feb 2025",
    completedDate: null,
    initialCount: 200,
    currentPhase: "Vía Creania · Mes 3",
    avgMomentum: 74,
    levels: [
      { id: "despertar", label: "Despertar", sublabel: "Fin de semana de apertura (3 días)",
        count: 200, retentionPct: 100, coach: "Rodrigo Peña", coachAvatar: "RP",
        startDate: "14 feb 2025", endDate: "16 feb 2025", status: "completed", color: "cyan",
        notes: "Generación muy comprometida desde el inicio. 12 participantes llegaron referidos por ex-alumnos." },
      { id: "expansion", label: "Expansión", sublabel: "Preparación profunda (4 días)",
        count: 176, retentionPct: 88, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "1 mar 2025", endDate: "4 mar 2025", status: "completed", color: "yellow",
        notes: "24 personas no continuaron post-Despertar. 3 reagendaron para Gen Norte. El resto decidió no seguir." },
      { id: "via", label: "Vía Creania", sublabel: "Programa de 5 meses",
        count: 134, retentionPct: 76, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "15 mar 2025", endDate: null, status: "active", color: "pink",
        notes: "42 personas de Expansión no se inscribieron a Vía. 45 más completaron meses 1-2 y pausaron." },
      { id: "nivel3", label: "Nivel 3", sublabel: "En proceso de enrolamiento",
        count: 0, retentionPct: 0, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "—", endDate: null, status: "upcoming", color: "violet",
        notes: "Disponible al completar Vía Creania (mes 5)" },
    ],
  },
  {
    id: "norte",
    name: "Generación Norte",
    status: "active",
    startDate: "dic 2024",
    completedDate: null,
    initialCount: 160,
    currentPhase: "Expansión completada",
    avgMomentum: 58,
    levels: [
      { id: "despertar", label: "Despertar", sublabel: "Fin de semana de apertura (3 días)",
        count: 160, retentionPct: 100, coach: "Marco Fuentes", coachAvatar: "MF",
        startDate: "6 dic 2024", endDate: "8 dic 2024", status: "completed", color: "cyan",
        notes: "Grupo con alta presencia de empresarios. Momentum inicial muy alto (promedio 84%)." },
      { id: "expansion", label: "Expansión", sublabel: "Preparación profunda (4 días)",
        count: 134, retentionPct: 84, coach: "Marco Fuentes", coachAvatar: "MF",
        startDate: "10 ene 2025", endDate: "13 ene 2025", status: "completed", color: "yellow",
        notes: "26 personas pausaron post-Despertar por compromisos de fin de año. 8 reagendaron." },
      { id: "via", label: "Vía Creania", sublabel: "Inscripción en proceso",
        count: 67, retentionPct: 50, coach: "Marco Fuentes", coachAvatar: "MF",
        startDate: "feb 2025", endDate: null, status: "active", color: "pink",
        notes: "67 se inscribieron a Vía Creania. 67 restantes en proceso de decisión o pausados." },
      { id: "nivel3", label: "Nivel 3", sublabel: "Próximo ciclo",
        count: 0, retentionPct: 0, coach: "Marco Fuentes", coachAvatar: "MF",
        startDate: "—", endDate: null, status: "upcoming", color: "violet",
        notes: null },
    ],
  },
  {
    id: "via12",
    name: "Generación Vía 12",
    status: "active",
    startDate: "ene 2025",
    completedDate: null,
    initialCount: 220,
    currentPhase: "Vía Creania · Mes 1",
    avgMomentum: 81,
    levels: [
      { id: "despertar", label: "Despertar", sublabel: "Fin de semana de apertura (3 días)",
        count: 220, retentionPct: 100, coach: "Daniela Torres", coachAvatar: "DT",
        startDate: "17 ene 2025", endDate: "19 ene 2025", status: "completed", color: "cyan",
        notes: "La generación más grande hasta ahora. Récord de puntualidad (97% en día 1)." },
      { id: "expansion", label: "Expansión", sublabel: "Preparación profunda (4 días)",
        count: 198, retentionPct: 90, coach: "Daniela Torres", coachAvatar: "DT",
        startDate: "7 feb 2025", endDate: "10 feb 2025", status: "completed", color: "yellow",
        notes: "22 no continuaron post-Despertar. Tasa de retención más alta en la historia del centro." },
      { id: "via", label: "Vía Creania", sublabel: "Mes 1 de 5",
        count: 91, retentionPct: 46, coach: "Daniela Torres", coachAvatar: "DT",
        startDate: "1 mar 2025", endDate: null, status: "active", color: "pink",
        notes: "107 personas de Expansión están en proceso de inscripción a Vía. 91 ya comenzaron Mes 1." },
      { id: "nivel3", label: "Nivel 3", sublabel: "Próximo ciclo",
        count: 0, retentionPct: 0, coach: "Daniela Torres", coachAvatar: "DT",
        startDate: "—", endDate: null, status: "upcoming", color: "violet",
        notes: null },
    ],
  },
  // Historical completed cohort
  {
    id: "alpha",
    name: "Generación Alpha",
    status: "completed",
    startDate: "mar 2024",
    completedDate: "dic 2024",
    initialCount: 180,
    currentPhase: "Completada",
    avgMomentum: 78,
    levels: [
      { id: "despertar", label: "Despertar", sublabel: "Fin de semana de apertura",
        count: 180, retentionPct: 100, coach: "Rodrigo Peña", coachAvatar: "RP",
        startDate: "8 mar 2024", endDate: "10 mar 2024", status: "completed", color: "cyan",
        notes: null },
      { id: "expansion", label: "Expansión", sublabel: "Preparación profunda",
        count: 155, retentionPct: 86, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "5 abr 2024", endDate: "8 abr 2024", status: "completed", color: "yellow",
        notes: "25 no continuaron. Tasa normal para el centro." },
      { id: "via", label: "Vía Creania", sublabel: "5 meses completados",
        count: 118, retentionPct: 76, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "20 abr 2024", endDate: "20 sep 2024", status: "completed", color: "pink",
        notes: "37 no se inscribieron a Vía. Tasa de retención: 76%." },
      { id: "nivel3", label: "Nivel 3", sublabel: "Graduados activos",
        count: 89, retentionPct: 75, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "oct 2024", endDate: "dic 2024", status: "completed", color: "violet",
        notes: "89 participantes completaron Vía y están activos en Nivel 3. 23 graduados de Nivel 3." },
    ],
  },
]

// Participants per level — for drill-down in Cohortes
export const LEVEL_PARTICIPANTS: Record<string, Record<string, Array<{
  id: string; name: string; avatar: string; momentum: number
  status: "active" | "completed" | "paused" | "dropped"
  riskLevel: "low" | "medium" | "high"
  missionsCompleted: number; missionsTotal: number
  lastAccessDays: number; note?: string
}>>> = {
  omega: {
    despertar:  [
      { id:"p1",  name:"Valeria Romo",     avatar:"VR", momentum:23, status:"active",    riskLevel:"high",   missionsCompleted:3,  missionsTotal:12, lastAccessDays:11 },
      { id:"p10", name:"Carmen Valdés",    avatar:"CV", momentum:88, status:"active",    riskLevel:"low",    missionsCompleted:11, missionsTotal:12, lastAccessDays:0  },
      { id:"p11", name:"Héctor Ramírez",   avatar:"HR", momentum:62, status:"active",    riskLevel:"low",    missionsCompleted:8,  missionsTotal:12, lastAccessDays:1  },
      { id:"p12", name:"Lucía Fernández",  avatar:"LF", momentum:38, status:"active",    riskLevel:"high",   missionsCompleted:4,  missionsTotal:12, lastAccessDays:6  },
      { id:"p13", name:"Priya Nair",       avatar:"PN", momentum:79, status:"active",    riskLevel:"low",    missionsCompleted:10, missionsTotal:12, lastAccessDays:0  },
      { id:"p14", name:"Fernando Ríos",    avatar:"FR", momentum:55, status:"active",    riskLevel:"medium", missionsCompleted:7,  missionsTotal:12, lastAccessDays:3  },
      { id:"p15", name:"Isabel Gutiérrez", avatar:"IG", momentum:71, status:"active",    riskLevel:"low",    missionsCompleted:9,  missionsTotal:12, lastAccessDays:1  },
      { id:"p16", name:"Omar Castillo",    avatar:"OC", momentum:44, status:"active",    riskLevel:"medium", missionsCompleted:5,  missionsTotal:12, lastAccessDays:5  },
      { id:"p17", name:"Daniela Espinosa", avatar:"DE", momentum:83, status:"active",    riskLevel:"low",    missionsCompleted:10, missionsTotal:12, lastAccessDays:0  },
      { id:"p18", name:"Javier Montes",    avatar:"JM", momentum:49, status:"active",    riskLevel:"medium", missionsCompleted:6,  missionsTotal:12, lastAccessDays:4  },
      { id:"p19", name:"Claudia Méndez",   avatar:"CM", momentum:92, status:"active",    riskLevel:"low",    missionsCompleted:12, missionsTotal:12, lastAccessDays:0  },
      { id:"x1",  name:"Sofía Aguilar",    avatar:"SA", momentum:0,  status:"dropped",   riskLevel:"high",   missionsCompleted:0,  missionsTotal:12, lastAccessDays:60, note:"No continuó después de Despertar" },
      { id:"x2",  name:"Miguel Soto",      avatar:"MS", momentum:0,  status:"paused",    riskLevel:"high",   missionsCompleted:2,  missionsTotal:12, lastAccessDays:45, note:"Pausó por viaje de trabajo" },
    ],
    via:  [
      { id:"p1",  name:"Valeria Romo",     avatar:"VR", momentum:23, status:"active",    riskLevel:"high",   missionsCompleted:3,  missionsTotal:12, lastAccessDays:11 },
      { id:"p10", name:"Carmen Valdés",    avatar:"CV", momentum:88, status:"active",    riskLevel:"low",    missionsCompleted:11, missionsTotal:12, lastAccessDays:0  },
      { id:"p11", name:"Héctor Ramírez",   avatar:"HR", momentum:62, status:"active",    riskLevel:"low",    missionsCompleted:8,  missionsTotal:12, lastAccessDays:1  },
      { id:"p12", name:"Lucía Fernández",  avatar:"LF", momentum:38, status:"active",    riskLevel:"high",   missionsCompleted:4,  missionsTotal:12, lastAccessDays:6  },
      { id:"p13", name:"Priya Nair",       avatar:"PN", momentum:79, status:"active",    riskLevel:"low",    missionsCompleted:10, missionsTotal:12, lastAccessDays:0  },
      { id:"p14", name:"Fernando Ríos",    avatar:"FR", momentum:55, status:"active",    riskLevel:"medium", missionsCompleted:7,  missionsTotal:12, lastAccessDays:3  },
      { id:"p15", name:"Isabel Gutiérrez", avatar:"IG", momentum:71, status:"active",    riskLevel:"low",    missionsCompleted:9,  missionsTotal:12, lastAccessDays:1  },
      { id:"p16", name:"Omar Castillo",    avatar:"OC", momentum:44, status:"active",    riskLevel:"medium", missionsCompleted:5,  missionsTotal:12, lastAccessDays:5  },
      { id:"p17", name:"Daniela Espinosa", avatar:"DE", momentum:83, status:"active",    riskLevel:"low",    missionsCompleted:10, missionsTotal:12, lastAccessDays:0  },
      { id:"p18", name:"Javier Montes",    avatar:"JM", momentum:49, status:"active",    riskLevel:"medium", missionsCompleted:6,  missionsTotal:12, lastAccessDays:4  },
      { id:"p19", name:"Claudia Méndez",   avatar:"CM", momentum:92, status:"active",    riskLevel:"low",    missionsCompleted:12, missionsTotal:12, lastAccessDays:0  },
    ],
  },
  norte: {
    despertar: [
      { id:"p4",  name:"Roberto Campos",   avatar:"RC", momentum:31, status:"active",    riskLevel:"high",   missionsCompleted:2, missionsTotal:8, lastAccessDays:8 },
      { id:"p6",  name:"Andrés Mora",      avatar:"AM", momentum:42, status:"active",    riskLevel:"medium", missionsCompleted:5, missionsTotal:8, lastAccessDays:4 },
      { id:"p20", name:"Sofía Garza",      avatar:"SG", momentum:67, status:"active",    riskLevel:"low",    missionsCompleted:7, missionsTotal:8, lastAccessDays:0 },
      { id:"p21", name:"Miguel Ángel",     avatar:"ML", momentum:73, status:"active",    riskLevel:"low",    missionsCompleted:8, missionsTotal:8, lastAccessDays:1 },
      { id:"p22", name:"Paola Serrano",    avatar:"PS", momentum:29, status:"active",    riskLevel:"high",   missionsCompleted:1, missionsTotal:8, lastAccessDays:9 },
      { id:"p23", name:"Tomás Ibarra",     avatar:"TI", momentum:60, status:"active",    riskLevel:"low",    missionsCompleted:6, missionsTotal:8, lastAccessDays:2 },
      { id:"p24", name:"Rebeca Alonso",    avatar:"RA", momentum:55, status:"active",    riskLevel:"low",    missionsCompleted:5, missionsTotal:8, lastAccessDays:3 },
      { id:"p25", name:"Ernesto Vargas",   avatar:"EV", momentum:37, status:"active",    riskLevel:"high",   missionsCompleted:2, missionsTotal:8, lastAccessDays:7 },
      { id:"y1",  name:"Carla Duarte",     avatar:"CD", momentum:0,  status:"dropped",   riskLevel:"high",   missionsCompleted:0, missionsTotal:8, lastAccessDays:90, note:"No continuó tras Despertar" },
      { id:"y2",  name:"Ricardo Leal",     avatar:"RL", momentum:0,  status:"paused",    riskLevel:"high",   missionsCompleted:1, missionsTotal:8, lastAccessDays:70, note:"Viaje prolongado al extranjero" },
    ],
    via: [
      { id:"p4",  name:"Roberto Campos",   avatar:"RC", momentum:31, status:"active",    riskLevel:"high",   missionsCompleted:2, missionsTotal:8, lastAccessDays:8 },
      { id:"p6",  name:"Andrés Mora",      avatar:"AM", momentum:42, status:"active",    riskLevel:"medium", missionsCompleted:5, missionsTotal:8, lastAccessDays:4 },
      { id:"p20", name:"Sofía Garza",      avatar:"SG", momentum:67, status:"active",    riskLevel:"low",    missionsCompleted:7, missionsTotal:8, lastAccessDays:0 },
      { id:"p21", name:"Miguel Ángel",     avatar:"ML", momentum:73, status:"active",    riskLevel:"low",    missionsCompleted:8, missionsTotal:8, lastAccessDays:1 },
    ],
  },
  via12: {
    despertar: [
      { id:"p2",  name:"Diego Salinas",    avatar:"DS", momentum:94, status:"active",    riskLevel:"low",    missionsCompleted:9,  missionsTotal:12, lastAccessDays:0 },
      { id:"p30", name:"Renata Domínguez", avatar:"RD", momentum:82, status:"active",    riskLevel:"low",    missionsCompleted:8,  missionsTotal:12, lastAccessDays:0 },
      { id:"p31", name:"Alejandro Fuente", avatar:"AF", momentum:77, status:"active",    riskLevel:"low",    missionsCompleted:7,  missionsTotal:12, lastAccessDays:1 },
      { id:"p32", name:"Natalia Vega",     avatar:"NV", momentum:88, status:"active",    riskLevel:"low",    missionsCompleted:10, missionsTotal:12, lastAccessDays:0 },
      { id:"p33", name:"Ximena Palacios",  avatar:"XP", momentum:56, status:"active",    riskLevel:"low",    missionsCompleted:6,  missionsTotal:12, lastAccessDays:2 },
      { id:"p34", name:"Carlos Peñafiel",  avatar:"CP", momentum:35, status:"active",    riskLevel:"high",   missionsCompleted:3,  missionsTotal:12, lastAccessDays:7 },
      { id:"p35", name:"Beatriz Huerta",   avatar:"BH", momentum:69, status:"active",    riskLevel:"low",    missionsCompleted:7,  missionsTotal:12, lastAccessDays:1 },
      { id:"p36", name:"Rodrigo Sánchez",  avatar:"RS", momentum:91, status:"active",    riskLevel:"low",    missionsCompleted:11, missionsTotal:12, lastAccessDays:0 },
      { id:"z1",  name:"Óscar Medina",     avatar:"OM", momentum:0,  status:"dropped",   riskLevel:"high",   missionsCompleted:0,  missionsTotal:12, lastAccessDays:50, note:"Decidió no continuar" },
    ],
    via: [
      { id:"p2",  name:"Diego Salinas",    avatar:"DS", momentum:94, status:"active",    riskLevel:"low",    missionsCompleted:9,  missionsTotal:12, lastAccessDays:0 },
      { id:"p30", name:"Renata Domínguez", avatar:"RD", momentum:82, status:"active",    riskLevel:"low",    missionsCompleted:8,  missionsTotal:12, lastAccessDays:0 },
      { id:"p31", name:"Alejandro Fuente", avatar:"AF", momentum:77, status:"active",    riskLevel:"low",    missionsCompleted:7,  missionsTotal:12, lastAccessDays:1 },
      { id:"p32", name:"Natalia Vega",     avatar:"NV", momentum:88, status:"active",    riskLevel:"low",    missionsCompleted:10, missionsTotal:12, lastAccessDays:0 },
      { id:"p33", name:"Ximena Palacios",  avatar:"XP", momentum:56, status:"active",    riskLevel:"low",    missionsCompleted:6,  missionsTotal:12, lastAccessDays:2 },
      { id:"p34", name:"Carlos Peñafiel",  avatar:"CP", momentum:35, status:"active",    riskLevel:"high",   missionsCompleted:3,  missionsTotal:12, lastAccessDays:7 },
      { id:"p35", name:"Beatriz Huerta",   avatar:"BH", momentum:69, status:"active",    riskLevel:"low",    missionsCompleted:7,  missionsTotal:12, lastAccessDays:1 },
      { id:"p36", name:"Rodrigo Sánchez",  avatar:"RS", momentum:91, status:"active",    riskLevel:"low",    missionsCompleted:11, missionsTotal:12, lastAccessDays:0 },
      { id:"p37", name:"Andrea Castañeda", avatar:"AC", momentum:74, status:"active",    riskLevel:"low",    missionsCompleted:8,  missionsTotal:12, lastAccessDays:1 },
      { id:"p39", name:"Valeria Torres",   avatar:"VT", momentum:63, status:"active",    riskLevel:"low",    missionsCompleted:6,  missionsTotal:12, lastAccessDays:2 },
      { id:"p40", name:"Eduardo Blanco",   avatar:"EB", momentum:78, status:"active",    riskLevel:"low",    missionsCompleted:9,  missionsTotal:12, lastAccessDays:0 },
    ],
  },
}

export const STAFF_ACCOUNTS = [
  { id: "s1", name: "Karla Ríos",    avatar: "KR", role: "Mesa de Registro", email: "karla@creania.mx" },
  { id: "s2", name: "Daniel Mora",   avatar: "DM", role: "Mesa de Registro", email: "daniel@creania.mx" },
  { id: "s3", name: "Paola Juárez",  avatar: "PJ", role: "Operaciones",      email: "paola@creania.mx" },
]
