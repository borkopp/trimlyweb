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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          barber_id: number
          barbershop_id: number
          cancellation_reason: string | null
          date: string
          duration: number | null
          end_time: string | null
          id: number
          is_archived: boolean | null
          is_cancelled: boolean
          is_cancelled_by_barber: boolean
          name: string | null
          service_ids: number[]
          time: string
          user_id: string
        }
        Insert: {
          barber_id: number
          barbershop_id?: number
          cancellation_reason?: string | null
          date: string
          duration?: number | null
          end_time?: string | null
          id?: number
          is_archived?: boolean | null
          is_cancelled?: boolean
          is_cancelled_by_barber?: boolean
          name?: string | null
          service_ids: number[]
          time: string
          user_id: string
        }
        Update: {
          barber_id?: number
          barbershop_id?: number
          cancellation_reason?: string | null
          date?: string
          duration?: number | null
          end_time?: string | null
          id?: number
          is_archived?: boolean | null
          is_cancelled?: boolean
          is_cancelled_by_barber?: boolean
          name?: string | null
          service_ids?: number[]
          time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_availability"
            referencedColumns: ["barber_id"]
          },
          {
            foreignKeyName: "appointments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_services: {
        Row: {
          barber_id: number | null
          id: number
          service_id: number | null
        }
        Insert: {
          barber_id?: number | null
          id?: number
          service_id?: number | null
        }
        Update: {
          barber_id?: number | null
          id?: number
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "barber_services_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_availability"
            referencedColumns: ["barber_id"]
          },
          {
            foreignKeyName: "barber_services_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_barber_services_barber"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_availability"
            referencedColumns: ["barber_id"]
          },
          {
            foreignKeyName: "fk_barber_services_barber"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_unavailability: {
        Row: {
          barber_id: number
          created_at: string
          date: string
          end_date: string | null
          end_time: string
          id: number
          reason: string | null
          start_time: string
        }
        Insert: {
          barber_id: number
          created_at?: string
          date: string
          end_date?: string | null
          end_time: string
          id?: number
          reason?: string | null
          start_time: string
        }
        Update: {
          barber_id?: number
          created_at?: string
          date?: string
          end_date?: string | null
          end_time?: string
          id?: number
          reason?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_unavailability_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barber_availability"
            referencedColumns: ["barber_id"]
          },
          {
            foreignKeyName: "barber_unavailability_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      barbers: {
        Row: {
          barbershop_id: number
          description: string | null
          email: string | null
          id: number
          image: string | null
          name: string
          phone: string | null
          user_id: string | null
        }
        Insert: {
          barbershop_id?: number
          description?: string | null
          email?: string | null
          id?: number
          image?: string | null
          name: string
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          barbershop_id?: number
          description?: string | null
          email?: string | null
          id?: number
          image?: string | null
          name?: string
          phone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_barber_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      barbershops: {
        Row: {
          closing_time: string | null
          facebook: string | null
          id: number
          instagram: string | null
          last_minute_booking_buffer: number
          location: string | null
          max_advance_booking_days: number
          name: string | null
          opening_time: string | null
          phone: string | null
          service_duration: number
          slot_interval: number
          subdomain: string
          whatsapp: string | null
        }
        Insert: {
          closing_time?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          last_minute_booking_buffer?: number
          location?: string | null
          max_advance_booking_days?: number
          name?: string | null
          opening_time?: string | null
          phone?: string | null
          service_duration?: number
          slot_interval?: number
          subdomain?: string
          whatsapp?: string | null
        }
        Update: {
          closing_time?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          last_minute_booking_buffer?: number
          location?: string | null
          max_advance_booking_days?: number
          name?: string | null
          opening_time?: string | null
          phone?: string | null
          service_duration?: number
          slot_interval?: number
          subdomain?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          barbershop_id: number
          created_at: string
          id: number
          path: string
          service_id: number | null
          type: Database["public"]["Enums"]["image_type"] | null
        }
        Insert: {
          barbershop_id: number
          created_at?: string
          id?: number
          path: string
          service_id?: number | null
          type?: Database["public"]["Enums"]["image_type"] | null
        }
        Update: {
          barbershop_id?: number
          created_at?: string
          id?: number
          path?: string
          service_id?: number | null
          type?: Database["public"]["Enums"]["image_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "images_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          appointment_cancellation: boolean | null
          created_at: string | null
          id: string
          reminder_intervals: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_cancellation?: boolean | null
          created_at?: string | null
          id?: string
          reminder_intervals?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_cancellation?: boolean | null
          created_at?: string | null
          id?: string
          reminder_intervals?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          barbershop_id: number
          email: string | null
          expo_push_token: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          barbershop_id?: number
          email?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          barbershop_id?: number
          email?: string | null
          expo_push_token?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      service_appointments: {
        Row: {
          appointment_id: number | null
          id: number
          service_id: number | null
        }
        Insert: {
          appointment_id?: number | null
          id?: number
          service_id?: number | null
        }
        Update: {
          appointment_id?: number | null
          id?: number
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_appointments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          barbershop_id: number
          description: string | null
          id: number
          image: string | null
          name: string
          price: number
          time: number
        }
        Insert: {
          barbershop_id?: number
          description?: string | null
          id?: number
          image?: string | null
          name: string
          price: number
          time: number
        }
        Update: {
          barbershop_id?: number
          description?: string | null
          id?: number
          image?: string | null
          name?: string
          price?: number
          time?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          id: string
          price_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end: string
          id?: string
          price_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          id?: string
          price_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          trial_end?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      barber_availability: {
        Row: {
          barber_id: number | null
          barbershop_id: number | null
          date: string | null
          is_available: boolean | null
          slot_time: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_barber_role: {
        Args: {
          p_barbershop_id?: number
          service_ids?: number[]
          user_id: string
        }
        Returns: undefined
      }
      available_time_slots: {
        Args: { p_barber_id: number; p_date: string; p_duration?: number }
        Returns: {
          is_available: boolean
          time_slot: string
        }[]
      }
      book_appointment_v2: {
        Args: {
          p_barber_id: number
          p_check_only?: boolean
          p_client_name?: string
          p_date: string
          p_service_ids: number[]
          p_time: string
          p_user_id: string
        }
        Returns: Json
      }
      book_appointment_v2_text: {
        Args: {
          p_barber_id: number
          p_check_only?: boolean
          p_client_name?: string
          p_date: string
          p_service_ids: number[]
          p_time: string
          p_user_id: string
        }
        Returns: Json
      }
      bytea_to_text: { Args: { data: string }; Returns: string }
      check_reschedule_availability: {
        Args: {
          p_appointment_id: number
          p_barber_id: number
          p_date: string
          p_service_ids: number[]
          p_time: string
        }
        Returns: Json
      }
      check_time_slot_availability: {
        Args: {
          p_barber_id: number
          p_date: string
          p_service_ids: number[]
          p_time: string
        }
        Returns: boolean
      }
      cleanup_old_notifications: { Args: never; Returns: undefined }
      create_tenant_policy: {
        Args: {
          command: string
          definition: string
          policy_name: string
          table_name: string
        }
        Returns: undefined
      }
      delete_user_account: { Args: never; Returns: undefined }
      get_barber_available_dates: {
        Args: { p_barber_id: number; p_days_ahead?: number }
        Returns: {
          date_value: string
          has_availability: boolean
        }[]
      }
      get_barber_available_slots: {
        Args: { p_barber_id: number; p_date: string; p_service_ids?: number[] }
        Returns: {
          end_time: string
          is_available: boolean
          time_slot: string
        }[]
      }
      get_current_tenant: { Args: never; Returns: number }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "http_request"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
        SetofOptions: {
          from: "*"
          to: "http_header"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      process_appointment_reminders: { Args: never; Returns: undefined }
      remove_barber_role: { Args: { p_user_id: string }; Returns: undefined }
      set_tenant_context: { Args: { tenant_id: number }; Returns: undefined }
      text_to_bytea: { Args: { data: string }; Returns: string }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
    }
    Enums: {
      image_type: "gallery" | "profile" | "service"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
    Enums: {
      image_type: ["gallery", "profile", "service"],
    },
  },
} as const