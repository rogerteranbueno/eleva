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
          audience: string
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
          audience?: string
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
          audience?: string
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
      attendance_expectations: {
        Row: {
          event_occurrence_id: string
          expected: boolean
          id: string
          organization_id: string
          reason: string | null
          stage_participation_id: string
        }
        Insert: {
          event_occurrence_id: string
          expected?: boolean
          id?: string
          organization_id: string
          reason?: string | null
          stage_participation_id: string
        }
        Update: {
          event_occurrence_id?: string
          expected?: boolean
          id?: string
          organization_id?: string
          reason?: string | null
          stage_participation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_expectations_event_occurrence_id_fkey"
            columns: ["event_occurrence_id"]
            isOneToOne: false
            referencedRelation: "event_occurrences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_expectations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_expectations_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          corrected: boolean
          created_at: string
          event_occurrence_id: string
          id: string
          organization_id: string
          recorded_by: string | null
          stage_participation_id: string
          status: string
          updated_at: string
        }
        Insert: {
          corrected?: boolean
          created_at?: string
          event_occurrence_id: string
          id?: string
          organization_id: string
          recorded_by?: string | null
          stage_participation_id: string
          status: string
          updated_at?: string
        }
        Update: {
          corrected?: boolean
          created_at?: string
          event_occurrence_id?: string
          id?: string
          organization_id?: string
          recorded_by?: string | null
          stage_participation_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_event_occurrence_id_fkey"
            columns: ["event_occurrence_id"]
            isOneToOne: false
            referencedRelation: "event_occurrences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
            foreignKeyName: "attendance_records_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
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
      blocks: {
        Row: {
          blocked_person_id: string
          blocker_person_id: string
          created_at: string
          id: string
          organization_id: string
        }
        Insert: {
          blocked_person_id: string
          blocker_person_id: string
          created_at?: string
          id?: string
          organization_id: string
        }
        Update: {
          blocked_person_id?: string
          blocker_person_id?: string
          created_at?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocked_person_id_fkey"
            columns: ["blocked_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_blocker_person_id_fkey"
            columns: ["blocker_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_organization_id_fkey"
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
          created_at: string
          cycle_id: string | null
          due_at: string | null
          id: string
          kind: string
          opened_at: string
          organization_id: string
          priority: string
          stage_run_id: string | null
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
          created_at?: string
          cycle_id?: string | null
          due_at?: string | null
          id?: string
          kind?: string
          opened_at?: string
          organization_id: string
          priority?: string
          stage_run_id?: string | null
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
          created_at?: string
          cycle_id?: string | null
          due_at?: string | null
          id?: string
          kind?: string
          opened_at?: string
          organization_id?: string
          priority?: string
          stage_run_id?: string | null
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
            foreignKeyName: "cases_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "generation_cycles"
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
            foreignKeyName: "cases_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
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
          person_id: string
          plan_id: string | null
          stage_participation_id: string | null
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
          person_id: string
          plan_id?: string | null
          stage_participation_id?: string | null
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
          person_id?: string
          plan_id?: string | null
          stage_participation_id?: string | null
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
            foreignKeyName: "charges_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
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
      connection_requests: {
        Row: {
          created_at: string
          from_person_id: string
          id: string
          message: string | null
          organization_id: string
          resolved_at: string | null
          status: string
          to_person_id: string
        }
        Insert: {
          created_at?: string
          from_person_id: string
          id?: string
          message?: string | null
          organization_id: string
          resolved_at?: string | null
          status?: string
          to_person_id: string
        }
        Update: {
          created_at?: string
          from_person_id?: string
          id?: string
          message?: string | null
          organization_id?: string
          resolved_at?: string | null
          status?: string
          to_person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_requests_from_person_id_fkey"
            columns: ["from_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_to_person_id_fkey"
            columns: ["to_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          person_a: string
          person_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          person_a: string
          person_b: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          person_a?: string
          person_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_person_a_fkey"
            columns: ["person_a"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_person_b_fkey"
            columns: ["person_b"]
            isOneToOne: false
            referencedRelation: "people"
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
      continuity_passes: {
        Row: {
          conversed_at: string | null
          created_at: string
          decided_at: string | null
          enrolled_at: string | null
          evaluated_at: string | null
          from_participation_id: string
          id: string
          next_status: string
          notes: string | null
          offered_at: string | null
          organization_id: string
          pass_status: string
          recorded_by: string | null
          started_at: string | null
          to_stage_run_id: string | null
        }
        Insert: {
          conversed_at?: string | null
          created_at?: string
          decided_at?: string | null
          enrolled_at?: string | null
          evaluated_at?: string | null
          from_participation_id: string
          id?: string
          next_status?: string
          notes?: string | null
          offered_at?: string | null
          organization_id: string
          pass_status?: string
          recorded_by?: string | null
          started_at?: string | null
          to_stage_run_id?: string | null
        }
        Update: {
          conversed_at?: string | null
          created_at?: string
          decided_at?: string | null
          enrolled_at?: string | null
          evaluated_at?: string | null
          from_participation_id?: string
          id?: string
          next_status?: string
          notes?: string | null
          offered_at?: string | null
          organization_id?: string
          pass_status?: string
          recorded_by?: string | null
          started_at?: string | null
          to_stage_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "continuity_passes_from_participation_id_fkey"
            columns: ["from_participation_id"]
            isOneToOne: true
            referencedRelation: "stage_participations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "continuity_passes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "continuity_passes_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "continuity_passes_to_stage_run_id_fkey"
            columns: ["to_stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_members: {
        Row: {
          conversation_id: string
          id: string
          last_read_at: string | null
          organization_id: string
          person_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          last_read_at?: string | null
          organization_id: string
          person_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          last_read_at?: string | null
          organization_id?: string
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_members_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          kind: string
          last_message_at: string | null
          organization_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          last_message_at?: string | null
          organization_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          kind?: string
          last_message_at?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          amount_cents: number
          approved_by: string | null
          charge_id: string
          created_at: string
          id: string
          kind: string
          organization_id: string
          reason: string
        }
        Insert: {
          amount_cents: number
          approved_by?: string | null
          charge_id: string
          created_at?: string
          id?: string
          kind: string
          organization_id: string
          reason: string
        }
        Update: {
          amount_cents?: number
          approved_by?: string | null
          charge_id?: string
          created_at?: string
          id?: string
          kind?: string
          organization_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "discounts_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discounts_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
      enrollment_attributions: {
        Row: {
          context_stage_run_id: string | null
          created_at: string
          enrolled_person_id: string
          enroller_person_id: string
          id: string
          organization_id: string
          prospect_id: string | null
          status: string
        }
        Insert: {
          context_stage_run_id?: string | null
          created_at?: string
          enrolled_person_id: string
          enroller_person_id: string
          id?: string
          organization_id: string
          prospect_id?: string | null
          status?: string
        }
        Update: {
          context_stage_run_id?: string | null
          created_at?: string
          enrolled_person_id?: string
          enroller_person_id?: string
          id?: string
          organization_id?: string
          prospect_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_attributions_context_stage_run_id_fkey"
            columns: ["context_stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_attributions_enrolled_person_id_fkey"
            columns: ["enrolled_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_attributions_enroller_person_id_fkey"
            columns: ["enroller_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_attributions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollment_attributions_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      event_occurrences: {
        Row: {
          created_at: string
          created_by: string | null
          cycle_id: string | null
          description: string | null
          ends_at: string | null
          id: string
          kind: string
          location_text: string | null
          modality: string
          name: string
          organization_id: string
          stage_run_id: string | null
          starts_at: string
          timezone: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cycle_id?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          kind: string
          location_text?: string | null
          modality?: string
          name: string
          organization_id: string
          stage_run_id?: string | null
          starts_at: string
          timezone?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cycle_id?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          kind?: string
          location_text?: string | null
          modality?: string
          name?: string
          organization_id?: string
          stage_run_id?: string | null
          starts_at?: string
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_occurrences_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_occurrences_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "generation_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_occurrences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_occurrences_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount_cents: number
          category: string
          concept: string
          created_at: string
          currency: string
          id: string
          incurred_on: string
          organization_id: string
          recorded_by: string | null
          stage_run_id: string | null
        }
        Insert: {
          amount_cents: number
          category: string
          concept: string
          created_at?: string
          currency?: string
          id?: string
          incurred_on: string
          organization_id: string
          recorded_by?: string | null
          stage_run_id?: string | null
        }
        Update: {
          amount_cents?: number
          category?: string
          concept?: string
          created_at?: string
          currency?: string
          id?: string
          incurred_on?: string
          organization_id?: string
          recorded_by?: string | null
          stage_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_interactions: {
        Row: {
          created_at: string
          done_at: string | null
          expected_on: string
          id: string
          notes: string | null
          organization_id: string
          resultado: string | null
          staff_person_id: string
          stage_participation_id: string
        }
        Insert: {
          created_at?: string
          done_at?: string | null
          expected_on: string
          id?: string
          notes?: string | null
          organization_id: string
          resultado?: string | null
          staff_person_id: string
          stage_participation_id: string
        }
        Update: {
          created_at?: string
          done_at?: string | null
          expected_on?: string
          id?: string
          notes?: string | null
          organization_id?: string
          resultado?: string | null
          staff_person_id?: string
          stage_participation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_interactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_interactions_staff_person_id_fkey"
            columns: ["staff_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_interactions_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          followed_person_id: string
          follower_person_id: string
          id: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          followed_person_id: string
          follower_person_id: string
          id?: string
          organization_id: string
        }
        Update: {
          created_at?: string
          followed_person_id?: string
          follower_person_id?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followed_person_id_fkey"
            columns: ["followed_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_follower_person_id_fkey"
            columns: ["follower_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_cycles: {
        Row: {
          created_at: string
          id: string
          name: string
          number: number | null
          organization_id: string
          program_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          number?: number | null
          organization_id: string
          program_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          number?: number | null
          organization_id?: string
          program_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_cycles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_cycles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
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
      message_requests: {
        Row: {
          body: string
          created_at: string
          from_person_id: string
          id: string
          organization_id: string
          resolved_at: string | null
          status: string
          to_person_id: string
        }
        Insert: {
          body: string
          created_at?: string
          from_person_id: string
          id?: string
          organization_id: string
          resolved_at?: string | null
          status?: string
          to_person_id: string
        }
        Update: {
          body?: string
          created_at?: string
          from_person_id?: string
          id?: string
          organization_id?: string
          resolved_at?: string | null
          status?: string
          to_person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_requests_from_person_id_fkey"
            columns: ["from_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_requests_to_person_id_fkey"
            columns: ["to_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          deleted_at: string | null
          id: string
          organization_id: string
          sender_person_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          organization_id: string
          sender_person_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          organization_id?: string
          sender_person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_person_id_fkey"
            columns: ["sender_person_id"]
            isOneToOne: false
            referencedRelation: "people"
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
          stage_participation_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          mission_id: string
          note?: string | null
          organization_id: string
          stage_participation_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          mission_id?: string
          note?: string | null
          organization_id?: string
          stage_participation_id?: string
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
            foreignKeyName: "mission_completions_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          created_at: string
          description: string | null
          due_on: string | null
          id: string
          organization_id: string
          sequence: number | null
          stage_run_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_on?: string | null
          id?: string
          organization_id: string
          sequence?: number | null
          stage_run_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_on?: string | null
          id?: string
          organization_id?: string
          sequence?: number | null
          stage_run_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_actions: {
        Row: {
          action: string
          created_at: string
          id: string
          moderator_person_id: string
          organization_id: string
          rationale: string
          report_id: string | null
          target_id: string
          target_kind: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          moderator_person_id: string
          organization_id: string
          rationale: string
          report_id?: string | null
          target_id: string
          target_kind: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          moderator_person_id?: string
          organization_id?: string
          rationale?: string
          report_id?: string | null
          target_id?: string
          target_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_actions_moderator_person_id_fkey"
            columns: ["moderator_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      mutes: {
        Row: {
          created_at: string
          id: string
          muted_person_id: string | null
          muted_space_id: string | null
          organization_id: string
          person_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          muted_person_id?: string | null
          muted_space_id?: string | null
          organization_id: string
          person_id: string
        }
        Update: {
          created_at?: string
          id?: string
          muted_person_id?: string | null
          muted_space_id?: string | null
          organization_id?: string
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mutes_muted_person_id_fkey"
            columns: ["muted_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mutes_muted_space_id_fkey"
            columns: ["muted_space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mutes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mutes_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
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
      participation_plane_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: string | null
          id: string
          organization_id: string
          participation_id: string
          plane: string
          reason: string | null
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          organization_id: string
          participation_id: string
          plane: string
          reason?: string | null
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          organization_id?: string
          participation_id?: string
          plane?: string
          reason?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "participation_plane_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participation_plane_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participation_plane_history_participation_id_fkey"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_allocations: {
        Row: {
          amount_cents: number
          charge_id: string
          created_at: string
          id: string
          organization_id: string
          payment_id: string
        }
        Insert: {
          amount_cents: number
          charge_id: string
          created_at?: string
          id?: string
          organization_id: string
          payment_id: string
        }
        Update: {
          amount_cents?: number
          charge_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_allocations_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          concept: string
          created_at: string
          currency: string
          id: string
          installments_count: number
          organization_id: string
          person_id: string
          stage_participation_id: string | null
          total_cents: number
        }
        Insert: {
          concept: string
          created_at?: string
          currency?: string
          id?: string
          installments_count?: number
          organization_id: string
          person_id: string
          stage_participation_id?: string | null
          total_cents: number
        }
        Update: {
          concept?: string
          created_at?: string
          currency?: string
          id?: string
          installments_count?: number
          organization_id?: string
          person_id?: string
          stage_participation_id?: string | null
          total_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          confirmed: boolean
          created_at: string
          currency: string
          id: string
          method: string
          organization_id: string
          paid_at: string
          person_id: string | null
          reconciliation_batch_id: string | null
          recorded_by: string | null
          reference: string | null
        }
        Insert: {
          amount_cents: number
          confirmed?: boolean
          created_at?: string
          currency?: string
          id?: string
          method: string
          organization_id: string
          paid_at?: string
          person_id?: string | null
          reconciliation_batch_id?: string | null
          recorded_by?: string | null
          reference?: string | null
        }
        Update: {
          amount_cents?: number
          confirmed?: boolean
          created_at?: string
          currency?: string
          id?: string
          method?: string
          organization_id?: string
          paid_at?: string
          person_id?: string | null
          reconciliation_batch_id?: string | null
          recorded_by?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_batch_fk"
            columns: ["reconciliation_batch_id"]
            isOneToOne: false
            referencedRelation: "reconciliation_batches"
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
            foreignKeyName: "payments_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          accepts_messages: string
          available_to_serve: boolean
          bio: string | null
          city: string | null
          created_at: string
          declaration: string | null
          email: string | null
          full_name: string
          id: string
          interests: string[]
          looking_for: string[]
          offers: string[]
          phone: string | null
          preferred_name: string | null
          skills: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepts_messages?: string
          available_to_serve?: boolean
          bio?: string | null
          city?: string | null
          created_at?: string
          declaration?: string | null
          email?: string | null
          full_name: string
          id?: string
          interests?: string[]
          looking_for?: string[]
          offers?: string[]
          phone?: string | null
          preferred_name?: string | null
          skills?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepts_messages?: string
          available_to_serve?: boolean
          bio?: string | null
          city?: string | null
          created_at?: string
          declaration?: string | null
          email?: string | null
          full_name?: string
          id?: string
          interests?: string[]
          looking_for?: string[]
          offers?: string[]
          phone?: string | null
          preferred_name?: string | null
          skills?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      post_mentions: {
        Row: {
          id: string
          organization_id: string
          person_id: string
          post_id: string
        }
        Insert: {
          id?: string
          organization_id: string
          person_id: string
          post_id: string
        }
        Update: {
          id?: string
          organization_id?: string
          person_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_mentions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_mentions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_mentions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
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
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          fields: Json
          id: string
          kind: string
          organization_id: string
          pinned_at: string | null
          space_id: string
          updated_at: string | null
        }
        Insert: {
          author_person_id: string
          body: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          fields?: Json
          id?: string
          kind?: string
          organization_id: string
          pinned_at?: string | null
          space_id: string
          updated_at?: string | null
        }
        Update: {
          author_person_id?: string
          body?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          fields?: Json
          id?: string
          kind?: string
          organization_id?: string
          pinned_at?: string | null
          space_id?: string
          updated_at?: string | null
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
            foreignKeyName: "posts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_field_visibility: {
        Row: {
          field: string
          id: string
          person_id: string
          visibility: string
        }
        Insert: {
          field: string
          id?: string
          person_id: string
          visibility?: string
        }
        Update: {
          field?: string
          id?: string
          person_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_field_visibility_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
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
      prospects: {
        Row: {
          created_at: string
          crm_status: string
          id: string
          organization_id: string
          person_id: string
          source: string | null
          target_stage_run_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crm_status?: string
          id?: string
          organization_id: string
          person_id: string
          source?: string | null
          target_stage_run_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crm_status?: string
          id?: string
          organization_id?: string
          person_id?: string
          source?: string | null
          target_stage_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospects_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospects_target_stage_run_id_fkey"
            columns: ["target_stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_assignments: {
        Row: {
          author: string | null
          created_at: string
          due_on: string | null
          id: string
          organization_id: string
          stage_run_id: string
          title: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          due_on?: string | null
          id?: string
          organization_id: string
          stage_run_id: string
          title: string
        }
        Update: {
          author?: string | null
          created_at?: string
          due_on?: string | null
          id?: string
          organization_id?: string
          stage_run_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_assignments_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_progress: {
        Row: {
          assignment_id: string
          completed_at: string
          id: string
          organization_id: string
          stage_participation_id: string
        }
        Insert: {
          assignment_id: string
          completed_at?: string
          id?: string
          organization_id: string
          stage_participation_id: string
        }
        Update: {
          assignment_id?: string
          completed_at?: string
          id?: string
          organization_id?: string
          stage_participation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "reading_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
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
      reconciliation_batches: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          created_at: string
          id: string
          organization_id: string
          period_end: string
          period_start: string
          status: string
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          id?: string
          organization_id: string
          period_end: string
          period_start: string
          status?: string
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          period_end?: string
          period_start?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reconciliation_batches_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reconciliation_batches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      red_eleva_waitlist: {
        Row: {
          center_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          role: string
        }
        Insert: {
          center_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          role: string
        }
        Update: {
          center_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          role?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount_cents: number
          approved_by: string | null
          created_at: string
          currency: string
          id: string
          organization_id: string
          payment_id: string
          reason: string
        }
        Insert: {
          amount_cents: number
          approved_by?: string | null
          created_at?: string
          currency?: string
          id?: string
          organization_id: string
          payment_id: string
          reason: string
        }
        Update: {
          amount_cents?: number
          approved_by?: string | null
          created_at?: string
          currency?: string
          id?: string
          organization_id?: string
          payment_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          organization_id: string
          reason: string
          reporter_person_id: string
          status: string
          target_id: string
          target_kind: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          organization_id: string
          reason: string
          reporter_person_id: string
          status?: string
          target_id: string
          target_kind: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          organization_id?: string
          reason?: string
          reporter_person_id?: string
          status?: string
          target_id?: string
          target_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_person_id_fkey"
            columns: ["reporter_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      role_assignments: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          membership_id: string
          organization_id: string
          role: string
          starts_at: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          membership_id: string
          organization_id: string
          role: string
          starts_at?: string
        }
        Update: {
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
          event_occurrence_id: string
          id: string
          organization_id: string
          person_id: string
          responded_at: string
          status: string
        }
        Insert: {
          event_occurrence_id: string
          id?: string
          organization_id: string
          person_id: string
          responded_at?: string
          status: string
        }
        Update: {
          event_occurrence_id?: string
          id?: string
          organization_id?: string
          person_id?: string
          responded_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_occurrence_id_fkey"
            columns: ["event_occurrence_id"]
            isOneToOne: false
            referencedRelation: "event_occurrences"
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
      saved_posts: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          person_id: string
          post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          person_id: string
          post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          person_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
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
          dedupe_key: string
          definition_id: string
          detected_at: string
          evidence: Json
          explanation: string
          id: string
          organization_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          stage_participation_id: string | null
          stage_run_id: string | null
          status: string
          subject_person_id: string | null
        }
        Insert: {
          case_id?: string | null
          dedupe_key: string
          definition_id: string
          detected_at?: string
          evidence?: Json
          explanation: string
          id?: string
          organization_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          stage_participation_id?: string | null
          stage_run_id?: string | null
          status?: string
          subject_person_id?: string | null
        }
        Update: {
          case_id?: string | null
          dedupe_key?: string
          definition_id?: string
          detected_at?: string
          evidence?: Json
          explanation?: string
          id?: string
          organization_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          stage_participation_id?: string | null
          stage_run_id?: string | null
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
            foreignKeyName: "signals_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signals_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
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
          small_group_id: string
          stage_participation_id: string
        }
        Insert: {
          id?: string
          organization_id: string
          small_group_id: string
          stage_participation_id: string
        }
        Update: {
          id?: string
          organization_id?: string
          small_group_id?: string
          stage_participation_id?: string
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
            foreignKeyName: "small_group_members_small_group_id_fkey"
            columns: ["small_group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "small_group_members_stage_participation_id_fkey"
            columns: ["stage_participation_id"]
            isOneToOne: false
            referencedRelation: "stage_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      small_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          staff_person_id: string | null
          stage_run_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          staff_person_id?: string | null
          stage_run_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          staff_person_id?: string | null
          stage_run_id?: string
        }
        Relationships: [
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
          {
            foreignKeyName: "small_groups_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      space_memberships: {
        Row: {
          id: string
          joined_at: string
          muted: boolean
          organization_id: string
          person_id: string
          role: string
          space_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          muted?: boolean
          organization_id: string
          person_id: string
          role?: string
          space_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          muted?: boolean
          organization_id?: string
          person_id?: string
          role?: string
          space_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "space_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_memberships_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "space_memberships_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          archived_at: string | null
          created_at: string
          cycle_id: string | null
          host_person_id: string | null
          id: string
          kind: string
          name: string
          organization_id: string
          purpose: string | null
          ritual: string | null
          slug: string
          stage_run_id: string | null
          visibility: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          cycle_id?: string | null
          host_person_id?: string | null
          id?: string
          kind: string
          name: string
          organization_id: string
          purpose?: string | null
          ritual?: string | null
          slug: string
          stage_run_id?: string | null
          visibility?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          cycle_id?: string | null
          host_person_id?: string | null
          id?: string
          kind?: string
          name?: string
          organization_id?: string
          purpose?: string | null
          ritual?: string | null
          slug?: string
          stage_run_id?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaces_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "generation_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spaces_host_person_id_fkey"
            columns: ["host_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spaces_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spaces_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_participations: {
        Row: {
          created_at: string
          delivery_status: string
          id: string
          organization_id: string
          person_id: string
          registered_at: string | null
          registration_status: string
          source: string | null
          stage_run_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_status?: string
          id?: string
          organization_id: string
          person_id: string
          registered_at?: string | null
          registration_status?: string
          source?: string | null
          stage_run_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_status?: string
          id?: string
          organization_id?: string
          person_id?: string
          registered_at?: string | null
          registration_status?: string
          source?: string | null
          stage_run_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_participations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_participations_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_participations_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_runs: {
        Row: {
          capacity: number | null
          created_at: string
          currency: string
          cycle_id: string
          ends_on: string
          id: string
          location_id: string | null
          name: string
          organization_id: string
          price_cents: number | null
          stage: string
          starts_on: string
          status: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          currency?: string
          cycle_id: string
          ends_on: string
          id?: string
          location_id?: string | null
          name: string
          organization_id: string
          price_cents?: number | null
          stage: string
          starts_on: string
          status?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          currency?: string
          cycle_id?: string
          ends_on?: string
          id?: string
          location_id?: string | null
          name?: string
          organization_id?: string
          price_cents?: number | null
          stage?: string
          starts_on?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_runs_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "generation_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_runs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_assignments: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          organization_id: string
          person_id: string
          reports_to_person_id: string | null
          role: string
          stage_run_id: string
          starts_at: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          organization_id: string
          person_id: string
          reports_to_person_id?: string | null
          role: string
          stage_run_id: string
          starts_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          organization_id?: string
          person_id?: string
          reports_to_person_id?: string | null
          role?: string
          stage_run_id?: string
          starts_at?: string
        }
        Relationships: [
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
          {
            foreignKeyName: "team_assignments_reports_to_person_id_fkey"
            columns: ["reports_to_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_assignments_stage_run_id_fkey"
            columns: ["stage_run_id"]
            isOneToOne: false
            referencedRelation: "stage_runs"
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
      are_connected: { Args: { p_other: string }; Returns: boolean }
      can_view_post: { Args: { p_post: string }; Returns: boolean }
      current_person_id: { Args: never; Returns: string }
      has_role: { Args: { org: string; roles: string[] }; Returns: boolean }
      has_stage_role: {
        Args: { roles: string[]; stage: string }
        Returns: boolean
      }
      is_blocked_between: { Args: { p_other: string }; Returns: boolean }
      is_conversation_member: {
        Args: { p_conversation: string }
        Returns: boolean
      }
      is_cycle_member: { Args: { cycle: string }; Returns: boolean }
      is_space_member: { Args: { p_space: string }; Returns: boolean }
      is_staff_of_participation: {
        Args: { p_participation: string }
        Returns: boolean
      }
      is_stage_member: { Args: { stage: string }; Returns: boolean }
      is_team: { Args: { org: string }; Returns: boolean }
      is_team_for_my_cycle: { Args: { p_person: string }; Returns: boolean }
      shares_cycle_with: { Args: { p_person: string }; Returns: boolean }
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
