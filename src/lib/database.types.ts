export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_summaries: {
        Row: {
          content: Json
          created_at: string
          id: string
          kind: string
          model: string | null
          organization_id: string
          ref_id: string | null
          source: string
          usage: Json
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          kind: string
          model?: string | null
          organization_id: string
          ref_id?: string | null
          source: string
          usage?: Json
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          kind?: string
          model?: string | null
          organization_id?: string
          ref_id?: string | null
          source?: string
          usage?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ai_summaries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          corrected: boolean
          correction_reason: string | null
          created_at: string
          id: string
          organization_id: string
          participation_id: string
          recorded_by: string | null
          session_id: string
          status: string
          updated_at: string
        }
        Insert: {
          corrected?: boolean
          correction_reason?: string | null
          created_at?: string
          id?: string
          organization_id: string
          participation_id: string
          recorded_by?: string | null
          session_id: string
          status: string
          updated_at?: string
        }
        Update: {
          corrected?: boolean
          correction_reason?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          participation_id?: string
          recorded_by?: string | null
          session_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "participations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_person_id: string | null
          created_at: string
          details: Json
          id: string
          object_id: string | null
          object_type: string
          organization_id: string | null
        }
        Insert: {
          action: string
          actor_person_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          object_id?: string | null
          object_type: string
          organization_id?: string | null
        }
        Update: {
          action?: string
          actor_person_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          object_id?: string | null
          object_type?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_person_id_fkey"
            columns: ["actor_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_role: string
          assignee_person_id: string | null
          closed_at: string | null
          closed_reason: string | null
          cohort_id: string | null
          created_at: string
          due_at: string | null
          id: string
          opened_at: string
          organization_id: string
          priority: string
          status: string
          subject_person_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_role?: string
          assignee_person_id?: string | null
          closed_at?: string | null
          closed_reason?: string | null
          cohort_id?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          opened_at?: string
          organization_id: string
          priority?: string
          status?: string
          subject_person_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_role?: string
          assignee_person_id?: string | null
          closed_at?: string | null
          closed_reason?: string | null
          cohort_id?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          opened_at?: string
          organization_id?: string
          priority?: string
          status?: string
          subject_person_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_assignee_person_id_fkey"
            columns: ["assignee_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_subject_person_id_fkey"
            columns: ["subject_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      charges: {
        Row: {
          amount_cents: number
          concept: string
          created_at: string
          currency: string
          due_on: string
          id: string
          organization_id: string
          participation_id: string | null
          person_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          concept: string
          created_at?: string
          currency?: string
          due_on: string
          id?: string
          organization_id: string
          participation_id?: string | null
          person_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          concept?: string
          created_at?: string
          currency?: string
          due_on?: string
          id?: string
          organization_id?: string
          participation_id?: string | null
          person_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "participations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          code: string | null
          created_at: string
          ends_on: string | null
          id: string
          level_id: string
          location_id: string | null
          name: string
          organization_id: string
          program_id: string
          starts_on: string
          status: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          ends_on?: string | null
          id?: string
          level_id: string
          location_id?: string | null
          name: string
          organization_id: string
          program_id: string
          starts_on: string
          status?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          ends_on?: string | null
          id?: string
          level_id?: string
          location_id?: string | null
          name?: string
          organization_id?: string
          program_id?: string
          starts_on?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohorts_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohorts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohorts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohorts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_person_id: string
          body: string
          created_at: string
          id: string
          organization_id: string
          post_id: string
        }
        Insert: {
          author_person_id: string
          body: string
          created_at?: string
          id?: string
          organization_id: string
          post_id: string
        }
        Update: {
          author_person_id?: string
          body?: string
          created_at?: string
          id?: string
          organization_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_person_id_fkey"
            columns: ["author_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_records: {
        Row: {
          channel: string
          granted: boolean
          id: string
          organization_id: string
          person_id: string
          purpose: string
          recorded_at: string
          text_version: string
        }
        Insert: {
          channel: string
          granted: boolean
          id?: string
          organization_id: string
          person_id: string
          purpose: string
          recorded_at?: string
          text_version: string
        }
        Update: {
          channel?: string
          granted?: boolean
          id?: string
          organization_id?: string
          person_id?: string
          purpose?: string
          recorded_at?: string
          text_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_records_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_events: {
        Row: {
          actor: Json
          correlation_id: string | null
          event_name: string
          event_version: number
          id: string
          occurred_at: string
          organization_id: string | null
          properties: Json
          scope: Json
          subject: Json
        }
        Insert: {
          actor?: Json
          correlation_id?: string | null
          event_name: string
          event_version?: number
          id?: string
          occurred_at?: string
          organization_id?: string | null
          properties?: Json
          scope?: Json
          subject?: Json
        }
        Update: {
          actor?: Json
          correlation_id?: string | null
          event_name?: string
          event_version?: number
          id?: string
          occurred_at?: string
          organization_id?: string | null
          properties?: Json
          scope?: Json
          subject?: Json
        }
        Relationships: [
          {
            foreignKeyName: "domain_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cohort_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          id: string
          location_text: string | null
          modality: string
          organization_id: string
          starts_at: string
          timezone: string
          title: string
        }
        Insert: {
          cohort_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          location_text?: string | null
          modality?: string
          organization_id: string
          starts_at: string
          timezone?: string
          title: string
        }
        Update: {
          cohort_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          location_text?: string | null
          modality?: string
          organization_id?: string
          starts_at?: string
          timezone?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interventions: {
        Row: {
          case_id: string
          channel: string | null
          created_at: string
          draft_message: string | null
          id: string
          kind: string
          notes: string | null
          organization_id: string
          performed_at: string
          performed_by: string | null
        }
        Insert: {
          case_id: string
          channel?: string | null
          created_at?: string
          draft_message?: string | null
          id?: string
          kind: string
          notes?: string | null
          organization_id: string
          performed_at?: string
          performed_by?: string | null
        }
        Update: {
          case_id?: string
          channel?: string | null
          created_at?: string
          draft_message?: string | null
          id?: string
          kind?: string
          notes?: string | null
          organization_id?: string
          performed_at?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interventions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          program_id: string
          sequence: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          program_id: string
          sequence: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          program_id?: string
          sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "levels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "levels_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string | null
          created_at: string
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_completions: {
        Row: {
          completed_at: string
          id: string
          mission_id: string
          note: string | null
          organization_id: string
          participation_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          mission_id: string
          note?: string | null
          organization_id: string
          participation_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          mission_id?: string
          note?: string | null
          organization_id?: string
          participation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_completions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_completions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_completions_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "participations"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          cohort_id: string
          created_at: string
          description: string | null
          due_on: string | null
          id: string
          organization_id: string
          sequence: number | null
          title: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          description?: string | null
          due_on?: string | null
          id?: string
          organization_id: string
          sequence?: number | null
          title: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          description?: string | null
          due_on?: string | null
          id?: string
          organization_id?: string
          sequence?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          href: string | null
          id: string
          kind: string
          organization_id: string
          person_id: string
          read: boolean
          text: string
        }
        Insert: {
          created_at?: string
          href?: string | null
          id?: string
          kind: string
          organization_id: string
          person_id: string
          read?: boolean
          text: string
        }
        Update: {
          created_at?: string
          href?: string | null
          id?: string
          kind?: string
          organization_id?: string
          person_id?: string
          read?: boolean
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_memberships: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          person_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          person_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          person_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_memberships_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          brand: Json
          created_at: string
          id: string
          is_demo: boolean
          name: string
          slug: string
          timezone: string
        }
        Insert: {
          brand?: Json
          created_at?: string
          id?: string
          is_demo?: boolean
          name: string
          slug: string
          timezone?: string
        }
        Update: {
          brand?: Json
          created_at?: string
          id?: string
          is_demo?: boolean
          name?: string
          slug?: string
          timezone?: string
        }
        Relationships: []
      }
      outcomes: {
        Row: {
          case_id: string
          id: string
          intervention_id: string | null
          notes: string | null
          organization_id: string
          recorded_at: string
          recorded_by: string | null
          result: string
        }
        Insert: {
          case_id: string
          id?: string
          intervention_id?: string | null
          notes?: string | null
          organization_id: string
          recorded_at?: string
          recorded_by?: string | null
          result: string
        }
        Update: {
          case_id?: string
          id?: string
          intervention_id?: string | null
          notes?: string | null
          organization_id?: string
          recorded_at?: string
          recorded_by?: string | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcomes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outcomes_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outcomes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outcomes_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      participation_state_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_state: string | null
          id: string
          organization_id: string
          participation_id: string
          reason: string | null
          to_state: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_state?: string | null
          id?: string
          organization_id: string
          participation_id: string
          reason?: string | null
          to_state: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_state?: string | null
          id?: string
          organization_id?: string
          participation_id?: string
          reason?: string | null
          to_state?: string
        }
        Relationships: [
          {
            foreignKeyName: "participation_state_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participation_state_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participation_state_history_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "participations"
            referencedColumns: ["id"]
          },
        ]
      }
      participations: {
        Row: {
          cohort_id: string
          created_at: string
          id: string
          organization_id: string
          person_id: string
          registered_at: string | null
          source: string | null
          state: string
          updated_at: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          id?: string
          organization_id: string
          person_id: string
          registered_at?: string | null
          source?: string | null
          state?: string
          updated_at?: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          person_id?: string
          registered_at?: string | null
          source?: string | null
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participations_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          charge_id: string
          created_at: string
          currency: string
          id: string
          method: string
          organization_id: string
          paid_at: string
          reconciled: boolean
          reconciled_at: string | null
          reconciled_by: string | null
          reference: string | null
        }
        Insert: {
          amount_cents: number
          charge_id: string
          created_at?: string
          currency?: string
          id?: string
          method: string
          organization_id: string
          paid_at?: string
          reconciled?: boolean
          reconciled_at?: string | null
          reconciled_by?: string | null
          reference?: string | null
        }
        Update: {
          amount_cents?: number
          charge_id?: string
          created_at?: string
          currency?: string
          id?: string
          method?: string
          organization_id?: string
          paid_at?: string
          reconciled?: boolean
          reconciled_at?: string | null
          reconciled_by?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_reconciled_by_fkey"
            columns: ["reconciled_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          created_at: string
          declaration: string | null
          email: string | null
          full_name: string
          id: string
          looking_for: string[]
          phone: string | null
          preferred_name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          declaration?: string | null
          email?: string | null
          full_name: string
          id?: string
          looking_for?: string[]
          phone?: string | null
          preferred_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          declaration?: string | null
          email?: string | null
          full_name?: string
          id?: string
          looking_for?: string[]
          phone?: string | null
          preferred_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          kind: string
          organization_id: string
          person_id: string
          post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          organization_id: string
          person_id: string
          post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          organization_id?: string
          person_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_person_id: string
          body: string
          cohort_id: string | null
          created_at: string
          fields: Json
          id: string
          kind: string
          organization_id: string
          visibility_scope: string
        }
        Insert: {
          author_person_id: string
          body: string
          cohort_id?: string | null
          created_at?: string
          fields?: Json
          id?: string
          kind?: string
          organization_id: string
          visibility_scope?: string
        }
        Update: {
          author_person_id?: string
          body?: string
          cohort_id?: string | null
          created_at?: string
          fields?: Json
          id?: string
          kind?: string
          organization_id?: string
          visibility_scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_person_id_fkey"
            columns: ["author_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      recognitions: {
        Row: {
          created_at: string
          from_person_id: string
          id: string
          impact: string | null
          organization_id: string
          text: string
          to_person_id: string
        }
        Insert: {
          created_at?: string
          from_person_id: string
          id?: string
          impact?: string | null
          organization_id: string
          text: string
          to_person_id: string
        }
        Update: {
          created_at?: string
          from_person_id?: string
          id?: string
          impact?: string | null
          organization_id?: string
          text?: string
          to_person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recognitions_from_person_id_fkey"
            columns: ["from_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recognitions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recognitions_to_person_id_fkey"
            columns: ["to_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      role_assignments: {
        Row: {
          cohort_id: string | null
          created_at: string
          ends_at: string | null
          id: string
          membership_id: string
          organization_id: string
          role: string
          starts_at: string
        }
        Insert: {
          cohort_id?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          membership_id: string
          organization_id: string
          role: string
          starts_at?: string
        }
        Update: {
          cohort_id?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          membership_id?: string
          organization_id?: string
          role?: string
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_assignments_cohort_fk"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "organization_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          event_id: string
          id: string
          organization_id: string
          person_id: string
          responded_at: string
          status: string
        }
        Insert: {
          event_id: string
          id?: string
          organization_id: string
          person_id: string
          responded_at?: string
          status: string
        }
        Update: {
          event_id?: string
          id?: string
          organization_id?: string
          person_id?: string
          responded_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          cohort_id: string
          created_at: string
          ends_at: string | null
          id: string
          name: string
          organization_id: string
          sequence: number | null
          starts_at: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          ends_at?: string | null
          id?: string
          name: string
          organization_id: string
          sequence?: number | null
          starts_at: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          name?: string
          organization_id?: string
          sequence?: number | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      signal_definitions: {
        Row: {
          active: boolean
          assigned_role: string
          created_at: string
          description: string
          id: string
          key: string
          name: string
          rule: string
          severity: string
          version: number
        }
        Insert: {
          active?: boolean
          assigned_role?: string
          created_at?: string
          description: string
          id?: string
          key: string
          name: string
          rule: string
          severity?: string
          version?: number
        }
        Update: {
          active?: boolean
          assigned_role?: string
          created_at?: string
          description?: string
          id?: string
          key?: string
          name?: string
          rule?: string
          severity?: string
          version?: number
        }
        Relationships: []
      }
      signals: {
        Row: {
          case_id: string | null
          cohort_id: string | null
          dedupe_key: string
          definition_id: string
          detected_at: string
          evidence: Json
          explanation: string
          id: string
          organization_id: string
          participation_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          subject_person_id: string | null
        }
        Insert: {
          case_id?: string | null
          cohort_id?: string | null
          dedupe_key: string
          definition_id: string
          detected_at?: string
          evidence?: Json
          explanation: string
          id?: string
          organization_id: string
          participation_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subject_person_id?: string | null
        }
        Update: {
          case_id?: string | null
          cohort_id?: string | null
          dedupe_key?: string
          definition_id?: string
          detected_at?: string
          evidence?: Json
          explanation?: string
          id?: string
          organization_id?: string
          participation_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subject_person_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signals_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "signal_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "participations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_subject_person_id_fkey"
            columns: ["subject_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      small_group_members: {
        Row: {
          id: string
          organization_id: string
          participation_id: string
          small_group_id: string
        }
        Insert: {
          id?: string
          organization_id: string
          participation_id: string
          small_group_id: string
        }
        Update: {
          id?: string
          organization_id?: string
          participation_id?: string
          small_group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "small_group_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "small_group_members_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "participations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "small_group_members_small_group_id_fkey"
            columns: ["small_group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      small_groups: {
        Row: {
          cohort_id: string
          created_at: string
          id: string
          name: string
          organization_id: string
          staff_person_id: string | null
        }
        Insert: {
          cohort_id: string
          created_at?: string
          id?: string
          name: string
          organization_id: string
          staff_person_id?: string | null
        }
        Update: {
          cohort_id?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          staff_person_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "small_groups_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "small_groups_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "small_groups_staff_person_id_fkey"
            columns: ["staff_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      team_assignments: {
        Row: {
          cohort_id: string
          created_at: string
          ends_at: string | null
          id: string
          organization_id: string
          person_id: string
          role: string
          starts_at: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          ends_at?: string | null
          id?: string
          organization_id: string
          person_id: string
          role: string
          starts_at?: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          organization_id?: string
          person_id?: string
          role?: string
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_assignments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_assignments_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      active_org_ids: { Args: never; Returns: string[] }
      can_view_post: { Args: { p_post: string }; Returns: boolean }
      current_person_id: { Args: never; Returns: string }
      has_role: { Args: { org: string; roles: string[] }; Returns: boolean }
      is_cohort_member: { Args: { cohort: string }; Returns: boolean }
      is_team: { Args: { org: string }; Returns: boolean }
      is_team_for_my_cohort: { Args: { p_person: string }; Returns: boolean }
      shares_cohort_with: { Args: { p_person: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
