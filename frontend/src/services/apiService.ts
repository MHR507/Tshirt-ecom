const API_BASE_URL = '/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Auth endpoints
  async login(email: string, password: string, role: 'customer' | 'designer') {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: { email, password, role },
    });
  }

  async adminLogin(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/admin/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(name: string, email: string, password: string, role: 'customer' | 'designer') {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: { name, email, password, role },
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Products endpoints
  async getProducts(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<{ products: any[] }>(`/products${query}`);
  }

  async getProduct(id: string) {
    return this.request<{ product: any }>(`/products/${id}`);
  }

  async getFeaturedProducts() {
    return this.request<{ products: any[] }>('/products/featured');
  }

  async getNewArrivals() {
    return this.request<{ products: any[] }>('/products/new');
  }

  // Orders endpoints
  async createOrder(orderData: {
    items: any[];
    total: number;
    shippingAddress: string;
    customerName: string;
    customerEmail: string;
  }) {
    return this.request<{ order: any }>('/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrders() {
    return this.request<{ orders: any[] }>('/orders');
  }

  async updateOrderStatus(orderId: number, status: string) {
    return this.request<{ order: any }>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: { status },
    });
  }

  // Designs endpoints
  async getDesigns() {
    return this.request<{ designs: any[] }>('/designs');
  }

  async createDesign(designData: { name: string; image: string; category?: string }) {
    return this.request<{ design: any }>('/designs', {
      method: 'POST',
      body: designData,
    });
  }

  async approveDesign(designId: number) {
    return this.request<{ design: any }>(`/designs/${designId}/approve`, {
      method: 'PUT',
    });
  }

  async rejectDesign(designId: number, reason?: string) {
    return this.request<{ design: any }>(`/designs/${designId}/reject`, {
      method: 'PUT',
      body: { reason },
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request<{ stats: any }>('/admin/stats');
  }

  async getDesigners() {
    return this.request<{ designers: any[] }>('/admin/designers');
  }

  // Designer endpoints
  async getDesignerStats() {
    return this.request<{ stats: any }>('/designer/stats');
  }

  async getTransactions() {
    return this.request<{ transactions: any[] }>('/designer/transactions');
  }

  async requestWithdrawal(amount: number) {
    return this.request<{ transaction: any }>('/designer/withdraw', {
      method: 'POST',
      body: { amount },
    });
  }
}

export const apiService = new ApiService();
export default apiService;
