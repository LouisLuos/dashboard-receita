// 📁 Caminho sugerido: backend/src/scripts/etl-interface.ts

import { CategoriaReceita } from "../domain/types/categoria-receita";


export interface ILancamentoMensal {
  competencia: string; // Formato padrão ISO: "2026-01", "2026-02", etc.
  mesExtenso: string;  // "JANEIRO", "FEVEREIRO", etc.
  valor: number;
}

export interface IFonteReceita {
  id: string;
  nome: string;
  categoria: CategoriaReceita;
  concessionaria: string;
  isEstatalTop2: boolean;
  isDedutivelPasep: boolean;
  lancamentos: ILancamentoMensal[];
  totalYTD: number;
}

export interface IMemoriaPasepMensal {
  competencia: string;
  mesExtenso: string;
  receitaBruta: number;
  deducaoAneel: number;
  baseTributavel: number;
  aliquota: number;
  pasepDevido: number;
}

export interface IBaseConsolidadaReceita {
  anoExercicio: number;
  competencias: string[];
  arrecadacaoTotalYTD: number;
  mediaMensal: number;
  totalPasepYTD: number;
  percentualEstataisTop2: number;
  fontes: IFonteReceita[];
  memoriaPasep: IMemoriaPasepMensal[];
  metadata: {
    geradoEm: string;
    origem: string;
    totalCompetenciasValidas: number;
  };
}