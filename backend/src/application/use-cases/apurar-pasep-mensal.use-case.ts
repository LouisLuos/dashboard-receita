// 📁 Caminho: src/application/use-cases/apurar-pasep-mensal.use-case.ts
import { DadosNaoEncontradosError } from '../errors/application-errors.js';
import { ApuracaoPasep } from '../../domain/entities/ApuracaoPasep.js';
import { ValorMonetario } from '../../domain/value-object/valor-monetario.js';
import type { IReceitaRepository } from '../ports/IReceitaRepository.js';
import type {
  PasepConsolidadoOutputDTO,
  PasepMensalItemDTO,
} from '../dtos/pasep-output.dto.js';

export class ApurarPasepMensalUseCase {
  constructor(private readonly receitaRepo: IReceitaRepository) {}

  async executar(): Promise<PasepConsolidadoOutputDTO> {
    const data = await this.receitaRepo.obterDadosConsolidados();

    if (!data || !data.memoriaPasep?.length) {
      throw new DadosNaoEncontradosError(
        'Memória de apuração mensal do PASEP não encontrada na base consolidada.',
      );
    }

    let receitaBrutaTotal = ValorMonetario.zero();
    let deducaoAneelTotal = ValorMonetario.zero();
    let baseTributavelTotal = ValorMonetario.zero();
    let pasepTotal = ValorMonetario.zero();

    const meses: PasepMensalItemDTO[] = data.memoriaPasep.map((item) => {
      // Instancia a entidade de domínio para validar invariantes e recalcular PASEP (RN01/RN02)
      const apuracao = new ApuracaoPasep(
        item.competencia,
        item.mesExtenso,
        ValorMonetario.de(item.receitaBruta),
        ValorMonetario.de(item.deducaoAneel),
      );

      receitaBrutaTotal = receitaBrutaTotal.somar(apuracao.receitaBruta);
      deducaoAneelTotal = deducaoAneelTotal.somar(apuracao.deducaoAneel);
      baseTributavelTotal = baseTributavelTotal.somar(apuracao.baseTributavel);
      pasepTotal = pasepTotal.somar(apuracao.pasepDevido);

      return {
        competencia: apuracao.competencia,
        mesExtenso: apuracao.mesExtenso,
        receitaBruta: apuracao.receitaBruta.valor,
        receitaBrutaFormatada: apuracao.receitaBruta.formatarBRL(),
        deducaoAneel: apuracao.deducaoAneel.valor,
        deducaoAneelFormatada: apuracao.deducaoAneel.formatarBRL(),
        baseTributavel: apuracao.baseTributavel.valor,
        baseTributavelFormatada: apuracao.baseTributavel.formatarBRL(),
        aliquotaPercentual: ApuracaoPasep.ALIQUOTA_PADRAO * 100,
        pasepDevido: apuracao.pasepDevido.valor,
        pasepDevidoFormatado: apuracao.pasepDevido.formatarBRL(),
      };
    });

    return {
      meses,
      resumoYTD: {
        receitaBrutaTotal: receitaBrutaTotal.valor,
        receitaBrutaTotalFormatada: receitaBrutaTotal.formatarBRL(),
        deducaoAneelTotal: deducaoAneelTotal.valor,
        deducaoAneelTotalFormatada: deducaoAneelTotal.formatarBRL(),
        baseTributavelTotal: baseTributavelTotal.valor,
        baseTributavelTotalFormatada: baseTributavelTotal.formatarBRL(),
        pasepTotal: pasepTotal.valor,
        pasepTotalFormatado: pasepTotal.formatarBRL(),
      },
    };
  }
}

