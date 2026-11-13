// 📁 Caminho: backend/src/test/application/obter-graficos-dashboard.spec.ts
import { describe, expect, it } from 'vitest';
import { ObterGraficosDashboardUseCase } from '../../application/use-cases/obter-graficos-dashboard.use-case.js';
import type { IReceitaRepository } from '../../application/ports/IReceitaRepository.js';
import type { IBaseConsolidadaReceita } from '../../scripts/etl-interface.js';
import { DadosNaoEncontradosError } from '../../application/errors/application-errors.js';

class InMemoryReceitaRepository implements IReceitaRepository {
  constructor(private dados: IBaseConsolidadaReceita | null) {}

  async obterDadosConsolidados(): Promise<IBaseConsolidadaReceita | null> {
    return this.dados;
  }
}

describe('ObterGraficosDashboardUseCase', () => {
  const dadosMock: IBaseConsolidadaReceita = {
    anoExercicio: 2026,
    competencias: ['2026-01', '2026-02'],
    arrecadacaoTotalYTD: 20000000,
    mediaMensal: 10000000,
    totalPasepYTD: 195000,
    percentualEstataisTop2: 80,
    fontes: [
      {
        id: 'tfsd_compesa',
        nome: 'COMPESA',
        categoria: 'TFSD',
        concessionaria: 'COMPESA',
        isEstatalTop2: true,
        isDedutivelPasep: false,
        lancamentos: [],
        totalYTD: 10000000, // 50%
      },
      {
        id: 'tfsd_copergas',
        nome: 'COPERGÁS',
        categoria: 'TFSD',
        concessionaria: 'COPERGÁS',
        isEstatalTop2: true,
        isDedutivelPasep: false,
        lancamentos: [],
        totalYTD: 6000000, // 30%
      },
      {
        id: 'multa_compesa',
        nome: 'Multa',
        categoria: 'MULTAS',
        concessionaria: 'COMPESA',
        isEstatalTop2: false,
        isDedutivelPasep: false,
        lancamentos: [],
        totalYTD: 500000,
      },
      {
        id: 'receitas_financeiras',
        nome: 'Financeiras',
        categoria: 'PATRIMONIAL',
        concessionaria: 'Caixa',
        isEstatalTop2: false,
        isDedutivelPasep: false,
        lancamentos: [],
        totalYTD: 1500000, // 500k + 1.5M = 2M (10%)
      },
      {
        id: 'tfsi_os_oscip',
        nome: 'TFSI Diversas',
        categoria: 'TFSI',
        concessionaria: 'Diversas',
        isEstatalTop2: false,
        isDedutivelPasep: false,
        lancamentos: [],
        totalYTD: 1000000, // 5%
      },
      {
        id: 'receita_aneel',
        nome: 'ANEEL',
        categoria: 'CONVENIO_ANEEL',
        concessionaria: 'ANEEL',
        isEstatalTop2: false,
        isDedutivelPasep: true,
        lancamentos: [],
        totalYTD: 600000, // 3%
      },
      {
        id: 'tfsd_rota_atlantico',
        nome: 'Rota Atlântico',
        categoria: 'TFSD',
        concessionaria: 'Rota Atlântico',
        isEstatalTop2: false,
        isDedutivelPasep: false,
        lancamentos: [],
        totalYTD: 200000,
      },
      {
        id: 'tfsd_rota_coqueiros',
        nome: 'Rota Coqueiros',
        categoria: 'TFSD',
        concessionaria: 'Rota Coqueiros',
        isEstatalTop2: false,
        isDedutivelPasep: false,
        lancamentos: [],
        totalYTD: 100000,
      },
      {
        id: 'tfsd_socicam',
        nome: 'SOCICAM',
        categoria: 'TFSD',
        concessionaria: 'SOCICAM',
        isEstatalTop2: false,
        isDedutivelPasep: false,
        lancamentos: [],
        totalYTD: 100000, // 200k + 100k + 100k = 400k (2%)
      },
    ],
    memoriaPasep: [
      {
        competencia: '2026-01',
        mesExtenso: 'JANEIRO',
        receitaBruta: 10000000,
        deducaoAneel: 300000,
        baseTributavel: 9700000,
        aliquota: 0.01,
        pasepDevido: 97000,
      },
      {
        competencia: '2026-02',
        mesExtenso: 'FEVEREIRO',
        receitaBruta: 10000000,
        deducaoAneel: 300000,
        baseTributavel: 9700000,
        aliquota: 0.01,
        pasepDevido: 97000,
      },
    ],
    metadata: {
      geradoEm: '2026-11-13',
      origem: 'test',
      totalCompetenciasValidas: 2,
    },
  };

  it('deve consolidar os pontos de evolucao mensal com rotulos curtos e as 6 fatias do share', async () => {
    const repo = new InMemoryReceitaRepository(dadosMock);
    const useCase = new ObterGraficosDashboardUseCase(repo);

    const resultado = await useCase.executar();

    // 1. Validação da Evolução Mensal
    expect(resultado.evolucaoMensal).toHaveLength(2);
    expect(resultado.evolucaoMensal[0]).toEqual({
      competencia: '2026-01',
      mesRotulo: 'Jan/26',
      receitaBruta: 10000000,
      baseTributavel: 9700000,
      pasepDevido: 97000,
    });
    expect(resultado.evolucaoMensal[1]?.mesRotulo).toBe('Fev/26');

    // 2. Validação das 6 fatias do Share
    expect(resultado.distribuicaoShare).toHaveLength(6);

    const compesa = resultado.distribuicaoShare.find((f) => f.id === 'compesa');
    expect(compesa?.percentualShare).toBe(50);
    expect(compesa?.percentualFormatado).toBe('50,00%');

    const copergas = resultado.distribuicaoShare.find((f) => f.id === 'copergas');
    expect(copergas?.percentualShare).toBe(30);

    const patrimonialMultas = resultado.distribuicaoShare.find(
      (f) => f.id === 'patrimonial_multas',
    );
    expect(patrimonialMultas?.valorTotal).toBe(2000000);
    expect(patrimonialMultas?.percentualShare).toBe(10);

    const aneel = resultado.distribuicaoShare.find((f) => f.id === 'convenio_aneel');
    expect(aneel?.isIsentoPasep).toBe(true);
    expect(aneel?.percentualShare).toBe(3);

    const rodoviasSocicam = resultado.distribuicaoShare.find(
      (f) => f.id === 'rodovias_socicam',
    );
    expect(rodoviasSocicam?.valorTotal).toBe(400000);
    expect(rodoviasSocicam?.percentualShare).toBe(2);
  });

  it('deve lançar DadosNaoEncontradosError se a base ou arrays forem vazios', async () => {
    const repo = new InMemoryReceitaRepository(null);
    const useCase = new ObterGraficosDashboardUseCase(repo);

    await expect(() => useCase.executar()).rejects.toThrow(DadosNaoEncontradosError);
  });
});

