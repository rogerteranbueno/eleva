export type Phase = "Despertar" | "Expansión" | "Vía Creania"
export type RiskLevel = "high" | "medium" | "low"

export interface Coach {
  id: string
  name: string
  avatar: string
  cohorte: string
  lastContactDaysAgo: number
}

export interface Specialist {
  id: string
  name: string
  specialty: string
  avatar: string
  available: boolean
}

export interface Mission {
  id: string
  week: number
  title: string
  description: string
  completed: boolean
  dueInDays: number
  requiresEvidence: boolean
}

export interface FeedPost {
  id: string
  author: string
  avatar: string
  content: string
  minutesAgo: number
  reactions: number
  comments: number
  isPinned?: boolean
  isCoach?: boolean
}

export interface ChallengeParticipation {
  completed: number
  total: number
}

export interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  streak: number
  isCurrentUser?: boolean
}

export interface Cohorte {
  id: string
  name: string
  phase: Phase
  phaseDetail: string
  participants: number
  momentum: number
  status: "active" | "attention" | "thriving"
  coach: string
}

export interface Payment {
  concept: string
  amount: number
  date: string
  status: "paid" | "pending"
}

export interface ActivityDay {
  date: string
  active: boolean
  daysAgo: number
}

export interface Objective {
  title: string
  progress: number
  specialistId: string
}

export interface Participant {
  id: string
  name: string
  avatar: string
  cohorte: string
  phase: Phase
  phaseDetail: string
  momentum: number
  streak: number
  bestStreak: number
  inactiveDays: number
  coachId: string
  riskLevel: RiskLevel
  missionsCompleted: number
  missionsTotal: number
  pendingMissions: number
  lastAccess: string
  objective: Objective
  payments: Payment[]
  coachNote: string
  coachNoteDate: string
  activity: ActivityDay[]
}

export interface CenterStats {
  activeParticipants: number
  atRiskCount: number
  activeCohortes: number
  nextEventDays: number
  averageMomentum: number
  monthlyGrowth: number
}

export interface DemoState {
  reminderSent: boolean
  missionAssigned: boolean
  escalated: boolean
  eventInvited: boolean
  missionCompleted: boolean
  sessionBooked: boolean
  challengeJoined: boolean
  valeriaMomentum: number
  coachNoteAdded: boolean
}
