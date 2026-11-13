// 📁 Caminho: backend/src/application/use-cases/obter-graficos-dashboard.use-case.ts
import { DadosNaoEncontradosError } from '../errors/application-errors.js';
import { FonteShare } from '../../domain/entities/FonteShare.js';
import { ValorMonetario } from '../../domain/value-object/valor-monetario.js';
import type { IReceitaRepository } from '../ports/IReceitaRepository.js';
import type {
  EvolucaoMensalPontoDTO,
  GraficosDashboardOutputDTO,
  ShareFonteItemDTO,
} from '../dtos/graficos-dashboard-output.dto.js';
import type { IFonteReceita } from '../../scripts/etl-interface.js';

export class ObterGraficosDashboardUseCase {
  constructor(private readonly receitaRepo: IReceitaRepository) {}

  async executar(): Promise<GraficosDashboardOutputDTO> {
    const data = await this.receitaRepo.obterDadosConsolidados();

    if (!data || !data.memoriaPasep?.length || !data.fontes?.length) {
      throw new DadosNaoEncontradosError(
        'Dados analíticos e fontes de receita não encontrados na base consolidada.',
      );
    }

    const totalGeral = ValorMonetario.de(data.arrecadacaoTotalYTD);

    // =========================================================================
    // PARTE 1: Evolução Mensal (Gráfico da Esquerda: Jan/26 a Out/26)
    // =========================================================================
    const evolucaoMensal: EvolucaoMensalPontoDTO[] = data.memoriaPasep.map((item) => {
      const mesRotulo = this.formatarRotuloMes(item.competencia, item.mesExtenso);

      return {
        competencia: item.competencia,
        mesRotulo,
        receitaBruta: item.receitaBruta,
        baseTributavel: item.baseTributavel,
        pasepDevido: item.pasepDevido,
      };
    });

    // =========================================================================
    // PARTE 2: Donut de Share (Gráfico da Direita: Agrupamento em 6 Fatias)
    // =========================================================================
    const buscarTotal = (id: string): ValorMonetario => {
      const fonte = data.fontes.find((f: IFonteReceita) => f.id === id);
      return ValorMonetario.de(fonte?.totalYTD ?? 0);
    };

    // 1. COMPESA
    const compesa = new FonteShare(
      'compesa',
      'COMPESA (Saneamento Básico)',
      'TFSD',
      buscarTotal('tfsd_compesa'),
      totalGeral,
    );

    // 2. COPERGÁS
    const copergas = new FonteShare(
      'copergas',
      'COPERGÁS (Gás Canalizado)',
      'TFSD',
      buscarTotal('tfsd_copergas'),
      totalGeral,
    );

    // 3. Patrimoniais & Multas (Soma: Receitas Financeiras + Multa Compesa)
    const totalPatrimonialMultas = buscarTotal('receitas_financeiras').somar(
      buscarTotal('multa_compesa'),
    );
    const patrimonialMultas = new FonteShare(
      'patrimonial_multas',
      'Patrimoniais & Multas',
      'PATRIMONIAL',
      totalPatrimonialMultas,
      totalGeral,
    );

    // 4. TFSI - Porto Digital, CEASA, ITEP
    const tfsi = new FonteShare(
      'tfsi_diversas',
      'TFSI — Porto Digital, CEASA, ITEP',
      'TFSI',
      buscarTotal('tfsi_os_oscip'),
      totalGeral,
    );

    // 5. Convênio ANEEL (Isento de PASEP)
    const aneel = new FonteShare(
      'convenio_aneel',
      'Convênio ANEEL (Repasse Federal)',
      'CONVENIO_ANEEL',
      buscarTotal('receita_aneel'),
      totalGeral,
      true, // isIsentoPasep
    );

    // 6. Rodovias & SOCICAM (Soma: Rota Atlântico + Rota Coqueiros + SOCICAM)
    const totalRodoviasSocicam = buscarTotal('tfsd_rota_atlantico')
      .somar(buscarTotal('tfsd_rota_coqueiros'))
      .somar(buscarTotal('tfsd_socicam'));

    const rodoviasSocicam = new FonteShare(
      'rodovias_socicam',
      'Rodovias & SOCICAM',
      'TFSD',
      totalRodoviasSocicam,
      totalGeral,
    );

    const fatias: FonteShare[] = [
      compesa,
      copergas,
      patrimonialMultas,
      tfsi,
      aneel,
      rodoviasSocicam,
    ];

    const distribuicaoShare: ShareFonteItemDTO[] = fatias.map((f) => ({
      id: f.id,
      nome: f.nome,
      categoria: f.categoria,
      valorTotal: f.valorTotal.valor,
      valorFormatado: f.valorTotal.formatarBRL(),
      percentualShare: f.percentualShare,
      percentualFormatado: f.percentualFormatado,
      isIsentoPasep: f.isIsentoPasep,
    }));

    return {
      evolucaoMensal,
      distribuicaoShare,
    };
  }

  private formatarRotuloMes(competencia: string, mesExtenso: string): string {
    const anoAbrev = competencia.split('-')[0]?.slice(2) ?? '26';
    const tresPrimeirasLetras =
      mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1, 3).toLowerCase();
    return `${tresPrimeirasLetras}/${anoAbrev}`;
  }
}

