const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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
  inquiry_type: "general" | "vehicle_interest" | "valuation" | "financing";
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

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Erro na requisição" }));
      throw new Error(error.message || `Erro ${response.status}`);
    }

    const data = await response.json();

    // Se a API retornar {data: [...], error: null}, extrair apenas data
    if (data && typeof data === "object" && "data" in data) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
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
  return fetchAPI<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function register(
  data: RegisterData
): Promise<{ id: string; name: string; email: string; role: string }> {
  return fetchAPI<{ id: string; name: string; email: string; role: string }>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getProfile(
  token: string
): Promise<{ id: string; name: string; email: string; role: string }> {
  return fetchAPI<{ id: string; name: string; email: string; role: string }>(
    "/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export type UpdateProfileData = {
  name?: string;
  email?: string;
};

export async function updateProfile(
  token: string,
  data: UpdateProfileData
): Promise<{ id: string; name: string; email: string; role: string }> {
  return fetchAPI<{ id: string; name: string; email: string; role: string }>(
    "/auth/profile",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
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
    body: JSON.stringify(data),
  });
}

// Helper para adicionar token nas requisições autenticadas
export function getAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}
