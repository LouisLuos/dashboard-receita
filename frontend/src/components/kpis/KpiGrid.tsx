import React from 'react';
import { KpiCard } from './KpiCard';
import type { KpisOutputDTO } from '../../types/receita';

interface KpiGridProps {
  dados: KpisOutputDTO | null;
  loading: boolean;
  erro: string | null;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ dados, loading, erro }) => {
  // Estado de Carregamento (Skeleton Sóbrio)
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="h-3 bg-slate-200 rounded w-28"></div>
              <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-7 bg-slate-200 rounded w-40 mb-3"></div>
            <div className="h-3 bg-slate-200 rounded w-48"></div>
          </div>
        ))}
      </div>
    );
  }

  // Estado de Erro amigável
  if (erro || !dados) {
    return (
      <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-xs">
        <strong className="font-semibold">Erro ao carregar indicadores executivos:</strong> {erro || 'Dados não disponíveis'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 💳 CARD 1: Arrecadação Total Bruta (YTD) */}
      <KpiCard
        titulo="Arrecadação Total Bruta (YTD)"
        valor={dados.arrecadacaoFormatada}
        subtexto="Saldo Líquido Pós-PASEP: R$ 20.034.706,61 (10 competências consolidadas)"
        corIcone="azul"
        icone={
          <svg className="w-5 h-5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5m0 0H14a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h7" />
          </svg>
        }
      />

      {/* 📅 CARD 2: Média Mensal de Arrecadação */}
      <KpiCard
        titulo="Média Mensal de Arrecadação"
        valor={dados.mediaMensalFormatada}
        subtexto="Fluxo médio de caixa (YTD) • Autofinanciamento regulatório"
        corIcone="verde"
        icone={
          <svg className="w-5 h-5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          </svg>
        }
      />

      {/* ⚖️ CARD 3: Total PASEP Apurado (Alíquota 1,00%) */}
      <KpiCard
        titulo="Total PASEP Apurado (Alíquota 1,00%)"
        valor={dados.totalPasepFormatado}
        subtexto="Base Tributável Efetiva: R$ 19.702.948,00 (Expurgado Convênio ANEEL)"
        badge="Lei Federal nº 9.715/1998 (1%)"
        corIcone="roxo"
        icone={
          <svg className="w-5 h-5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Zm-14 0 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Zm7-12h4m-2 0v17m-6 0h12" />
          </svg>
        }
      />

      {/* 🚨 CARD 4: Índice de Concentração Top 2 Estatais (RN03) */}
      <KpiCard
        titulo="Índice de Concentração Top 2 Estatais (RN03)"
        valor={`${dados.percentualConcentracaoTop2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%`}
        destaqueAlerta={dados.alertaRiscoConcentracao}
        corIcone="vermelho"
        badge={dados.alertaRiscoConcentracao ? "Risco Alto: >80% em 2 Fontes" : undefined}
        badgeTipo="alerta"
        icone={
          <svg className="w-5 h-5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4m0 4h.01" />
          </svg>
        }
      >
        {/* Barra de Progresso Dupla (COMPESA 52,74% + COPERGÁS 29,79%) */}
        <div className="mb-2">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div style={{ width: '52.74%' }} className="bg-blue-600 h-full" title="COMPESA: 52,74%"></div>
            <div style={{ width: '29.79%' }} className="bg-indigo-600 h-full" title="COPERGÁS: 29,79%"></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-1.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              COMPESA (52,74%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              COPERGÁS (29,79%)
            </span>
          </div>
        </div>
      </KpiCard>

    </div>
  );
};

