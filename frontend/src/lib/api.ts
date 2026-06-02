/** /api = proxy Next (Docker + celular na mesma rede) */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api' : 'http://localhost:4000/api');

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fleet_token');
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro na requisição');
  return json.data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<{ token: string; user: { id: number; name: string; email: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
