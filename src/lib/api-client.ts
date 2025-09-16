// Cliente HTTP para comunicação com backend Express

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Recupera token do localStorage se existir
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Adiciona token de autenticação se disponível
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Se a resposta estiver vazia, retorna null
      const text = await response.text();
      if (!text) return null as T;
      
      return JSON.parse(text);
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Métodos para gerenciar autenticação
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
}

// Instância singleton do cliente
export const apiClient = new ApiClient(API_BASE_URL);

// Funções de conveniência para diferentes recursos
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, fullName?: string) =>
    apiClient.post('/auth/register', { email, password, full_name: fullName }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  me: () =>
    apiClient.get('/auth/me'),
  
  refreshToken: () =>
    apiClient.post('/auth/refresh'),
};

export const profilesApi = {
  getProfile: (userId: string) =>
    apiClient.get(`/profiles/${userId}`),
  
  updateProfile: (userId: string, data: any) =>
    apiClient.patch(`/profiles/${userId}`, data),
  
  createProfile: (data: any) =>
    apiClient.post('/profiles', data),
};

export const coursesApi = {
  getCourses: () =>
    apiClient.get('/courses'),
  
  getCourse: (id: string) =>
    apiClient.get(`/courses/${id}`),
  
  createCourse: (data: any) =>
    apiClient.post('/courses', data),
  
  updateCourse: (id: string, data: any) =>
    apiClient.patch(`/courses/${id}`, data),
  
  deleteCourse: (id: string) =>
    apiClient.delete(`/courses/${id}`),
};

export const servicesApi = {
  getServices: () =>
    apiClient.get('/services'),
  
  getService: (id: string) =>
    apiClient.get(`/services/${id}`),
  
  createService: (data: any) =>
    apiClient.post('/services', data),
  
  updateService: (id: string, data: any) =>
    apiClient.patch(`/services/${id}`, data),
  
  deleteService: (id: string) =>
    apiClient.delete(`/services/${id}`),
};

export const appointmentsApi = {
  getAppointments: () =>
    apiClient.get('/appointments'),
  
  getAppointment: (id: string) =>
    apiClient.get(`/appointments/${id}`),
  
  createAppointment: (data: any) =>
    apiClient.post('/appointments', data),
  
  updateAppointment: (id: string, data: any) =>
    apiClient.patch(`/appointments/${id}`, data),
  
  deleteAppointment: (id: string) =>
    apiClient.delete(`/appointments/${id}`),
};

export const ordersApi = {
  getOrders: () =>
    apiClient.get('/orders'),
  
  getOrder: (id: string) =>
    apiClient.get(`/orders/${id}`),
  
  createOrder: (data: any) =>
    apiClient.post('/orders', data),
  
  updateOrder: (id: string, data: any) =>
    apiClient.patch(`/orders/${id}`, data),
  
  deleteOrder: (id: string) =>
    apiClient.delete(`/orders/${id}`),
};

export default apiClient;
