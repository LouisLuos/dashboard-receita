// 📁 src/application/dtos/graficos-dashboard-output.dto.ts

import { CategoriaReceita } from "../../domain/types/categoria-receita";

export interface EvolucaoMensalPontoDTO {
  competencia: string;       // "2026-01"
  mesRotulo: string;         // "Jan/26"
  receitaBruta: number;      // 2068559.69
  baseTributavel: number;    // 1975386.02
  pasepDevido: number;       // 19753.86
}

export interface ShareFonteItemDTO {
  id: string;                // "compesa"
  nome: string;              // "COMPESA (Saneamento Básico)"
  categoria: CategoriaReceita;         // "TFSD" | "TFSI" | "PATRIMONIAL" | "CONVENIO_ANEEL"
  valorTotal: number;        // 10671267.60
  valorFormatado: string;    // "R$ 10.671.267,60"
  percentualShare: number;   // 52.74
  percentualFormatado: string; // "52,74%"
  isIsentoPasep?: boolean;   // true no caso do repasse federal ANEEL (pra colocar aquela tagzinha da imagem!)
}

export interface GraficosDashboardOutputDTO {
  evolucaoMensal: EvolucaoMensalPontoDTO[];
  distribuicaoShare: ShareFonteItemDTO[];
}