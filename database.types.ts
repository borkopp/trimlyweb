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
          date: string
          end_time: string | null
          id: number
          is_archived: boolean | null
          service_ids: number[]
          temporary_user_id: number | null
          time: string
          user_id: string
        }
        Insert: {
          barber_id: number
          date: string
          end_time?: string | null
          id?: number
          is_archived?: boolean | null
          service_ids: number[]
          temporary_user_id?: number | null
          time: string
          user_id: string
        }
        Update: {
          barber_id?: number
          date?: string
          end_time?: string | null
          id?: number
          is_archived?: boolean | null
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
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      barbers: {
        Row: {
          description: string | null
          email: string | null
          id: number
          image: string | null
          name: string
          user_id: string | null
        }
        Insert: {
          description?: string | null
          email?: string | null
          id?: number
          image?: string | null
          name: string
          user_id?: string | null
        }
        Update: {
          description?: string | null
          email?: string | null
          id?: number
          image?: string | null
          name?: string
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
          avg_price: number
          closing_time: string
          description: string | null
          id: number
          image: string | null
          location: string
          name: string
          opening_time: string | null
          rating: number
        }
        Insert: {
          avg_price: number
          closing_time: string
          description?: string | null
          id?: number
          image?: string | null
          location: string
          name: string
          opening_time?: string | null
          rating: number
        }
        Update: {
          avg_price?: number
          closing_time?: string
          description?: string | null
          id?: number
          image?: string | null
          location?: string
          name?: string
          opening_time?: string | null
          rating?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          id: number
          image: string | null
          name: string
          price: number
          time: number | null
        }
        Insert: {
          id?: number
          image?: string | null
          name: string
          price: number
          time?: number | null
        }
        Update: {
          id?: number
          image?: string | null
          name?: string
          price?: number
          time?: number | null
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
      [_ in never]: never
    }
    Functions: {
      assign_barber_role:
        | {
            Args: {
              user_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              user_id: string
              service_ids: number[]
            }
            Returns: undefined
          }
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      remove_barber_role: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
