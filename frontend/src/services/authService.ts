const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_STORAGE_KEY = 'arpe_jwt_token';

interface LoginResponse {
  accessToken: string;
}

export function obterToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function salvarToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removerToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function estaAutenticado(): boolean {
  const token = obterToken();
  return Boolean(token && token.trim().length > 0);
}

export async function autenticarGestor(email: string, senha: string): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), senha }),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Não foi possível conectar ao servidor da API em ${API_BASE_URL}. Verifique se o backend está rodando.`
      );
    }
    throw error;
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('E-mail ou senha inválidos. Verifique suas credenciais.');
    }
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || `Falha na autenticação (${response.status}).`);
  }

  const data = (await response.json()) as LoginResponse;
  if (!data?.accessToken) {
    throw new Error('Resposta de autenticação inválida: token ausente.');
  }

  salvarToken(data.accessToken);
}
