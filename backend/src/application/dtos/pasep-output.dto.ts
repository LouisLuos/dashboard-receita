// 📁 Caminho: src/application/dtos/pasep-output.dto.ts

export interface PasepMensalItemDTO {
  competencia: string;
  mesExtenso: string;
  receitaBruta: number;
  receitaBrutaFormatada: string;
  deducaoAneel: number;
  deducaoAneelFormatada: string;
  baseTributavel: number;
  baseTributavelFormatada: string;
  aliquotaPercentual: number;
  pasepDevido: number;
  pasepDevidoFormatado: string;
}

export interface PasepConsolidadoOutputDTO {
  meses: PasepMensalItemDTO[];
  resumoYTD: {
    receitaBrutaTotal: number;
    receitaBrutaTotalFormatada: string;
    deducaoAneelTotal: number;
    deducaoAneelTotalFormatada: string;
    baseTributavelTotal: number;
    baseTributavelTotalFormatada: string;
    pasepTotal: number;
    pasepTotalFormatado: string;
  };
}

