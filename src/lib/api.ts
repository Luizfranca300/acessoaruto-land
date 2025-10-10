const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/v1";

// Tipos exportados do antigo supabase.ts
export type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
};

export type Vehicle = {
  id: string;
  brand_id: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string | null;
  features: string[] | null;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
  updated_at: string;
  brands?: Brand;
};

export type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicle_id?: string;
  inquiry_type:
    | "general"
    | "vehicle_info"
    | "test_drive"
    | "financing"
    | "trade_in";
};

export type VehicleValuation = {
  name: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: "excellent" | "good" | "fair" | "poor";
  additional_info?: string;
};

// Helper para fazer requisições
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  console.log("[API] Request:", { url, method: options?.method || "GET" });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    console.log("[API] Response:", {
      status: response.status,
      ok: response.ok,
      url,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Erro na requisição" }));
      console.error("[API] Error response:", error);
      throw new Error(error.message || `Erro ${response.status}`);
    }

    const data = await response.json();
    console.log("[API] Data received:", data);

    // Se a API retornar {data: [...], error: null}, extrair apenas data
    if (data && typeof data === "object" && "data" in data) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.error("[API] Fetch error:", error);
    throw error;
  }
}

// ==================== BRANDS ====================

export async function getBrands(): Promise<Brand[]> {
  return fetchAPI<Brand[]>("/brands");
}

export async function createBrand(
  brand: Omit<Brand, "id" | "created_at">
): Promise<Brand> {
  return fetchAPI<Brand>("/brands", {
    method: "POST",
    body: JSON.stringify(brand),
  });
}

// ==================== VEHICLES ====================

export type VehicleFilters = {
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  fuel_type?: string;
  transmission?: string;
  is_featured?: boolean;
  is_sold?: boolean;
};

export async function getVehicles(
  filters?: VehicleFilters
): Promise<Vehicle[]> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/vehicles?${queryString}` : "/vehicles";

  return fetchAPI<Vehicle[]>(endpoint);
}

export async function getVehicle(id: string): Promise<Vehicle> {
  return fetchAPI<Vehicle>(`/vehicles/${id}`);
}

export async function createVehicle(
  vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">
): Promise<Vehicle> {
  const token = getToken();
  return fetchAPI<Vehicle>("/vehicles", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vehicle),
  });
}

// Helper para obter token
function getToken(): string | null {
  return localStorage.getItem("acessorauto_token");
}

export async function updateVehicle(
  id: string,
  vehicle: Partial<Omit<Vehicle, "id" | "created_at" | "updated_at" | "brands">>
): Promise<Vehicle> {
  const token = getToken();
  return fetchAPI<Vehicle>(`/vehicles/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vehicle),
  });
}

export async function deleteVehicle(id: string): Promise<void> {
  const token = getToken();
  return fetchAPI<void>(`/vehicles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ==================== CONTACT INQUIRIES ====================

export async function createContactInquiry(
  inquiry: ContactInquiry
): Promise<{ id: string }> {
  return fetchAPI<{ id: string }>("/contact-inquiries", {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
}

// ==================== VALUATIONS ====================

export async function createValuation(
  valuation: VehicleValuation
): Promise<{ id: string }> {
  return fetchAPI<{ id: string }>("/vehicle-valuations", {
    method: "POST",
    body: JSON.stringify(valuation),
  });
}

// ==================== HEALTH CHECK ====================

export async function healthCheck(): Promise<{
  status: string;
  timestamp: string;
}> {
  return fetchAPI<{ status: string; timestamp: string }>("/health");
}

// ==================== AUTHENTICATION ====================

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await fetchAPI<{
    access_token: string;
    user: {
      id: string;
      email: string;
      full_name: string;
      is_admin: boolean;
    };
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Transformar resposta do backend para o formato esperado pelo frontend
  return {
    token: response.access_token,
    user: {
      id: response.user.id,
      name: response.user.full_name,
      email: response.user.email,
      role: response.user.is_admin ? "admin" : "user",
    },
  };
}

export async function register(
  data: RegisterData
): Promise<{ id: string; name: string; email: string; role: string }> {
  const response = await fetchAPI<{
    id: string;
    email: string;
    full_name: string;
    is_admin: boolean;
  }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      full_name: data.name,
    }),
  });

  // Transformar resposta do backend para o formato esperado pelo frontend
  return {
    id: response.id,
    name: response.full_name,
    email: response.email,
    role: response.is_admin ? "admin" : "user",
  };
}

export async function getProfile(
  token: string
): Promise<{ id: string; name: string; email: string; role: string }> {
  const response = await fetchAPI<{
    id: string;
    email: string;
    full_name: string;
    is_admin: boolean;
  }>("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Transformar resposta do backend para o formato esperado pelo frontend
  return {
    id: response.id,
    name: response.full_name,
    email: response.email,
    role: response.is_admin ? "admin" : "user",
  };
}

export type UpdateProfileData = {
  name?: string;
  email?: string;
};

export async function updateProfile(
  token: string,
  data: UpdateProfileData
): Promise<{ id: string; name: string; email: string; role: string }> {
  const response = await fetchAPI<{
    id: string;
    email: string;
    full_name: string;
    is_admin: boolean;
  }>("/auth/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: data.email,
      full_name: data.name,
    }),
  });

  // Transformar resposta do backend para o formato esperado pelo frontend
  return {
    id: response.id,
    name: response.full_name,
    email: response.email,
    role: response.is_admin ? "admin" : "user",
  };
}

export type UpdatePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export async function updatePassword(
  token: string,
  data: UpdatePasswordData
): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>("/auth/password", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      current_password: data.currentPassword,
      new_password: data.newPassword,
    }),
  });
}

// Helper para adicionar token nas requisições autenticadas
export function getAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}
