export interface KpisOutputDTO {
  arrecadacaoTotal: number;
  arrecadacaoFormatada: string;
  mediaMensal: number;
  mediaMensalFormatada: string;
  totalPasep: number;
  totalPasepFormatado: string;
  percentualConcentracaoTop2: number;
  alertaRiscoConcentracao: boolean;
}

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

export interface EvolucaoMensalPontoDTO {
  competencia: string;
  mesRotulo: string;
  receitaBruta: number;
  baseTributavel: number;
  pasepDevido: number;
}

export interface ShareFonteItemDTO {
  id: string;
  nome: string;
  categoria: string;
  valorTotal: number;
  valorFormatado: string;
  percentualShare: number;
  percentualFormatado: string;
  isIsentoPasep?: boolean;
}

export interface GraficosDashboardOutputDTO {
  evolucaoMensal: EvolucaoMensalPontoDTO[];
  distribuicaoShare: ShareFonteItemDTO[];
}
