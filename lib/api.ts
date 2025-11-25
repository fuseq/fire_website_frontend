// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Token yönetimi
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
};

const removeToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
};

// Genel fetch fonksiyonu
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Token varsa ekle
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Mevcut header'ları ekle
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API isteği başarısız oldu");
  }

  return data;
}

// AUTH API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => {
    const data = await fetchAPI<any>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    if (data.data.token) {
      setToken(data.data.token);
    }
    return data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const data = await fetchAPI<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.data.token) {
      setToken(data.data.token);
    }
    return data;
  },

  logout: () => {
    removeToken();
  },

  getProfile: async () => {
    return fetchAPI<any>("/api/auth/profile");
  },

  updateProfile: async (profileData: { name?: string; phone?: string }) => {
    return fetchAPI<any>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};

// PRODUCTS API
export const productsAPI = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    inStock?: boolean;
    sortBy?: string;
    order?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return fetchAPI<any>(`/api/products${query ? `?${query}` : ""}`);
  },

  getById: async (id: number) => {
    return fetchAPI<any>(`/api/products/${id}`);
  },

  getCategories: async () => {
    return fetchAPI<any>("/api/products/categories");
  },

  create: async (productData: any) => {
    return fetchAPI<any>("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  update: async (id: number, productData: any) => {
    return fetchAPI<any>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: number) => {
    return fetchAPI<any>(`/api/products/${id}`, {
      method: "DELETE",
    });
  },
};

// ORDERS API
export const ordersAPI = {
  create: async (orderData: {
    items: Array<{ productId: number; quantity: number }>;
    shippingAddressId: number;
    paymentMethod: string;
    paymentId?: string;
  }) => {
    return fetchAPI<any>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    return fetchAPI<any>("/api/orders/my-orders");
  },

  getById: async (id: number) => {
    return fetchAPI<any>(`/api/orders/${id}`);
  },

  getAll: async (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return fetchAPI<any>(`/api/orders/all${query}`);
  },

  updateStatus: async (id: number, status: string) => {
    return fetchAPI<any>(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  getStats: async () => {
    return fetchAPI<any>("/api/orders/stats");
  },
};

// ADDRESSES API
export const addressesAPI = {
  getAll: async () => {
    return fetchAPI<any>("/api/addresses");
  },

  create: async (addressData: {
    name: string;
    street: string;
    city: string;
    zipCode: string;
    phone: string;
    isDefault?: boolean;
  }) => {
    return fetchAPI<any>("/api/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
  },

  update: async (id: number, addressData: any) => {
    return fetchAPI<any>(`/api/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    });
  },

  delete: async (id: number) => {
    return fetchAPI<any>(`/api/addresses/${id}`, {
      method: "DELETE",
    });
  },
};

// REVIEWS API
export const reviewsAPI = {
  getByProduct: async (productId: number) => {
    return fetchAPI<any>(`/api/reviews/product/${productId}`);
  },

  create: async (reviewData: {
    productId: number;
    rating: number;
    comment: string;
  }) => {
    return fetchAPI<any>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  update: async (id: number, reviewData: { rating?: number; comment?: string }) => {
    return fetchAPI<any>(`/api/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  delete: async (id: number) => {
    return fetchAPI<any>(`/api/reviews/${id}`, {
      method: "DELETE",
    });
  },
};

// USERS API (Admin)
export const usersAPI = {
  getAll: async () => {
    return fetchAPI<any>("/api/users");
  },

  getById: async (id: number) => {
    return fetchAPI<any>(`/api/users/${id}`);
  },

  toggleAdmin: async (id: number, isAdmin: boolean) => {
    return fetchAPI<any>(`/api/users/${id}/toggle-admin`, {
      method: "PUT",
      body: JSON.stringify({ isAdmin }),
    });
  },

  delete: async (id: number) => {
    return fetchAPI<any>(`/api/users/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async () => {
    return fetchAPI<any>("/api/users/stats");
  },
};

// Token export
export { getToken, setToken, removeToken };
