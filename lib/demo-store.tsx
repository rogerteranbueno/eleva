"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { DemoState } from "@/lib/types"

const INITIAL_STATE: DemoState = {
  reminderSent: false,
  missionAssigned: false,
  escalated: false,
  eventInvited: false,
  missionCompleted: false,
  sessionBooked: false,
  challengeJoined: false,
  valeriaMomentum: 23,
  coachNoteAdded: false,
}

type Action =
  | { type: "SEND_REMINDER" }
  | { type: "ASSIGN_MISSION" }
  | { type: "ESCALATE" }
  | { type: "INVITE_EVENT" }
  | { type: "COMPLETE_MISSION" }
  | { type: "BOOK_SESSION" }
  | { type: "JOIN_CHALLENGE" }
  | { type: "ADD_COACH_NOTE" }
  | { type: "RESET" }

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "SEND_REMINDER":
      return { ...state, reminderSent: true, valeriaMomentum: Math.min(state.valeriaMomentum + 2, 100) }
    case "ASSIGN_MISSION":
      return { ...state, missionAssigned: true, valeriaMomentum: Math.min(state.valeriaMomentum + 3, 100) }
    case "ESCALATE":
      return { ...state, escalated: true, valeriaMomentum: Math.min(state.valeriaMomentum + 2, 100) }
    case "INVITE_EVENT":
      return { ...state, eventInvited: true, valeriaMomentum: Math.min(state.valeriaMomentum + 2, 100) }
    case "COMPLETE_MISSION":
      return { ...state, missionCompleted: true, valeriaMomentum: Math.min(state.valeriaMomentum + 15, 100) }
    case "BOOK_SESSION":
      return { ...state, sessionBooked: true, valeriaMomentum: Math.min(state.valeriaMomentum + 5, 100) }
    case "JOIN_CHALLENGE":
      return { ...state, challengeJoined: true, valeriaMomentum: Math.min(state.valeriaMomentum + 3, 100) }
    case "ADD_COACH_NOTE":
      return { ...state, coachNoteAdded: true }
    case "RESET":
      return INITIAL_STATE
    default:
      return state
  }
}

interface DemoContextValue {
  state: DemoState
  dispatch: React.Dispatch<Action>
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoStore() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error("useDemoStore must be used inside DemoProvider")
  return ctx
}
