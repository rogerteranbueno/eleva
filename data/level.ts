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
  name: "TRANSFORMA",
  fullName: "TRANSFORMA",
  city: "Medellín",
  founder: "Carlos Londoño",
  model: "Básico → Avanzado → PL VIA Visión → PL VIA Intimidad → PL VIA Aprecio → Noche de Confianza → PL Paraíso",
}

export const CENTERS: Center[] = [
  {
    id: "mde",
    name: "TRANSFORMA Medellín",
    fullName: "TRANSFORMA Medellín",
    city: "Medellín",
    country: "Colombia",
    founder: "Carlos Londoño",
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
    id: "bog",
    name: "TRANSFORMA Bogotá",
    fullName: "TRANSFORMA Bogotá",
    city: "Bogotá",
    country: "Colombia",
    founder: "Gabriela Salazar",
    activeParticipants: 178,
    atRiskCount: 9,
    averageMomentum: 69,
    mrr: 196800,
    coaches: 3,
    activeCohortes: 3,
    nextEventDays: 6,
    monthlyGrowth: 15,
    monthlyRevenue: 248500,
    collected: 221000,
    pending: 27500,
    netMargin: 71.8,
  },
  {
    id: "cue",
    name: "TRANSFORMA Cuenca",
    fullName: "TRANSFORMA Cuenca",
    city: "Cuenca",
    country: "Ecuador",
    founder: "Patricia Andrade",
    activeParticipants: 54,
    atRiskCount: 3,
    averageMomentum: 71,
    mrr: 64800,
    coaches: 1,
    activeCohortes: 1,
    nextEventDays: 11,
    monthlyGrowth: 22,
    monthlyRevenue: 78400,
    collected: 68000,
    pending: 10400,
    netMargin: 68.4,
  },
  {
    id: "gye",
    name: "TRANSFORMA Guayaquil",
    fullName: "TRANSFORMA Guayaquil",
    city: "Guayaquil",
    country: "Ecuador",
    founder: "Roberto Mora",
    activeParticipants: 42,
    atRiskCount: 2,
    averageMomentum: 74,
    mrr: 50400,
    coaches: 1,
    activeCohortes: 1,
    nextEventDays: 14,
    monthlyGrowth: 26,
    monthlyRevenue: 62000,
    collected: 54000,
    pending: 8000,
    netMargin: 72.1,
  },
  {
    id: "loj",
    name: "TRANSFORMA Loja",
    fullName: "TRANSFORMA Loja",
    city: "Loja",
    country: "Ecuador",
    founder: "Carlos Ojeda",
    activeParticipants: 38,
    atRiskCount: 2,
    averageMomentum: 73,
    mrr: 45600,
    coaches: 1,
    activeCohortes: 1,
    nextEventDays: 16,
    monthlyGrowth: 31,
    monthlyRevenue: 56200,
    collected: 48000,
    pending: 8200,
    netMargin: 70.8,
  },
  {
    id: "nyc",
    name: "TRANSFORMA New York",
    fullName: "TRANSFORMA New York",
    city: "New York",
    country: "USA",
    founder: "Greacy Aguirre",
    activeParticipants: 62,
    atRiskCount: 5,
    averageMomentum: 76,
    mrr: 134139,
    coaches: 3,
    activeCohortes: 1,
    nextEventDays: 8,
    monthlyGrowth: 18,
    monthlyRevenue: 134139,
    collected: 134139,
    pending: 0,
    netMargin: 74.5,
  },
  {
    id: "uio",
    name: "TRANSFORMA Quito",
    fullName: "TRANSFORMA Quito",
    city: "Quito",
    country: "Ecuador",
    founder: "Andrés Villacís",
    activeParticipants: 67,
    atRiskCount: 4,
    averageMomentum: 69,
    mrr: 80400,
    coaches: 2,
    activeCohortes: 2,
    nextEventDays: 7,
    monthlyGrowth: 20,
    monthlyRevenue: 98800,
    collected: 86000,
    pending: 12800,
    netMargin: 71.2,
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
  { id: "c2", name: "Pedro Infante", avatar: "PI", cohorte: "Generación Norte", lastContactDaysAgo: 2 },
  { id: "c3", name: "David Giraldo", avatar: "DG", cohorte: "Generación PL 12", lastContactDaysAgo: 0 },
  { id: "c4", name: "Martha Lucía", avatar: "MLU", cohorte: "General", lastContactDaysAgo: 5 },
  { id: "c5", name: "Esteban Hinestrosa", avatar: "EH", cohorte: "General", lastContactDaysAgo: 1 },
  { id: "c6", name: "Monserrat Díaz", avatar: "MD", cohorte: "General", lastContactDaysAgo: 3 },
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
    phase: "PL VIA Aprecio",
    phaseDetail: "Mes 3 de 5",
    participants: 89,
    momentum: 74,
    status: "active",
    coach: "Ana Reyes",
  },
  {
    id: "norte",
    name: "Generación Norte",
    phase: "Avanzado",
    phaseDetail: "Completada",
    participants: 67,
    momentum: 58,
    status: "attention",
    coach: "Pedro Infante",
  },
  {
    id: "via12",
    name: "Generación PL 12",
    phase: "Básico",
    phaseDetail: "Completado",
    participants: 91,
    momentum: 81,
    status: "thriving",
    coach: "David Giraldo",
  },
]

export const VALERIA: Participant = {
  id: "p1",
  name: "Valeria Romo",
  avatar: "VR",
  cohorte: "Generación Omega",
  phase: "PL VIA Aprecio",
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
    { concept: "PL — Mes 1", amount: 4200, date: "1 mar 2025", status: "paid" },
    { concept: "PL — Mes 2", amount: 4200, date: "1 abr 2025", status: "paid" },
    { concept: "PL — Mes 3", amount: 4200, date: "1 may 2025", status: "paid" },
    { concept: "PL — Mes 4", amount: 4200, date: "1 jun 2025", status: "pending" },
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
  cohorte: "Generación PL 12",
  phase: "PL VIA Visión",
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
    { concept: "Básico", amount: 6500, date: "15 ene 2025", status: "paid" },
    { concept: "Avanzado", amount: 8900, date: "8 feb 2025", status: "paid" },
    { concept: "PL — Mes 1", amount: 4200, date: "1 may 2025", status: "paid" },
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
  phase: "Avanzado",
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
    { concept: "Básico", amount: 6500, date: "10 dic 2024", status: "paid" },
    { concept: "Avanzado", amount: 8900, date: "18 ene 2025", status: "paid" },
  ],
  activity: Array.from({ length: 30 }, (_, i) => ({
    date: `día ${30 - i}`,
    active: Math.random() > 0.5,
    daysAgo: 30 - i,
  })),
}

export const AT_RISK_PARTICIPANTS = [
  // ── Alta prioridad — riesgo crítico ───────────────────────────────────────
  { ...VALERIA },
  {
    id: "p4",  name: "Roberto Campos",  avatar: "RC", momentum: 31, inactiveDays: 8,
    cohorte: "Generación Norte",    riskLevel: "high"   as const, coachId: "c2",
    pendingMissions: 2, phase: "Avanzado"   as const,
  },
  {
    id: "p22", name: "Paola Serrano",   avatar: "PS", momentum: 29, inactiveDays: 9,
    cohorte: "Generación Norte",    riskLevel: "high"   as const, coachId: "c2",
    pendingMissions: 3, phase: "Avanzado"   as const,
  },
  {
    id: "p25", name: "Ernesto Vargas",  avatar: "EV", momentum: 37, inactiveDays: 7,
    cohorte: "Generación Norte",    riskLevel: "high"   as const, coachId: "c2",
    pendingMissions: 2, phase: "Avanzado"   as const,
  },
  {
    id: "p34", name: "Carlos Peñafiel", avatar: "CP", momentum: 35, inactiveDays: 7,
    cohorte: "Generación PL 12",   riskLevel: "high"   as const, coachId: "c3",
    pendingMissions: 2, phase: "PL VIA Visión" as const,
  },
  {
    id: "p5",  name: "Lucía Fernández", avatar: "LF", momentum: 38, inactiveDays: 6,
    cohorte: "Generación Omega",    riskLevel: "high"   as const, coachId: "c1",
    pendingMissions: 1, phase: "PL VIA Aprecio" as const,
  },
  // ── Moderado — intervención recomendada ───────────────────────────────────
  {
    id: "p41", name: "Mónica Estrella", avatar: "ME", momentum: 43, inactiveDays: 6,
    cohorte: "Generación PL 12",   riskLevel: "medium" as const, coachId: "c3",
    pendingMissions: 1, phase: "PL VIA Visión" as const,
  },
  {
    id: "p16", name: "Omar Castillo",   avatar: "OC", momentum: 44, inactiveDays: 5,
    cohorte: "Generación Omega",    riskLevel: "medium" as const, coachId: "c1",
    pendingMissions: 1, phase: "PL VIA Aprecio" as const,
  },
  {
    id: "p7",  name: "Gabriela Cruz",   avatar: "GC", momentum: 45, inactiveDays: 3,
    cohorte: "Generación PL 12",   riskLevel: "medium" as const, coachId: "c3",
    pendingMissions: 0, phase: "Básico"   as const,
  },
  {
    id: "p6",  name: "Andrés Mora",     avatar: "AM", momentum: 42, inactiveDays: 4,
    cohorte: "Generación Norte",    riskLevel: "medium" as const, coachId: "c2",
    pendingMissions: 1, phase: "Avanzado"   as const,
  },
  { ...MARIANA },
  {
    id: "p18", name: "Javier Montes",   avatar: "JM", momentum: 49, inactiveDays: 4,
    cohorte: "Generación Omega",    riskLevel: "medium" as const, coachId: "c1",
    pendingMissions: 2, phase: "PL VIA Aprecio" as const,
  },
  {
    id: "p38", name: "Pablo Guerrero",  avatar: "PG", momentum: 52, inactiveDays: 4,
    cohorte: "Generación PL 12",   riskLevel: "medium" as const, coachId: "c3",
    pendingMissions: 1, phase: "Básico"   as const,
  },
  {
    id: "p14", name: "Fernando Ríos",   avatar: "FR", momentum: 55, inactiveDays: 3,
    cohorte: "Generación Omega",    riskLevel: "medium" as const, coachId: "c1",
    pendingMissions: 1, phase: "PL VIA Aprecio" as const,
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
    content: "Generación Omega · Tribu Kairos: esta semana el reto es la consistencia, no la intensidad. 15 minutos todos los días valen más que 2 horas una vez. Estoy con ustedes. 🔥",
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
    author: "Sara Alzate",
    avatar: "SA",
    content: "Completé la misión de la semana antes del miércoles por primera vez. Se siente diferente cuando lo haces por ti y no por el check.",
    minutesAgo: 180,
    reactions: 29,
    comments: 6,
  },
  {
    id: "f3",
    author: "Yampol Correa",
    avatar: "YC",
    content: "Tuve mi primera sesión con Esteban (coach VIA Visión) y me voló la cabeza. Recomendado para todos los que tienen futuros imposibles pendientes este mes.",
    minutesAgo: 360,
    reactions: 22,
    comments: 9,
  },
]

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Diego Salinas", avatar: "DS", streak: 22 },
  { rank: 2, name: "Rachel Lafaurie", avatar: "RL", streak: 18 },
  { rank: 3, name: "Lorena López", avatar: "LL", streak: 15 },
  { rank: 4, name: "Mafer Suin", avatar: "MS", streak: 12 },
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
    coachNote: "Muy aplicada durante Avanzado. Conectó bien con el módulo de creencias sobre dinero. Entró a PL con momentum alto.",
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
  { id: "n1", name: "Diego Salinas",    avatar: "DS", cohorte: "PL 12", coachId: "c3",
    weekendActive: 2, enrolled: 5, enrollTarget: 4, attendancePct: 100,
    goalsCompleted: 3, goalsTotal: 3, coachingCalls: 4, coachingCallsTotal: 4,
    graduationScore: 91, atRisk: false },
  { id: "n2", name: "Carmen Valdés",    avatar: "CV", cohorte: "PL 12", coachId: "c3",
    weekendActive: 2, enrolled: 3, enrollTarget: 4, attendancePct: 95,
    goalsCompleted: 2, goalsTotal: 3, coachingCalls: 3, coachingCallsTotal: 4,
    graduationScore: 72, atRisk: false },
  { id: "n3", name: "Héctor Ramírez",   avatar: "HR", cohorte: "PL 12", coachId: "c3",
    weekendActive: 2, enrolled: 2, enrollTarget: 4, attendancePct: 88,
    goalsCompleted: 2, goalsTotal: 3, coachingCalls: 2, coachingCallsTotal: 4,
    graduationScore: 54, atRisk: true },
  { id: "n4", name: "Priya Nair",       avatar: "PN", cohorte: "PL 12", coachId: "c3",
    weekendActive: 3, enrolled: 4, enrollTarget: 4, attendancePct: 100,
    goalsCompleted: 3, goalsTotal: 3, coachingCalls: 4, coachingCallsTotal: 4,
    graduationScore: 88, atRisk: false },
  { id: "n5", name: "Sofía Guerrero",   avatar: "SG", cohorte: "PL 12", coachId: "c3",
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
    { name: "Generación PL 12", participants: 91, rate: 4200, expected: 382200, collected: 343800, pending: 38400 },
  ],
  pendingParticipants: [
    { name: "Valeria Romo", avatar: "VR", amount: 4200, cohorte: "Gen. Omega", overdueDays: 3 },
    { name: "Omar Castillo", avatar: "OC", amount: 4200, cohorte: "Gen. Omega", overdueDays: 5 },
    { name: "Paola Serrano", avatar: "PS", amount: 8900, cohorte: "Gen. Norte", overdueDays: 7 },
    { name: "Carlos Peñafiel", avatar: "CP", amount: 4200, cohorte: "Gen. PL 12", overdueDays: 0 },
  ],
}

export const REGISTRATION_COHORTES = [
  {
    id: "omega",
    name: "Generación Omega",
    coach: "Ana Reyes",
    coachAvatar: "AR",
    phase: "PL VIA Aprecio" as const,
    phaseDetail: "Mes 3 de 5",
    participants: 89,
    capacity: 100,
    momentum: 74,
    available: 11,
  },
  {
    id: "norte",
    name: "Generación Norte",
    coach: "Pedro Infante",
    coachAvatar: "PI",
    phase: "Avanzado" as const,
    phaseDetail: "Completada",
    participants: 67,
    capacity: 80,
    momentum: 58,
    available: 13,
  },
  {
    id: "via12",
    name: "Generación PL 12",
    coach: "David Giraldo",
    coachAvatar: "DG",
    phase: "PL VIA Visión" as const,
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
  { id: "p1",  name: "Valeria Romo",       avatar: "VR", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 23,  lastAccessDays: 11, paymentStatus: "pending",  paymentAmount: 4200, riskLevel: "high",   coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 3,  missionsTotal: 12 },
  { id: "p10", name: "Carmen Valdés",      avatar: "CV", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 88,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 11, missionsTotal: 12, tag: "destacado" },
  { id: "p11", name: "Héctor Ramírez",     avatar: "HR", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 62,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 8,  missionsTotal: 12 },
  { id: "p12", name: "Lucía Fernández",    avatar: "LF", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 38,  lastAccessDays: 6,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "high",   coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 4,  missionsTotal: 12 },
  { id: "p13", name: "Priya Nair",         avatar: "PN", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 79,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 10, missionsTotal: 12 },
  { id: "p14", name: "Fernando Ríos",      avatar: "FR", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 55,  lastAccessDays: 3,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "medium", coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 7,  missionsTotal: 12 },
  { id: "p15", name: "Isabel Gutiérrez",   avatar: "IG", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 71,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 9,  missionsTotal: 12 },
  { id: "p16", name: "Omar Castillo",      avatar: "OC", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 44,  lastAccessDays: 5,  paymentStatus: "overdue", paymentAmount: 4200, riskLevel: "medium", coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 5,  missionsTotal: 12 },
  { id: "p17", name: "Daniela Espinosa",   avatar: "DE", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 83,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 10, missionsTotal: 12 },
  { id: "p18", name: "Javier Montes",      avatar: "JM", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 49,  lastAccessDays: 4,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "medium", coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 6,  missionsTotal: 12 },
  { id: "p19", name: "Claudia Méndez",     avatar: "CM", cohorte: "Generación Omega", cohorteId: "omega", phase: "PL VIA Aprecio", phaseDetail: "Mes 3 de 5", momentum: 92,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c1", enrollDate: "10 feb 2025", missionsCompleted: 12, missionsTotal: 12, tag: "destacado" },

  // Generación Norte — coach Pedro Infante (c2)
  { id: "p4",  name: "Roberto Campos",     avatar: "RC", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 31,  lastAccessDays: 8,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "high",   coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 2,  missionsTotal: 8 },
  { id: "p6",  name: "Andrés Mora",        avatar: "AM", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 42,  lastAccessDays: 4,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "medium", coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 5,  missionsTotal: 8 },
  { id: "p3",  name: "Mariana Ortiz",      avatar: "MO", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 51,  lastAccessDays: 2,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "medium", coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 6,  missionsTotal: 8 },
  { id: "p20", name: "Sofía Garza",        avatar: "SG", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 67,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "low",    coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 7,  missionsTotal: 8, tag: "nuevo" },
  { id: "p21", name: "Miguel Ángel Lara",  avatar: "ML", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 73,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "low",    coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 8,  missionsTotal: 8 },
  { id: "p22", name: "Paola Serrano",      avatar: "PS", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 29,  lastAccessDays: 9,  paymentStatus: "overdue", paymentAmount: 8900, riskLevel: "high",   coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 1,  missionsTotal: 8 },
  { id: "p23", name: "Tomás Ibarra",       avatar: "TI", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 60,  lastAccessDays: 2,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "low",    coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 6,  missionsTotal: 8 },
  { id: "p24", name: "Rebeca Alonso",      avatar: "RA", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 55,  lastAccessDays: 3,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "low",    coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 5,  missionsTotal: 8 },
  { id: "p25", name: "Ernesto Vargas",     avatar: "EV", cohorte: "Generación Norte", cohorteId: "norte", phase: "Avanzado",     phaseDetail: "Completada",  momentum: 37,  lastAccessDays: 7,  paymentStatus: "paid",    paymentAmount: 8900, riskLevel: "high",   coachId: "c2", enrollDate: "5 dic 2024",  missionsCompleted: 2,  missionsTotal: 8 },

  // Generación PL 12 — coach David Giraldo (c3)
  { id: "p2",  name: "Diego Salinas",      avatar: "DS", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 94,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 9,  missionsTotal: 12, tag: "destacado" },
  { id: "p7",  name: "Gabriela Cruz",      avatar: "GC", cohorte: "Generación PL 12", cohorteId: "via12", phase: "Básico",    phaseDetail: "Completado", momentum: 45,  lastAccessDays: 3,  paymentStatus: "paid",    paymentAmount: 6500, riskLevel: "medium", coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 4,  missionsTotal: 8 },
  { id: "p30", name: "Renata Domínguez",   avatar: "RD", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 82,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 8,  missionsTotal: 12 },
  { id: "p31", name: "Alejandro Fuente",   avatar: "AF", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 77,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 7,  missionsTotal: 12 },
  { id: "p32", name: "Natalia Vega",       avatar: "NV", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 88,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 10, missionsTotal: 12, tag: "destacado" },
  { id: "p33", name: "Ximena Palacios",    avatar: "XP", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 56,  lastAccessDays: 2,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 6,  missionsTotal: 12 },
  { id: "p34", name: "Carlos Peñafiel",    avatar: "CP", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 35,  lastAccessDays: 7,  paymentStatus: "pending", paymentAmount: 4200, riskLevel: "high",   coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 3,  missionsTotal: 12 },
  { id: "p35", name: "Beatriz Huerta",     avatar: "BH", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 69,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 7,  missionsTotal: 12 },
  { id: "p36", name: "Rodrigo Sánchez",    avatar: "RS", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 91,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 11, missionsTotal: 12, tag: "destacado" },
  { id: "p37", name: "Andrea Castañeda",   avatar: "AC", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 74,  lastAccessDays: 1,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 8,  missionsTotal: 12 },
  { id: "p38", name: "Pablo Guerrero",     avatar: "PG", cohorte: "Generación PL 12", cohorteId: "via12", phase: "Básico",    phaseDetail: "Completado", momentum: 52,  lastAccessDays: 4,  paymentStatus: "paid",    paymentAmount: 6500, riskLevel: "medium", coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 5,  missionsTotal: 8 },
  { id: "p39", name: "Valeria Torres",     avatar: "VT", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 63,  lastAccessDays: 2,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 6,  missionsTotal: 12 },
  { id: "p40", name: "Eduardo Blanco",     avatar: "EB", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 78,  lastAccessDays: 0,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "low",    coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 9,  missionsTotal: 12 },
  { id: "p41", name: "Mónica Estrella",    avatar: "ME", cohorte: "Generación PL 12", cohorteId: "via12", phase: "PL VIA Visión", phaseDetail: "Mes 1 de 5", momentum: 43,  lastAccessDays: 6,  paymentStatus: "paid",    paymentAmount: 4200, riskLevel: "medium", coachId: "c3", enrollDate: "15 ene 2025", missionsCompleted: 4,  missionsTotal: 12 },
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
    name: "Pedro Infante",
    avatar: "PI",
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
    name: "David Giraldo",
    avatar: "DG",
    cohorte: "Generación PL 12",
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
  location: "Sala Principal · LEVEL Medellín",
  cohorte: "Generación Omega",
  expectedAttendees: 89,
  registeredCount: 62,
  checkedInCount: 0,
}

export const EVENT_CHECKIN_LIST = [
  { id: "p1",  name: "Valeria Romo",     avatar: "VR", phone: "+52 55 1234 5678", confirmed: true,  checkedIn: false, paymentStatus: "pending" as const,  referredBy: "Diego Salinas",    missingInfo: ["email"] },
  { id: "p10", name: "Carmen Valdés",    avatar: "CV", phone: "+52 55 2345 6789", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const,     referredBy: "Valeria Romo",     missingInfo: [] },
  { id: "p11", name: "Héctor Ramírez",   avatar: "HR", phone: "+52 55 3456 7890", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const,     referredBy: null,               missingInfo: [] },
  { id: "p12", name: "Lucía Fernández",  avatar: "LF", phone: "+52 55 4567 8901", confirmed: false, checkedIn: false, paymentStatus: "paid" as const,     referredBy: "Omar Castillo",    missingInfo: ["foto", "fecha de nacimiento"] },
  { id: "p13", name: "Priya Nair",       avatar: "PN", phone: "+52 55 5678 9012", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const,     referredBy: null,               missingInfo: [] },
  { id: "p14", name: "Fernando Ríos",    avatar: "FR", phone: "+52 55 6789 0123", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const,     referredBy: "Carmen Valdés",    missingInfo: [] },
  { id: "p15", name: "Isabel Gutiérrez", avatar: "IG", phone: "+52 55 7890 1234", confirmed: false, checkedIn: false, paymentStatus: "paid" as const,     referredBy: null,               missingInfo: ["objetivo inicial"] },
  { id: "p16", name: "Omar Castillo",    avatar: "OC", phone: "+52 55 8901 2345", confirmed: true,  checkedIn: false, paymentStatus: "overdue" as const,   referredBy: "Héctor Ramírez",   missingInfo: [] },
  { id: "p17", name: "Daniela Espinosa", avatar: "DE", phone: "+52 55 9012 3456", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const,     referredBy: null,               missingInfo: [] },
  { id: "p18", name: "Javier Montes",    avatar: "JM", phone: "+52 55 0123 4567", confirmed: false, checkedIn: false, paymentStatus: "paid" as const,     referredBy: "Daniela Espinosa", missingInfo: ["email", "teléfono de emergencia"] },
  { id: "p19", name: "Claudia Méndez",   avatar: "CM", phone: "+52 55 1234 0001", confirmed: true,  checkedIn: false, paymentStatus: "paid" as const,     referredBy: null,               missingInfo: [] },
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
  initialCount: number        // people who enrolled at Básico
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
    currentPhase: "PL · Mes 3",
    avgMomentum: 74,
    levels: [
      { id: "despertar", label: "Básico", sublabel: "Fin de semana de apertura (3 días)",
        count: 200, retentionPct: 100, coach: "Rodrigo Peña", coachAvatar: "RP",
        startDate: "14 feb 2025", endDate: "16 feb 2025", status: "completed", color: "cyan",
        notes: "Generación muy comprometida desde el inicio. 12 participantes llegaron referidos por ex-alumnos." },
      { id: "expansion", label: "Avanzado", sublabel: "Preparación profunda (4 días)",
        count: 176, retentionPct: 88, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "1 mar 2025", endDate: "4 mar 2025", status: "completed", color: "yellow",
        notes: "24 personas no continuaron post-Básico. 3 reagendaron para Gen Norte. El resto decidió no seguir." },
      { id: "via", label: "PL", sublabel: "Programa de Liderazgo (5 meses)",
        count: 134, retentionPct: 76, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "15 mar 2025", endDate: null, status: "active", color: "pink",
        notes: "42 personas de Avanzado no se inscribieron a Vía. 45 más completaron meses 1-2 y pausaron." },
      { id: "nivel3", label: "Coordinador", sublabel: "En proceso de enrolamiento",
        count: 0, retentionPct: 0, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "—", endDate: null, status: "upcoming", color: "violet",
        notes: "Disponible al completar PL (mes 5)" },
    ],
  },
  {
    id: "norte",
    name: "Generación Norte",
    status: "active",
    startDate: "dic 2024",
    completedDate: null,
    initialCount: 160,
    currentPhase: "Avanzado completada",
    avgMomentum: 58,
    levels: [
      { id: "despertar", label: "Básico", sublabel: "Fin de semana de apertura (3 días)",
        count: 160, retentionPct: 100, coach: "Pedro Infante", coachAvatar: "PI",
        startDate: "6 dic 2024", endDate: "8 dic 2024", status: "completed", color: "cyan",
        notes: "Grupo con alta presencia de empresarios. Momentum inicial muy alto (promedio 84%)." },
      { id: "expansion", label: "Avanzado", sublabel: "Preparación profunda (4 días)",
        count: 134, retentionPct: 84, coach: "Pedro Infante", coachAvatar: "PI",
        startDate: "10 ene 2025", endDate: "13 ene 2025", status: "completed", color: "yellow",
        notes: "26 personas pausaron post-Básico por compromisos de fin de año. 8 reagendaron." },
      { id: "via", label: "PL", sublabel: "Inscripción en proceso",
        count: 67, retentionPct: 50, coach: "Pedro Infante", coachAvatar: "PI",
        startDate: "feb 2025", endDate: null, status: "active", color: "pink",
        notes: "67 se inscribieron a PL. 67 restantes en proceso de decisión o pausados." },
      { id: "nivel3", label: "Coordinador", sublabel: "Próximo ciclo",
        count: 0, retentionPct: 0, coach: "Pedro Infante", coachAvatar: "PI",
        startDate: "—", endDate: null, status: "upcoming", color: "violet",
        notes: null },
    ],
  },
  {
    id: "via12",
    name: "Generación PL 12",
    status: "active",
    startDate: "ene 2025",
    completedDate: null,
    initialCount: 220,
    currentPhase: "PL · Mes 1",
    avgMomentum: 81,
    levels: [
      { id: "despertar", label: "Básico", sublabel: "Fin de semana de apertura (3 días)",
        count: 220, retentionPct: 100, coach: "David Giraldo", coachAvatar: "DG",
        startDate: "17 ene 2025", endDate: "19 ene 2025", status: "completed", color: "cyan",
        notes: "La generación más grande hasta ahora. Récord de puntualidad (97% en día 1)." },
      { id: "expansion", label: "Avanzado", sublabel: "Preparación profunda (4 días)",
        count: 198, retentionPct: 90, coach: "David Giraldo", coachAvatar: "DG",
        startDate: "7 feb 2025", endDate: "10 feb 2025", status: "completed", color: "yellow",
        notes: "22 no continuaron post-Básico. Tasa de retención más alta en la historia del centro." },
      { id: "via", label: "PL", sublabel: "Mes 1 de 5",
        count: 91, retentionPct: 46, coach: "David Giraldo", coachAvatar: "DG",
        startDate: "1 mar 2025", endDate: null, status: "active", color: "pink",
        notes: "107 personas de Avanzado están en proceso de inscripción a Vía. 91 ya comenzaron Mes 1." },
      { id: "nivel3", label: "Coordinador", sublabel: "Próximo ciclo",
        count: 0, retentionPct: 0, coach: "David Giraldo", coachAvatar: "DG",
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
      { id: "despertar", label: "Básico", sublabel: "Fin de semana de apertura",
        count: 180, retentionPct: 100, coach: "Rodrigo Peña", coachAvatar: "RP",
        startDate: "8 mar 2024", endDate: "10 mar 2024", status: "completed", color: "cyan",
        notes: null },
      { id: "expansion", label: "Avanzado", sublabel: "Preparación profunda",
        count: 155, retentionPct: 86, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "5 abr 2024", endDate: "8 abr 2024", status: "completed", color: "yellow",
        notes: "25 no continuaron. Tasa normal para el centro." },
      { id: "via", label: "PL", sublabel: "Programa de Liderazgo completado",
        count: 118, retentionPct: 76, coach: "Ana Reyes", coachAvatar: "AR",
        startDate: "20 abr 2024", endDate: "20 sep 2024", status: "completed", color: "pink",
        notes: "37 no se inscribieron a Vía. Tasa de retención: 76%." },
      { id: "nivel3", label: "Coordinador", sublabel: "Graduados activos",
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
      { id:"x1",  name:"Sofía Aguilar",    avatar:"SA", momentum:0,  status:"dropped",   riskLevel:"high",   missionsCompleted:0,  missionsTotal:12, lastAccessDays:60, note:"No continuó después de Básico" },
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
      { id:"y1",  name:"Carla Duarte",     avatar:"CD", momentum:0,  status:"dropped",   riskLevel:"high",   missionsCompleted:0, missionsTotal:8, lastAccessDays:90, note:"No continuó tras Básico" },
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

// ─── Enrollment Pipeline ─────────────────────────────────────────────────────
// Tracks who is inviting whom across program levels.
// Three key transitions in the cycle:
//   VIA participants  →  invite externals to  →  La Posibilidad (Básico)
//   Básico grads   →  invited to enroll in →  La Imposibilidad (Avanzado)
//   Avanzado grads   →  invited to enroll in →  VIA (PL)

export type EnrollmentStatus =
  | "comprometido"   // participant committed to invite/enroll someone
  | "confirmado"     // invited person confirmed they will come
  | "pagado"         // payment received — fully enrolled
  | "perdido"        // fell through — no longer pursuing

export type ProgramLevel = "Básico" | "Avanzado" | "PL VIA Visión" | "PL VIA Intimidad" | "PL VIA Aprecio" | "Noche de Confianza" | "PL Paraíso"

export interface EnrollmentCommitment {
  id: string
  // Who is doing the inviting
  fromId: string
  fromName: string
  fromAvatar: string
  fromLevel: ProgramLevel          // level the inviter is currently in
  fromCohorte: string
  becaUsed: boolean                // if they're using a scholarship/beca
  // Who they're inviting
  inviteeName: string
  inviteePhone: string
  inviteeRelation: string          // "amiga del trabajo" / "hermano" / "cliente", etc.
  // Where they're going
  toLevel: ProgramLevel            // level the invitee will enter
  toTrainingDate: string           // next available event date
  // Status tracking
  status: EnrollmentStatus
  committedDate: string
  lastContactDate: string | null
  notes: string | null
}

// Becas = scholarships earned by VIA participants for playing big with their promises
export interface BecaRecord {
  ownerId: string
  ownerName: string
  ownerAvatar: string
  ownerCohorte: string
  becasEarned: number
  becasUsed: number
  becasAvailable: number
  earnedAt: string                 // which promise review they earned them in
}

// ── VIA → La Posibilidad (Básico) commitments ───────────────────────────

export const PIPELINE_VIA_TO_POSIBILIDAD: EnrollmentCommitment[] = [
  {
    id: "env1",
    fromId: "p2", fromName: "Diego Salinas", fromAvatar: "DS",
    fromLevel: "PL VIA Visión", fromCohorte: "Generación PL 12", becaUsed: true,
    inviteeName: "Rodrigo Espinosa",  inviteePhone: "+52 55 1234 5678",
    inviteeRelation: "socio de negocios",
    toLevel: "Básico", toTrainingDate: "13 jun 2025",
    status: "confirmado", committedDate: "28 may 2025", lastContactDate: "3 jun 2025",
    notes: "Confirmó por WhatsApp. Pendiente pago del 50%.",
  },
  {
    id: "env2",
    fromId: "p32", fromName: "Natalia Vega", fromAvatar: "NV",
    fromLevel: "PL VIA Visión", fromCohorte: "Generación PL 12", becaUsed: false,
    inviteeName: "Carolina Restrepo", inviteePhone: "+52 55 8800 1122",
    inviteeRelation: "amiga de la universidad",
    toLevel: "Básico", toTrainingDate: "13 jun 2025",
    status: "comprometido", committedDate: "1 jun 2025", lastContactDate: "1 jun 2025",
    notes: "Le interesó mucho. Está revisando fechas con su esposo.",
  },
  {
    id: "env3",
    fromId: "p36", fromName: "Rodrigo Sánchez", fromAvatar: "RS",
    fromLevel: "PL VIA Visión", fromCohorte: "Generación PL 12", becaUsed: true,
    inviteeName: "Luis Torres",       inviteePhone: "+52 55 2345 6789",
    inviteeRelation: "primo",
    toLevel: "Básico", toTrainingDate: "13 jun 2025",
    status: "pagado", committedDate: "27 may 2025", lastContactDate: "2 jun 2025",
    notes: "Pagó completo. Listo para el Básico.",
  },
  {
    id: "env4",
    fromId: "p10", fromName: "Carmen Valdés", fromAvatar: "CV",
    fromLevel: "PL VIA Aprecio", fromCohorte: "Generación Omega", becaUsed: false,
    inviteeName: "Ana Paula Vidal",   inviteePhone: "+52 55 8765 4321",
    inviteeRelation: "compañera de trabajo",
    toLevel: "Básico", toTrainingDate: "13 jun 2025",
    status: "comprometido", committedDate: "29 may 2025", lastContactDate: "29 may 2025",
    notes: null,
  },
  {
    id: "env5",
    fromId: "n6", fromName: "Marco Fuentes", fromAvatar: "MF",
    fromLevel: "PL VIA Aprecio", fromCohorte: "Generación Norte", becaUsed: true,
    inviteeName: "Paola Mendez",      inviteePhone: "+52 55 3456 7890",
    inviteeRelation: "cliente",
    toLevel: "Básico", toTrainingDate: "13 jun 2025",
    status: "comprometido", committedDate: "30 may 2025", lastContactDate: "30 may 2025",
    notes: "Ha llamado 2 veces sin respuesta.",
  },
  {
    id: "env6",
    fromId: "p19", fromName: "Claudia Méndez", fromAvatar: "CM",
    fromLevel: "PL VIA Aprecio", fromCohorte: "Generación Omega", becaUsed: false,
    inviteeName: "Jorge Ríos",        inviteePhone: "+52 55 5544 3322",
    inviteeRelation: "pareja",
    toLevel: "Básico", toTrainingDate: "13 jun 2025",
    status: "perdido", committedDate: "22 may 2025", lastContactDate: "28 may 2025",
    notes: "No quiso continuar. No se pudo enrolar.",
  },
  {
    id: "env7",
    fromId: "n4", fromName: "Priya Nair", fromAvatar: "PN",
    fromLevel: "PL VIA Aprecio", fromCohorte: "Generación Omega", becaUsed: false,
    inviteeName: "Daniela Castro",    inviteePhone: "+52 55 7890 1234",
    inviteeRelation: "amiga",
    toLevel: "Básico", toTrainingDate: "13 jun 2025",
    status: "pagado", committedDate: "3 jun 2025", lastContactDate: "3 jun 2025",
    notes: "Pagó completo.",
  },
]

// ── La Posibilidad → La Imposibilidad (Avanzado) commitments ──────────────

export const PIPELINE_POSIBILIDAD_TO_IMPOSIBILIDAD: EnrollmentCommitment[] = [
  {
    id: "en2a",
    fromId: "x10", fromName: "Sofía Aguilar", fromAvatar: "SA",
    fromLevel: "Básico", fromCohorte: "Generación Omega Alumni", becaUsed: false,
    inviteeName: "Sofía Aguilar",     inviteePhone: "+52 55 6611 7722",
    inviteeRelation: "ella misma",
    toLevel: "Avanzado", toTrainingDate: "20 jun 2025",
    status: "confirmado", committedDate: "2 jun 2025", lastContactDate: "2 jun 2025",
    notes: "Vivió el Básico en feb y quiere continuar. Coach la contactó.",
  },
  {
    id: "en2b",
    fromId: "x11", fromName: "Miguel Soto", fromAvatar: "MS",
    fromLevel: "Básico", fromCohorte: "Generación Omega Alumni", becaUsed: false,
    inviteeName: "Miguel Soto",       inviteePhone: "+52 55 9988 7766",
    inviteeRelation: "él mismo",
    toLevel: "Avanzado", toTrainingDate: "20 jun 2025",
    status: "comprometido", committedDate: "4 jun 2025", lastContactDate: "4 jun 2025",
    notes: "Regresó de viaje. Tiene intención pero no ha confirmado fecha.",
  },
  {
    id: "en2c",
    fromId: "pt1", fromName: "Rodrigo Espinosa", fromAvatar: "RE",
    fromLevel: "Básico", fromCohorte: "Generación Próxima", becaUsed: false,
    inviteeName: "Rodrigo Espinosa",  inviteePhone: "+52 55 1234 5678",
    inviteeRelation: "él mismo",
    toLevel: "Avanzado", toTrainingDate: "20 jun 2025",
    status: "comprometido", committedDate: "—", lastContactDate: null,
    notes: "Aún no vivió el Básico (13 jun). Se marca como prospecto para Avanzado.",
  },
]

// ── La Imposibilidad → VIA (PL) commitments ──────────────────────

export const PIPELINE_IMPOSIBILIDAD_TO_VIA: EnrollmentCommitment[] = [
  {
    id: "en3a",
    fromId: "p3", fromName: "Mariana Ortiz", fromAvatar: "MO",
    fromLevel: "Avanzado", fromCohorte: "Generación Norte", becaUsed: false,
    inviteeName: "Mariana Ortiz",     inviteePhone: "+52 55 3344 5566",
    inviteeRelation: "ella misma",
    toLevel: "PL VIA Visión", toTrainingDate: "1 jul 2025",
    status: "comprometido", committedDate: "5 jun 2025", lastContactDate: "5 jun 2025",
    notes: "Terminó Avanzado y quiere continuar. Pendiente firma de inscripción.",
  },
  {
    id: "en3b",
    fromId: "p6", fromName: "Andrés Mora", fromAvatar: "AM",
    fromLevel: "Avanzado", fromCohorte: "Generación Norte", becaUsed: false,
    inviteeName: "Andrés Mora",       inviteePhone: "+52 55 7788 9900",
    inviteeRelation: "él mismo",
    toLevel: "PL VIA Visión", toTrainingDate: "1 jul 2025",
    status: "perdido", committedDate: "20 may 2025", lastContactDate: "1 jun 2025",
    notes: "No quiso continuar. Dice que fue suficiente con la Imposibilidad.",
  },
  {
    id: "en3c",
    fromId: "y3", fromName: "Carla Duarte", fromAvatar: "CD",
    fromLevel: "Avanzado", fromCohorte: "Generación Norte Alumni", becaUsed: false,
    inviteeName: "Carla Duarte",      inviteePhone: "+52 55 1122 3344",
    inviteeRelation: "ella misma",
    toLevel: "PL VIA Visión", toTrainingDate: "1 jul 2025",
    status: "confirmado", committedDate: "3 jun 2025", lastContactDate: "3 jun 2025",
    notes: "Regresó de viaje al extranjero. Lista para inscribirse.",
  },
]

// ── Becas disponibles ──────────────────────────────────────────────────────

export const BECAS_TRACKING: BecaRecord[] = [
  { ownerId: "p2",  ownerName: "Diego Salinas",   ownerAvatar: "DS", ownerCohorte: "PL 12",  becasEarned: 3, becasUsed: 2, becasAvailable: 1, earnedAt: "Revisión 2 de promesas" },
  { ownerId: "p36", ownerName: "Rodrigo Sánchez",  ownerAvatar: "RS", ownerCohorte: "PL 12",  becasEarned: 2, becasUsed: 2, becasAvailable: 0, earnedAt: "Revisión 1 y 2" },
  { ownerId: "n6",  ownerName: "Marco Fuentes",    ownerAvatar: "MF", ownerCohorte: "Norte",   becasEarned: 3, becasUsed: 3, becasAvailable: 0, earnedAt: "Revisión 3 de promesas" },
  { ownerId: "n4",  ownerName: "Priya Nair",       ownerAvatar: "PN", ownerCohorte: "Omega",   becasEarned: 2, becasUsed: 1, becasAvailable: 1, earnedAt: "Revisión 2 de promesas" },
  { ownerId: "p19", ownerName: "Claudia Méndez",   ownerAvatar: "CM", ownerCohorte: "Omega",   becasEarned: 2, becasUsed: 0, becasAvailable: 2, earnedAt: "Revisión 3 de promesas" },
  { ownerId: "p32", ownerName: "Natalia Vega",     ownerAvatar: "NV", ownerCohorte: "PL 12",  becasEarned: 1, becasUsed: 0, becasAvailable: 1, earnedAt: "Revisión 2 de promesas" },
]

export const STAFF_ACCOUNTS = [
  { id: "s1", name: "Karla Ríos",    avatar: "KR", role: "Mesa de Registro", email: "karla@level.co" },
  { id: "s2", name: "Daniel Mora",   avatar: "DM", role: "Mesa de Registro", email: "daniel@level.co" },
  { id: "s3", name: "Paola Juárez",  avatar: "PJ", role: "Operaciones",      email: "paola@level.co" },
]

// ─── Ops Console — comprehensive participant type ──────────────────────────────

export type OpsAttendanceStatus = "checkedin" | "confirmado" | "pendiente" | "no-show" | "walk-in" | "no-aplica"
export type OpsPaymentStatus    = "pagado" | "parcial" | "pendiente" | "vencido"
export type OpsNextTrainStatus  = "inscrito" | "confirmado" | "sin-confirmar" | "duda" | "cancelado" | "reagendado" | null
export type OpsOverallStatus    = "activo" | "inscrito-siguiente" | "incidencia" | "seguimiento" | "vip" | "cancelado"

export interface OpsIncident {
  id: string
  type: string
  description: string
  date: string
  severity: "alta" | "media" | "baja"
  status: "abierta" | "resuelta"
  assignedTo: string
}

export interface OpsParticipant {
  id: string
  name: string
  avatar: string
  phone: string
  email: string

  // Program level
  levelCode: "despertar" | "expansion" | "via" | "alumni" | "lead"
  levelLabel: string        // "La Posibilidad · Completada", "VIA Mes 3 de 5", etc
  cohorte: string
  coach: string

  // Today's check-in
  todayStatus: OpsAttendanceStatus
  arrivalTime: string | null

  // Next training
  nextTraining: string | null
  nextTrainingDate: string | null
  nextTrainingStatus: OpsNextTrainStatus

  // Payment
  paymentStatus: OpsPaymentStatus
  amountTotal: number
  amountPaid: number
  concept: string
  daysOverdue: number | null   // null = not overdue; positive = days past due
  hasComprobante: boolean
  hasBeca: boolean
  becaAmount: number | null

  // Referral / enrollment
  referredBy: string | null
  enrolledCount: number        // people this participant enrolled
  becasAvailable: number

  // Overall
  overallStatus: OpsOverallStatus
  responsable: string          // staff member handling follow-up

  // Issues
  incidents: OpsIncident[]
  missingInfo: string[]
  notes: string | null
  coachNote: string | null

  // Course history
  courseHistory: Array<{ course: string; date: string; status: "completado" | "en-proceso" | "cancelado" }>
}

export const OPS_PARTICIPANTS: OpsParticipant[] = [
  // ── Generación Omega (PL Mes 3) ─────────────────────────────────
  {
    id: "p1", name: "Valeria Romo", avatar: "VR",
    phone: "+52 55 1234 5678", email: "valeria.romo@gmail.com",
    levelCode: "via", levelLabel: "VIA Mes 3 de 5", cohorte: "Generación Omega", coach: "Ana Reyes",
    todayStatus: "no-show", arrivalTime: null,
    nextTraining: "Fin de semana 4 · VIA", nextTrainingDate: "5 jul 2025", nextTrainingStatus: "sin-confirmar",
    paymentStatus: "vencido", amountTotal: 4200, amountPaid: 0, concept: "VIA Mes 4", daysOverdue: 3,
    hasComprobante: false, hasBeca: false, becaAmount: null,
    referredBy: "Diego Salinas", enrolledCount: 1, becasAvailable: 0,
    overallStatus: "incidencia", responsable: "Karla Ríos",
    incidents: [
      { id: "i1", type: "Pago vencido", description: "Mes 4 vencido hace 3 días. Sin comprobante ni respuesta.", date: "2 jun 2025", severity: "alta", status: "abierta", assignedTo: "Karla Ríos" },
      { id: "i2", type: "Participante sensible", description: "Coach reporta posible crisis personal. Requiere contacto cuidadoso.", date: "28 may 2025", severity: "alta", status: "abierta", assignedTo: "Ana Reyes" },
    ],
    missingInfo: ["email", "contacto de emergencia"],
    notes: "Ha respondido 1 de 3 mensajes. Llamar directamente.", coachNote: "Valeria está pasando por algo difícil. No presionar con el pago hoy.",
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "15 feb 2025", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "1 mar 2025", status: "completado" },
      { course: "VIA LEVEL", date: "15 mar 2025", status: "en-proceso" },
    ],
  },
  {
    id: "p10", name: "Carmen Valdés", avatar: "CV",
    phone: "+52 55 2345 6789", email: "carmen.valdes@outlook.com",
    levelCode: "via", levelLabel: "VIA Mes 3 de 5", cohorte: "Generación Omega", coach: "Ana Reyes",
    todayStatus: "checkedin", arrivalTime: "7:02 pm",
    nextTraining: "Fin de semana 4 · VIA", nextTrainingDate: "5 jul 2025", nextTrainingStatus: "confirmado",
    paymentStatus: "pagado", amountTotal: 4200, amountPaid: 4200, concept: "VIA Mes 3", daysOverdue: null,
    hasComprobante: true, hasBeca: false, becaAmount: null,
    referredBy: "Valeria Romo", enrolledCount: 1, becasAvailable: 0,
    overallStatus: "activo", responsable: "Daniel Mora",
    incidents: [],
    missingInfo: [], notes: null, coachNote: "Destacada. Buen candidata a Sabio en siguiente ciclo.",
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "15 feb 2025", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "1 mar 2025", status: "completado" },
      { course: "VIA LEVEL", date: "15 mar 2025", status: "en-proceso" },
    ],
  },
  {
    id: "p11", name: "Héctor Ramírez", avatar: "HR",
    phone: "+52 55 3456 7890", email: "hector.ramirez@gmail.com",
    levelCode: "via", levelLabel: "VIA Mes 3 de 5", cohorte: "Generación Omega", coach: "Ana Reyes",
    todayStatus: "checkedin", arrivalTime: "7:15 pm",
    nextTraining: "Fin de semana 4 · VIA", nextTrainingDate: "5 jul 2025", nextTrainingStatus: "sin-confirmar",
    paymentStatus: "parcial", amountTotal: 4200, amountPaid: 2100, concept: "VIA Mes 3", daysOverdue: null,
    hasComprobante: true, hasBeca: false, becaAmount: null,
    referredBy: null, enrolledCount: 0, becasAvailable: 0,
    overallStatus: "seguimiento", responsable: "Karla Ríos",
    incidents: [
      { id: "i3", type: "Comprobante dudoso", description: "Comprobante de $4,200 parece ser el mismo del mes anterior (mismo folio). Revisar con banco.", date: "1 jun 2025", severity: "alta", status: "abierta", assignedTo: "Karla Ríos" },
    ],
    missingInfo: [], notes: "Pago parcial de $2,100. Prometió el resto esta semana.", coachNote: null,
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "15 feb 2025", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "1 mar 2025", status: "completado" },
      { course: "VIA LEVEL", date: "15 mar 2025", status: "en-proceso" },
    ],
  },
  {
    id: "p16", name: "Omar Castillo", avatar: "OC",
    phone: "+52 55 8901 2345", email: "omar.castillo@empresa.com",
    levelCode: "via", levelLabel: "VIA Mes 3 de 5", cohorte: "Generación Omega", coach: "Ana Reyes",
    todayStatus: "pendiente", arrivalTime: null,
    nextTraining: "Fin de semana 4 · VIA", nextTrainingDate: "5 jul 2025", nextTrainingStatus: "duda",
    paymentStatus: "vencido", amountTotal: 4200, amountPaid: 0, concept: "VIA Mes 3", daysOverdue: 5,
    hasComprobante: false, hasBeca: true, becaAmount: 1000,
    referredBy: "Héctor Ramírez", enrolledCount: 0, becasAvailable: 0,
    overallStatus: "incidencia", responsable: "Karla Ríos",
    incidents: [
      { id: "i4", type: "Beca no autorizada", description: "Beca de $1,000 aplicada en inscripción VIA sin firma del dueño.", date: "14 mar 2025", severity: "media", status: "abierta", assignedTo: "Carlos Mendoza" },
    ],
    missingInfo: ["foto"], notes: "Dice que tiene dificultades económicas. Hablar con Carlos (dueño) antes de tomar acción.", coachNote: "Hay un tema personal detrás del pago. Requiere sensibilidad.",
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "15 feb 2025", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "1 mar 2025", status: "completado" },
      { course: "VIA LEVEL", date: "15 mar 2025", status: "en-proceso" },
    ],
  },
  {
    id: "p19", name: "Claudia Méndez", avatar: "CM",
    phone: "+52 55 1234 0001", email: "claudia.mendez@gmail.com",
    levelCode: "via", levelLabel: "VIA Mes 3 de 5", cohorte: "Generación Omega", coach: "Ana Reyes",
    todayStatus: "checkedin", arrivalTime: "6:55 pm",
    nextTraining: "Fin de semana 4 · VIA", nextTrainingDate: "5 jul 2025", nextTrainingStatus: "inscrito",
    paymentStatus: "pagado", amountTotal: 4200, amountPaid: 4200, concept: "VIA Mes 3", daysOverdue: null,
    hasComprobante: true, hasBeca: false, becaAmount: null,
    referredBy: null, enrolledCount: 0, becasAvailable: 2,
    overallStatus: "vip", responsable: "Daniel Mora",
    incidents: [],
    missingInfo: [], notes: "Top performer — 12/12 misiones. Tiene 2 becas disponibles.", coachNote: "Ideal para presentarla como caso de éxito.",
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "15 feb 2025", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "1 mar 2025", status: "completado" },
      { course: "VIA LEVEL", date: "15 mar 2025", status: "en-proceso" },
    ],
  },
  // ── Generación Norte (Avanzado completada) ──────────────────────────────
  {
    id: "p3", name: "Mariana Ortiz", avatar: "MO",
    phone: "+52 55 5566 7788", email: "mariana.ortiz@hotmail.com",
    levelCode: "expansion", levelLabel: "La Imposibilidad · Completada", cohorte: "Generación Norte", coach: "Pedro Infante",
    todayStatus: "no-aplica", arrivalTime: null,
    nextTraining: "VIA LEVEL (Mes 1)", nextTrainingDate: "1 jul 2025", nextTrainingStatus: "sin-confirmar",
    paymentStatus: "pendiente", amountTotal: 18000, amountPaid: 8900, concept: "Inscripción VIA", daysOverdue: null,
    hasComprobante: true, hasBeca: false, becaAmount: null,
    referredBy: null, enrolledCount: 0, becasAvailable: 0,
    overallStatus: "seguimiento", responsable: "Daniel Mora",
    incidents: [],
    missingInfo: [], notes: "Terminó Avanzado, aún decide si entra a VIA. Coach la está acompañando.", coachNote: "Tiene miedo al compromiso económico. Ofrecer plan de pagos.",
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "6 dic 2024", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "10 ene 2025", status: "completado" },
    ],
  },
  {
    id: "p22", name: "Paola Serrano", avatar: "PS",
    phone: "+52 55 3344 5566", email: "paola.serrano@gmail.com",
    levelCode: "expansion", levelLabel: "La Imposibilidad · Completada", cohorte: "Generación Norte", coach: "Pedro Infante",
    todayStatus: "no-aplica", arrivalTime: null,
    nextTraining: "VIA LEVEL (Mes 1)", nextTrainingDate: "1 jul 2025", nextTrainingStatus: "duda",
    paymentStatus: "vencido", amountTotal: 8900, amountPaid: 0, concept: "Mensualidad Avanzado", daysOverdue: 7,
    hasComprobante: false, hasBeca: false, becaAmount: null,
    referredBy: null, enrolledCount: 0, becasAvailable: 0,
    overallStatus: "incidencia", responsable: "Karla Ríos",
    incidents: [
      { id: "i5", type: "Pago vencido 7 días", description: "Mensualidad Avanzado vencida hace 7 días. 3 mensajes sin respuesta.", date: "29 may 2025", severity: "alta", status: "abierta", assignedTo: "Karla Ríos" },
    ],
    missingInfo: [], notes: "Último contacto: 28 may. No responde WA ni llamadas.", coachNote: "Marco habló con ella. Dice que quiere continuar pero tiene un problema de dinero temporal.",
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "6 dic 2024", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "10 ene 2025", status: "en-proceso" },
    ],
  },
  // ── Generación PL 12 ─────────────────────────────────────────────────────
  {
    id: "p2", name: "Diego Salinas", avatar: "DS",
    phone: "+52 55 9988 1122", email: "diego.salinas@empresa.mx",
    levelCode: "via", levelLabel: "VIA Mes 1 de 5", cohorte: "Generación PL 12", coach: "David Giraldo",
    todayStatus: "no-aplica", arrivalTime: null,
    nextTraining: "Fin de semana 2 · VIA", nextTrainingDate: "28 jun 2025", nextTrainingStatus: "confirmado",
    paymentStatus: "pagado", amountTotal: 4200, amountPaid: 4200, concept: "VIA Mes 1", daysOverdue: null,
    hasComprobante: true, hasBeca: false, becaAmount: null,
    referredBy: null, enrolledCount: 5, becasAvailable: 1,
    overallStatus: "vip", responsable: "Daniel Mora",
    incidents: [],
    missingInfo: [], notes: "Embajador top. Enroló a 5 personas para el Básico del 13 jun.", coachNote: "Candidato a Coach Assistant el próximo ciclo.",
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "17 ene 2025", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "7 feb 2025", status: "completado" },
      { course: "VIA LEVEL", date: "1 mar 2025", status: "en-proceso" },
    ],
  },
  {
    id: "p34", name: "Carlos Peñafiel", avatar: "CP",
    phone: "+52 55 6677 8899", email: "carlos.p@gmail.com",
    levelCode: "via", levelLabel: "VIA Mes 1 de 5", cohorte: "Generación PL 12", coach: "David Giraldo",
    todayStatus: "no-aplica", arrivalTime: null,
    nextTraining: "Fin de semana 2 · VIA", nextTrainingDate: "28 jun 2025", nextTrainingStatus: "sin-confirmar",
    paymentStatus: "pendiente", amountTotal: 4200, amountPaid: 0, concept: "VIA Mes 1", daysOverdue: null,
    hasComprobante: false, hasBeca: false, becaAmount: null,
    referredBy: null, enrolledCount: 0, becasAvailable: 0,
    overallStatus: "incidencia", responsable: "Karla Ríos",
    incidents: [
      { id: "i6", type: "Participante activo sin pago", description: "7 días activo en plataforma, ha completado 3 misiones, pero no hay registro de pago de Mes 1.", date: "5 jun 2025", severity: "alta", status: "abierta", assignedTo: "Karla Ríos" },
    ],
    missingInfo: ["comprobante de pago"],
    notes: "Está usando la plataforma activamente pero el pago no está registrado.", coachNote: null,
    courseHistory: [
      { course: "La Posibilidad (Básico)", date: "17 ene 2025", status: "completado" },
      { course: "La Imposibilidad (Avanzado)", date: "7 feb 2025", status: "completado" },
      { course: "VIA LEVEL", date: "1 mar 2025", status: "en-proceso" },
    ],
  },
  // ── Próximo Básico — pre-inscritos ────────────────────────────────────
  {
    id: "pt1", name: "Rodrigo Espinosa", avatar: "RE",
    phone: "+52 55 1234 5678", email: "rodrigo.espinosa@gmail.com",
    levelCode: "lead", levelLabel: "Próximo · La Posibilidad", cohorte: "Próxima Gen (13 jun)", coach: "—",
    todayStatus: "no-aplica", arrivalTime: null,
    nextTraining: "La Posibilidad · Básico", nextTrainingDate: "13 jun 2025", nextTrainingStatus: "confirmado",
    paymentStatus: "parcial", amountTotal: 6500, amountPaid: 3250, concept: "Básico 13 jun", daysOverdue: null,
    hasComprobante: true, hasBeca: false, becaAmount: null,
    referredBy: "Diego Salinas", enrolledCount: 0, becasAvailable: 0,
    overallStatus: "inscrito-siguiente", responsable: "Daniel Mora",
    incidents: [],
    missingInfo: ["foto", "firma de términos"],
    notes: "Anticipo del 50% recibido. Saldo de $3,250 pendiente antes del 13 jun.", coachNote: null,
    courseHistory: [],
  },
  {
    id: "pt2", name: "Ana Paula Vidal", avatar: "AV",
    phone: "+52 55 8765 4321", email: "anapaula@gmail.com",
    levelCode: "lead", levelLabel: "Próximo · La Posibilidad", cohorte: "Próxima Gen (13 jun)", coach: "—",
    todayStatus: "no-aplica", arrivalTime: null,
    nextTraining: "La Posibilidad · Básico", nextTrainingDate: "13 jun 2025", nextTrainingStatus: "sin-confirmar",
    paymentStatus: "pendiente", amountTotal: 6500, amountPaid: 0, concept: "Básico 13 jun", daysOverdue: null,
    hasComprobante: false, hasBeca: false, becaAmount: null,
    referredBy: "Carmen Valdés", enrolledCount: 0, becasAvailable: 0,
    overallStatus: "seguimiento", responsable: "Karla Ríos",
    incidents: [],
    missingInfo: ["pago", "foto", "firma de términos"],
    notes: "Comprometida verbalmente pero sin pago. Carmen (quien la trajo) le está dando seguimiento.", coachNote: null,
    courseHistory: [],
  },
  {
    id: "pt3", name: "Luis Torres", avatar: "LT",
    phone: "+52 55 2345 6789", email: "luis.torres@empresa.com",
    levelCode: "lead", levelLabel: "Próximo · La Posibilidad", cohorte: "Próxima Gen (13 jun)", coach: "—",
    todayStatus: "no-aplica", arrivalTime: null,
    nextTraining: "La Posibilidad · Básico", nextTrainingDate: "13 jun 2025", nextTrainingStatus: "confirmado",
    paymentStatus: "pagado", amountTotal: 6500, amountPaid: 6500, concept: "Básico 13 jun", daysOverdue: null,
    hasComprobante: true, hasBeca: false, becaAmount: null,
    referredBy: "Diego Salinas", enrolledCount: 0, becasAvailable: 0,
    overallStatus: "inscrito-siguiente", responsable: "Daniel Mora",
    incidents: [],
    missingInfo: [],
    notes: "Listo. Pago completo. Esperar confirmación logística del evento.", coachNote: null,
    courseHistory: [],
  },
  {
    id: "pt4", name: "Paola Mendez", avatar: "PM",
    phone: "+52 55 3456 7890", email: "paola.mendez@gmail.com",
    levelCode: "lead", levelLabel: "Próximo · La Posibilidad", cohorte: "Próxima Gen (13 jun)", coach: "—",
    todayStatus: "no-aplica", arrivalTime: null,
    nextTraining: "La Posibilidad · Básico", nextTrainingDate: "13 jun 2025", nextTrainingStatus: "sin-confirmar",
    paymentStatus: "pendiente", amountTotal: 6500, amountPaid: 0, concept: "Básico 13 jun", daysOverdue: null,
    hasComprobante: false, hasBeca: true, becaAmount: 2000,
    referredBy: "Marco Fuentes", enrolledCount: 0, becasAvailable: 0,
    overallStatus: "seguimiento", responsable: "Karla Ríos",
    incidents: [
      { id: "i7", type: "Sin respuesta", description: "2 llamadas y 1 WhatsApp sin respuesta en 6 días. Beca aplicada pendiente de confirmar.", date: "30 may 2025", severity: "media", status: "abierta", assignedTo: "Karla Ríos" },
    ],
    missingInfo: ["pago", "confirmar asistencia"],
    notes: "Tiene beca de $2,000 de Marco. Sin respuesta desde hace 6 días.", coachNote: null,
    courseHistory: [],
  },
]

// ─── Financial anomalies — for owner dashboard ────────────────────────────────

export type AnomalyType =
  | "pago-sin-comprobante"
  | "activo-sin-pago"
  | "beca-sin-autorizacion"
  | "monto-distinto"
  | "gasto-sin-comprobante"
  | "comprobante-duplicado"
  | "reembolso-pendiente"
  | "registro-no-autorizado"

export interface FinancialAnomaly {
  id: string
  type: AnomalyType
  severity: "alta" | "media" | "baja"
  description: string
  participant: string | null
  amount: number | null
  detectedAt: string
  status: "pendiente" | "en-revision" | "resuelta"
  assignedTo: string
}

export const FINANCIAL_ANOMALIES: FinancialAnomaly[] = [
  {
    id: "fa1", type: "activo-sin-pago", severity: "alta",
    description: "Carlos Peñafiel está activo en plataforma hace 7 días (3 misiones completadas) sin pago registrado del Mes 1.",
    participant: "Carlos Peñafiel", amount: 4200, detectedAt: "5 jun 2025", status: "pendiente", assignedTo: "Karla Ríos",
  },
  {
    id: "fa2", type: "pago-sin-comprobante", severity: "alta",
    description: "Valeria Romo — $4,200 registrado el 1 mar sin comprobante adjunto. El sistema lo marcó como pagado sin validación.",
    participant: "Valeria Romo", amount: 4200, detectedAt: "1 mar 2025", status: "en-revision", assignedTo: "Karla Ríos",
  },
  {
    id: "fa3", type: "beca-sin-autorizacion", severity: "alta",
    description: "Descuento de $1,000 aplicado a Omar Castillo en inscripción VIA. No hay registro de autorización del dueño en el sistema.",
    participant: "Omar Castillo", amount: 1000, detectedAt: "14 mar 2025", status: "pendiente", assignedTo: "Carlos Mendoza",
  },
  {
    id: "fa4", type: "comprobante-duplicado", severity: "alta",
    description: "Héctor Ramírez — comprobante enviado el 1 jun coincide en folio y monto con el del mes anterior. Posible reutilización.",
    participant: "Héctor Ramírez", amount: 4200, detectedAt: "1 jun 2025", status: "en-revision", assignedTo: "Karla Ríos",
  },
  {
    id: "fa5", type: "gasto-sin-comprobante", severity: "media",
    description: "Gastos de salón del evento 5 jun — $8,500 registrados por staff sin factura adjunta. Límite de aprobación sin factura es $2,000.",
    participant: null, amount: 8500, detectedAt: "5 jun 2025", status: "pendiente", assignedTo: "Paola Juárez",
  },
  {
    id: "fa6", type: "monto-distinto", severity: "media",
    description: "Pago de Rodrigo Espinosa del 28 may registrado como $3,250 pero el plan es $6,500 completo o $0 (pago total o nada). Anticipo no estaba pactado.",
    participant: "Rodrigo Espinosa", amount: 3250, detectedAt: "28 may 2025", status: "pendiente", assignedTo: "Daniel Mora",
  },
  {
    id: "fa7", type: "reembolso-pendiente", severity: "baja",
    description: "Óscar Medina solicitó reembolso parcial de $3,200 el 15 abr por no continuar en VIA. Aprobación del dueño pendiente hace 20 días.",
    participant: "Óscar Medina", amount: 3200, detectedAt: "15 abr 2025", status: "en-revision", assignedTo: "Carlos Mendoza",
  },
]
