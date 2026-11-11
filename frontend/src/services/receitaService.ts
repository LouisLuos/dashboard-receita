import type { KpisOutputDTO } from '../types/receita';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function obterKpisConsolidados(): Promise<KpisOutputDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/receita/kpis`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Base de receitas não encontrada na API (404). Verifique a base de dados consolidada.');
      }
      if (response.status >= 500) {
        throw new Error('Serviço temporariamente indisponível no servidor (500). Tente novamente em instantes.');
      }
      throw new Error(`Falha na requisição: ${response.status} - ${response.statusText}`);
    }

    return (await response.json()) as KpisOutputDTO;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Não foi possível conectar ao servidor da API em http://localhost:3000. Certifique-se de que o backend NestJS está rodando (npm run start:dev).'
      );
    }
    throw error;
  }
}
