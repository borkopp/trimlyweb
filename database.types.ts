export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          temporary_user_id: number | null
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
          temporary_user_id?: number | null
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
          temporary_user_id?: number | null
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
            foreignKeyName: "appointments_temporary_user_id_fkey"
            columns: ["temporary_user_id"]
            isOneToOne: false
            referencedRelation: "temporary_users"
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
          id: number
          last_minute_booking_buffer: number
          location: string | null
          max_advance_booking_days: number
          name: string | null
          opening_time: string | null
          phone: string | null
          service_duration: number
          slot_interval: number
          subdomain: string
        }
        Insert: {
          closing_time?: string | null
          id?: number
          last_minute_booking_buffer?: number
          location?: string | null
          max_advance_booking_days?: number
          name?: string | null
          opening_time?: string | null
          phone?: string | null
          service_duration?: number
          slot_interval?: number
          subdomain?: string
        }
        Update: {
          closing_time?: string | null
          id?: number
          last_minute_booking_buffer?: number
          location?: string | null
          max_advance_booking_days?: number
          name?: string | null
          opening_time?: string | null
          phone?: string | null
          service_duration?: number
          slot_interval?: number
          subdomain?: string
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
      temporary_users: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          name: string
          phone_number: string
          verification_code: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: number
          name: string
          phone_number: string
          verification_code: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: number
          name?: string
          phone_number?: string
          verification_code?: string
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
          user_id: string
          service_ids?: number[]
          p_barbershop_id?: number
        }
        Returns: undefined
      }
      available_time_slots: {
        Args: {
          p_barber_id: number
          p_date: string
          p_duration?: number
        }
        Returns: {
          time_slot: string
          is_available: boolean
        }[]
      }
      book_appointment:
        | {
            Args: {
              p_barber_id: number
              p_user_id: string
              p_barbershop_id: number
              p_date: string
              p_time: string
              p_service_ids: number[]
            }
            Returns: number
          }
        | {
            Args: {
              p_user_id: string
              p_barber_id: number
              p_service_ids: number[]
              p_date: string
              p_time: string
              p_is_guest?: boolean
              p_check_only?: boolean
            }
            Returns: Json
          }
      book_appointment_v2:
        | {
            Args: {
              p_barber_id: number
              p_user_id: string
              p_service_ids: number[]
              p_date: string
              p_time: string
              p_is_guest?: boolean
              p_temporary_user_id?: number
              p_check_only?: boolean
            }
            Returns: Json
          }
        | {
            Args: {
              p_barber_id: number
              p_user_id: string
              p_service_ids: number[]
              p_date: string
              p_time: string
              p_name?: string
              p_is_guest?: boolean
              p_temporary_user_id?: number
              p_check_only?: boolean
            }
            Returns: Json
          }
      bytea_to_text: {
        Args: {
          data: string
        }
        Returns: string
      }
      check_time_slot_availability: {
        Args: {
          p_barber_id: number
          p_date: string
          p_time: string
          p_service_ids: number[]
        }
        Returns: boolean
      }
      cleanup_old_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_barber_available_dates: {
        Args: {
          p_barber_id: number
          p_days_ahead?: number
        }
        Returns: {
          date_value: string
          has_availability: boolean
        }[]
      }
      get_barber_available_slots: {
        Args: {
          p_barber_id: number
          p_date: string
          p_service_ids?: number[]
        }
        Returns: {
          time_slot: string
          end_time: string
          is_available: boolean
        }[]
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      process_appointment_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      remove_barber_role: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
      text_to_bytea: {
        Args: {
          data: string
        }
        Returns: string
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
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
        method: unknown | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
