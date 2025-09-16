// Tipos customizados para substituir os tipos do Supabase

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string; // 'video', 'ebook', 'audiobook'
  content_url: string | null;
  duration: string | null; // e.g., "2h 30min" or "120 pages"
  instructor: string | null;
  level: string | null; // 'Básico', 'Intermediário', 'Avançado'
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number; // duration in minutes
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  service_id: string;
  appointment_date: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  payment_method: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  course_id: string;
  price: number;
  created_at: string;
}

// Tipos para operações CRUD
export type CreateProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProfile = Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export type CreateCourse = Omit<Course, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCourse = Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>;

export type CreateService = Omit<Service, 'id' | 'created_at' | 'updated_at'>;
export type UpdateService = Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>;

export type CreateAppointment = Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAppointment = Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>;

export type CreateOrder = Omit<Order, 'id' | 'created_at' | 'updated_at'>;
export type UpdateOrder = Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;

export type CreateOrderItem = Omit<OrderItem, 'id' | 'created_at'>;
export type UpdateOrderItem = Partial<Omit<OrderItem, 'id' | 'created_at'>>;

// Tipos para autenticação
export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expires_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}
