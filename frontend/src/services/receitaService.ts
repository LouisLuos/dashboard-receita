import type {
  KpisOutputDTO,
  PasepConsolidadoOutputDTO,
  GraficosDashboardOutputDTO,
} from '../types/receita';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchReceitaApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Base de receitas não encontrada na API (404). Verifique a base de dados consolidada.');
      }
      if (response.status === 400) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detalhe || 'Os dados financeiros apresentam inconsistência tributária (400).');
      }
      if (response.status >= 500) {
        throw new Error('Serviço temporariamente indisponível no servidor (500). Tente novamente em instantes.');
      }
      throw new Error(`Falha na requisição: ${response.status} - ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Não foi possível conectar ao servidor da API em ${API_BASE_URL}. Certifique-se de que o backend NestJS está rodando (npm run start:dev).`
      );
    }
    throw error;
  }
}

export async function obterKpisConsolidados(): Promise<KpisOutputDTO> {
  return fetchReceitaApi<KpisOutputDTO>('/api/v1/receita/kpis');
}

export async function obterMemoriaPasep(): Promise<PasepConsolidadoOutputDTO> {
  return fetchReceitaApi<PasepConsolidadoOutputDTO>('/api/v1/receita/pasep');
}

export async function obterGraficosDashboard(): Promise<GraficosDashboardOutputDTO> {
  return fetchReceitaApi<GraficosDashboardOutputDTO>('/api/v1/receita/graficos');
}

