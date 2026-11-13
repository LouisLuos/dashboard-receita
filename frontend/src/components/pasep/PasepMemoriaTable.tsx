import React from 'react';
import type { PasepConsolidadoOutputDTO } from '../../types/receita';

interface PasepMemoriaTableProps {
  dados: PasepConsolidadoOutputDTO | null;
  competenciaFiltro?: string;
  loading: boolean;
}

const MESES_CURTOS: Record<string, string> = {
  '01': 'Jan',
  '02': 'Fev',
  '03': 'Mar',
  '04': 'Abr',
  '05': 'Mai',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Ago',
  '09': 'Set',
  '10': 'Out',
  '11': 'Nov',
  '12': 'Dez',
};

function formatarCompetenciaCurta(competencia: string): string {
  const [ano, mes] = competencia.split('-');
  return `${MESES_CURTOS[mes] ?? mes}/${ano}`;
}

export const PasepMemoriaTable: React.FC<PasepMemoriaTableProps> = ({
  dados,
  competenciaFiltro = 'YTD',
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="h-5 w-80 bg-slate-200 rounded animate-pulse" />
        <div className="h-14 w-full bg-slate-100 rounded-xl animate-pulse" />
        <div className="space-y-2 pt-2">
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

  const mesesFiltrados =
    competenciaFiltro && competenciaFiltro !== 'YTD'
      ? dados.meses.filter((m) => m.competencia === competenciaFiltro)
      : dados.meses;

  const exibirRodapeTotal = competenciaFiltro === 'YTD' || mesesFiltrados.length > 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Cabeçalho da Memória de Cálculo */}
      <div className="px-6 pt-5 pb-4 flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            Memória de Cálculo Auditável do PASEP — RN01 & RN02
          </h2>
        </div>

        {/* Faixa Explicativa da Fórmula Legal (idêntica ao design) */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-3 text-[11px] leading-relaxed space-y-1">
          <p className="text-slate-600">
            <strong className="font-semibold text-blue-700">Base Tributável PASEP</strong>
            {' = '}
            <span>(Receitas Correntes [TFSD + TFSI + Multas] + Receitas Patrimoniais)</span>
            {' − '}
            <span className="font-medium text-amber-700">
              Repasses Convênio ANEEL (Não Tributáveis)
            </span>
          </p>
          <p className="text-slate-600">
            <strong className="font-semibold text-indigo-700">PASEP a Recolher</strong>
            {' = Base Tributável × '}
            <strong className="font-semibold text-slate-800">1,00%</strong>
            {' (Arredondamento contábil 2 casas decimais — DARF • Lei Federal nº 9.715/1998)'}
          </p>
        </div>
      </div>

      {/* Tabela Responsiva com Alinhamento Tabular para Auditoria */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50/70 text-[11px] font-medium text-slate-500">
              <th className="py-3 px-6">Competência</th>
              <th className="py-3 px-4 text-right">(=) Receita Bruta Total</th>
              <th className="py-3 px-4 text-right">
                <span className="inline-flex items-center justify-end gap-1.5">
                  <span>(-) Expurgo Convênio ANEEL</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/80 text-[9px] font-semibold">
                    Não Tributável
                  </span>
                </span>
              </th>
              <th className="py-3 px-4 text-right">(=) Base de Cálculo PASEP</th>
              <th className="py-3 px-6 text-right bg-indigo-50/50 text-indigo-700 font-semibold">
                PASEP Apurado (1,00%)
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {mesesFiltrados.map((item) => {
              const possuiDeducao = item.deducaoAneel > 0;

              return (
                <tr key={item.competencia} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-6 whitespace-nowrap font-semibold text-slate-800">
                    {formatarCompetenciaCurta(item.competencia)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-slate-800 whitespace-nowrap">
                    {item.receitaBrutaFormatada}
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                    {possuiDeducao ? (
                      <span className="text-amber-600 font-medium">
                        - {item.deducaoAneelFormatada}
                      </span>
                    ) : (
                      <span className="text-slate-400">{item.deducaoAneelFormatada}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                    {item.baseTributavelFormatada}
                  </td>

                  <td className="py-3 px-6 text-right font-mono tabular-nums font-bold text-indigo-700 bg-indigo-50/35 whitespace-nowrap">
                    {item.pasepDevidoFormatado}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Linha de Consolidação YTD */}
          {exibirRodapeTotal && (
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-900">
                <td className="py-3.5 px-6 whitespace-nowrap uppercase tracking-wide text-[11px]">
                  TOTAL YTD
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                  {dados.resumoYTD.receitaBrutaTotalFormatada}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-amber-700 whitespace-nowrap">
                  - {dados.resumoYTD.deducaoAneelTotalFormatada}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-700 whitespace-nowrap">
                  {dados.resumoYTD.baseTributavelTotalFormatada}
                </td>
                <td className="py-3.5 px-6 text-right font-mono tabular-nums text-indigo-700 bg-indigo-100/50 whitespace-nowrap">
                  {dados.resumoYTD.pasepTotalFormatado}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
