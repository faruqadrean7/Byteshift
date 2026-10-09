export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          created_at: string;
          description: string;
          icon: string | null;
          id: string;
          is_active: boolean;
          order_index: number;
          slug: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          order_index?: number;
          slug: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          icon?: string | null;
          id?: string;
          is_active?: boolean;
          order_index?: number;
          slug?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolio: {
        Row: {
          category: string;
          client_name: string | null;
          cover_image: string | null;
          created_at: string;
          demo_url: string | null;
          full_content: Json | null;
          gallery: string[];
          id: string;
          is_featured: boolean;
          is_published: boolean;
          metrics: Json | null;
          order_index: number;
          project_url: string | null;
          short_desc: string | null;
          slug: string;
          tech_stack: string[];
          title: string;
          updated_at: string;
          year: number | null;
        };
        Insert: {
          category: string;
          client_name?: string | null;
          cover_image?: string | null;
          created_at?: string;
          demo_url?: string | null;
          full_content?: Json | null;
          gallery?: string[];
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          metrics?: Json | null;
          order_index?: number;
          project_url?: string | null;
          short_desc?: string | null;
          slug: string;
          tech_stack?: string[];
          title: string;
          updated_at?: string;
          year?: number | null;
        };
        Update: {
          category?: string;
          client_name?: string | null;
          cover_image?: string | null;
          created_at?: string;
          demo_url?: string | null;
          full_content?: Json | null;
          gallery?: string[];
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          metrics?: Json | null;
          order_index?: number;
          project_url?: string | null;
          short_desc?: string | null;
          slug?: string;
          tech_stack?: string[];
          title?: string;
          updated_at?: string;
          year?: number | null;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          avatar_url: string | null;
          company: string | null;
          content: string;
          created_at: string;
          id: string;
          is_published: boolean;
          name: string;
          order_index: number;
          project_id: string | null;
          rating: number;
          role: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          company?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          name: string;
          order_index?: number;
          project_id?: string | null;
          rating?: number;
          role?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          company?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          name?: string;
          order_index?: number;
          project_id?: string | null;
          rating?: number;
          role?: string | null;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          category: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          order_index: number;
          question: string;
        };
        Insert: {
          answer: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          order_index?: number;
          question: string;
        };
        Update: {
          answer?: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          order_index?: number;
          question?: string;
        };
        Relationships: [];
      };
      packages: {
        Row: {
          created_at: string;
          cta_label: string | null;
          cta_message: string | null;
          features: string[];
          id: string;
          is_active: boolean;
          is_featured: boolean;
          name: string;
          order_index: number;
          period_label: string | null;
          price_label: string;
        };
        Insert: {
          created_at?: string;
          cta_label?: string | null;
          cta_message?: string | null;
          features?: string[];
          id?: string;
          is_active?: boolean;
          is_featured?: boolean;
          name: string;
          order_index?: number;
          period_label?: string | null;
          price_label: string;
        };
        Update: {
          created_at?: string;
          cta_label?: string | null;
          cta_message?: string | null;
          features?: string[];
          id?: string;
          is_active?: boolean;
          is_featured?: boolean;
          name?: string;
          order_index?: number;
          period_label?: string | null;
          price_label?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          bio: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          order_index: number;
          photo_url: string | null;
          role: string;
          social_links: Json;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          order_index?: number;
          photo_url?: string | null;
          role: string;
          social_links?: Json;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          order_index?: number;
          photo_url?: string | null;
          role?: string;
          social_links?: Json;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          author_id: string | null;
          content: Json | null;
          cover_image: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          is_published: boolean;
          meta_description: string | null;
          meta_title: string | null;
          published_at: string | null;
          slug: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id?: string | null;
          content?: Json | null;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          slug: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string | null;
          content?: Json | null;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          slug?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          budget_range: string | null;
          created_at: string;
          email: string | null;
          id: string;
          message: string | null;
          name: string;
          notes: string | null;
          phone_wa: string | null;
          project_type: string | null;
          source: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          budget_range?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name: string;
          notes?: string | null;
          phone_wa?: string | null;
          project_type?: string | null;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          budget_range?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string | null;
          name?: string;
          notes?: string | null;
          phone_wa?: string | null;
          project_type?: string | null;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          address: string | null;
          created_at: string;
          email: string | null;
          hero_stats: Json;
          id: number;
          logo_url: string | null;
          meta_default: Json;
          site_name: string;
          social_links: Json;
          tagline: string | null;
          updated_at: string;
          whatsapp_number: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          hero_stats?: Json;
          id?: number;
          logo_url?: string | null;
          meta_default?: Json;
          site_name?: string;
          social_links?: Json;
          tagline?: string | null;
          updated_at?: string;
          whatsapp_number?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          hero_stats?: Json;
          id?: number;
          logo_url?: string | null;
          meta_default?: Json;
          site_name?: string;
          social_links?: Json;
          tagline?: string | null;
          updated_at?: string;
          whatsapp_number?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Service = Tables<"services">;
export type Portfolio = Tables<"portfolio">;
export type Testimonial = Tables<"testimonials">;
export type Faq = Tables<"faqs">;
export type Package = Tables<"packages">;
export type TeamMember = Tables<"team_members">;
export type BlogPost = Tables<"blog_posts">;
export type Lead = Tables<"leads">;
export type SiteSettings = Tables<"site_settings">;
