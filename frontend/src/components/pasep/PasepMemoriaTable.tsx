import React from 'react';
import type { PasepConsolidadoOutputDTO } from '../../types/receita';

interface PasepMemoriaTableProps {
  dados: PasepConsolidadoOutputDTO | null;
  loading: boolean;
}

export const PasepMemoriaTable: React.FC<PasepMemoriaTableProps> = ({ dados, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-72 bg-slate-200 rounded animate-pulse" />
            <div className="h-3.5 w-96 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-7 w-48 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="space-y-2.5 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!dados) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Cabeçalho da Memória de Cálculo */}
      <div className="px-6 py-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/60">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Memória de Cálculo Auditável — PASEP (Alíquota 1,00%)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Discriminação mensal de Receitas Brutas, Expurgo Legal de Convênio ANEEL e Base Tributável (Lei Federal nº 9.715/1998)
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-medium text-indigo-700 self-start lg:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Base Tributável = Receita Bruta − Convênio ANEEL
        </div>
      </div>

      {/* Tabela Responsiva com Alinhamento Tabular para Auditoria */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-6">Competência</th>
              <th className="py-3.5 px-4 text-right">Receita Bruta</th>
              <th className="py-3.5 px-4 text-right">(-) Dedução ANEEL</th>
              <th className="py-3.5 px-4 text-right">(=) Base Tributável</th>
              <th className="py-3.5 px-4 text-center">Alíquota</th>
              <th className="py-3.5 px-6 text-right">PASEP Devido</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {dados.meses.map((item) => {
              const possuiDeducao = item.deducaoAneel > 0;

              return (
                <tr
                  key={item.competencia}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-slate-800">{item.mesExtenso}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-mono">
                        {item.competencia}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {item.receitaBrutaFormatada}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    {possuiDeducao ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70 font-medium">
                        - {item.deducaoAneelFormatada}
                      </span>
                    ) : (
                      <span className="text-slate-400">{item.deducaoAneelFormatada}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                    {item.baseTributavelFormatada}
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {item.aliquotaPercentual.toFixed(2).replace('.', ',')}%
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-right font-mono tabular-nums font-bold text-indigo-700 whitespace-nowrap">
                    {item.pasepDevidoFormatado}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Linha de Consolidação YTD */}
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50/90 text-xs font-bold text-slate-900">
              <td className="py-4 px-6 whitespace-nowrap">
                Total Acumulado (YTD • {dados.meses.length} competências)
              </td>
              <td className="py-4 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                {dados.resumoYTD.receitaBrutaTotalFormatada}
              </td>
              <td className="py-4 px-4 text-right font-mono tabular-nums text-amber-700 whitespace-nowrap">
                - {dados.resumoYTD.deducaoAneelTotalFormatada}
              </td>
              <td className="py-4 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                {dados.resumoYTD.baseTributavelTotalFormatada}
              </td>
              <td className="py-4 px-4 text-center whitespace-nowrap text-slate-500 font-medium">
                1,00%
              </td>
              <td className="py-4 px-6 text-right font-mono tabular-nums text-indigo-700 text-sm whitespace-nowrap">
                {dados.resumoYTD.pasepTotalFormatado}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

