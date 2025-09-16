// API service for making HTTP requests to Supabase Edge Functions
const BASE_URL = 'https://hqhuzvinyhdheczbtseo.supabase.co/functions/v1';

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('supabase_token');
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth API
  async signIn(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/auth?action=signin`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse(response);
    
    // Store the session token
    if (data.session?.access_token) {
      localStorage.setItem('supabase_token', data.session.access_token);
    }
    
    return data;
  }

  async signUp(email: string, password: string, fullName?: string) {
    const response = await fetch(`${BASE_URL}/auth?action=signup`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password, fullName }),
    });

    const data = await this.handleResponse(response);
    
    // Store the session token
    if (data.session?.access_token) {
      localStorage.setItem('supabase_token', data.session.access_token);
    }
    
    return data;
  }

  async signOut() {
    const response = await fetch(`${BASE_URL}/auth?action=signout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    await this.handleResponse(response);
    localStorage.removeItem('supabase_token');
  }

  async getMe() {
    const response = await fetch(`${BASE_URL}/auth?action=me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Courses API
  async getCourses() {
    const response = await fetch(`${BASE_URL}/courses`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async getCourse(id: string) {
    const response = await fetch(`${BASE_URL}/courses?id=${id}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async createCourse(courseData: any) {
    const response = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(courseData),
    });

    return this.handleResponse(response);
  }

  async updateCourse(id: string, courseData: any) {
    const response = await fetch(`${BASE_URL}/courses?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(courseData),
    });

    return this.handleResponse(response);
  }

  async deleteCourse(id: string) {
    const response = await fetch(`${BASE_URL}/courses?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Services API
  async getServices() {
    const response = await fetch(`${BASE_URL}/services`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async getService(id: string) {
    const response = await fetch(`${BASE_URL}/services?id=${id}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async createService(serviceData: any) {
    const response = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(serviceData),
    });

    return this.handleResponse(response);
  }

  async updateService(id: string, serviceData: any) {
    const response = await fetch(`${BASE_URL}/services?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(serviceData),
    });

    return this.handleResponse(response);
  }

  async deleteService(id: string) {
    const response = await fetch(`${BASE_URL}/services?id=${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Appointments API
  async getAppointments() {
    const response = await fetch(`${BASE_URL}/appointments`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAppointment(id: string) {
    const response = await fetch(`${BASE_URL}/appointments?id=${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createAppointment(appointmentData: any) {
    const response = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(appointmentData),
    });

    return this.handleResponse(response);
  }

  async updateAppointment(id: string, appointmentData: any) {
    const response = await fetch(`${BASE_URL}/appointments?id=${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(appointmentData),
    });

    return this.handleResponse(response);
  }

  // Orders API
  async getOrders() {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getOrder(id: string) {
    const response = await fetch(`${BASE_URL}/orders?id=${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createOrder(orderData: any) {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(orderData),
    });

    return this.handleResponse(response);
  }

  // Admin API
  async getAdminStats() {
    const response = await fetch(`${BASE_URL}/admin?action=stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAdminCourses() {
    const response = await fetch(`${BASE_URL}/admin?action=courses`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAdminServices() {
    const response = await fetch(`${BASE_URL}/admin?action=services`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAdminAppointments() {
    const response = await fetch(`${BASE_URL}/admin?action=appointments`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAdminOrders() {
    const response = await fetch(`${BASE_URL}/admin?action=orders`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();