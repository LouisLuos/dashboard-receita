import React, { useState } from 'react';
import type { EvolucaoMensalPontoDTO } from '../../types/receita';

interface EvolucaoMensalChartProps {
  dados: EvolucaoMensalPontoDTO[];
  competenciaSelecionada?: string;
  loading?: boolean;
}

const ALTURA_PLOT = 180;
const MAX_BARRA = 2400000;
const MIN_LINHA = 15000;
const MAX_LINHA = 23000;
const SVG_LARGURA = 1000;

export const EvolucaoMensalChart: React.FC<EvolucaoMensalChartProps> = ({
  dados,
  competenciaSelecionada,
  loading,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 h-[330px] flex flex-col justify-between animate-pulse">
        <div className="h-4 w-72 bg-slate-200 rounded" />
        <div className="h-48 w-full bg-slate-100 rounded-xl" />
        <div className="h-3 w-48 mx-auto bg-slate-100 rounded" />
      </div>
    );
  }

  const totalPontos = Math.max(dados.length, 1);

  const pontosLinha = dados.map((d, index) => {
    const xPct = ((index + 0.5) / totalPontos) * 100;
    const xSvg = (xPct / 100) * SVG_LARGURA;
    const ratio = Math.min(Math.max((d.pasepDevido - MIN_LINHA) / (MAX_LINHA - MIN_LINHA), 0), 1);
    const ySvg = ALTURA_PLOT - (ratio * (ALTURA_PLOT * 0.72) + ALTURA_PLOT * 0.12);
    const yPct = (ySvg / ALTURA_PLOT) * 100;

    return { xPct, yPct, xSvg, ySvg, item: d };
  });

  const linhaD = pontosLinha.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.xSvg} ${p.ySvg}` : `${acc} L ${p.xSvg} ${p.ySvg}`),
    '',
  );

  const formatarBRL = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
      {/* Título */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">
          Evolução Mensal: Receita Bruta vs. Base Tributável PASEP (Jan–Out/2026)
        </h3>
      </div>

      {/* Área do Gráfico (Eixo Y Esquerdo + Plot Central + Eixo Y Direito) */}
      <div className="flex items-stretch gap-2">
        {/* Eixo Y Esquerdo */}
        <div className="w-14 shrink-0 h-[180px] flex flex-col justify-between text-[10px] text-slate-400 font-mono text-right pr-1 select-none">
          <span>R$ 2,4 mi</span>
          <span>R$ 1,8 mi</span>
          <span>R$ 1,2 mi</span>
          <span>R$ 0,6 mi</span>
          <span>R$ 0 mi</span>
        </div>

        {/* Container Central Sincronizado (Grid + Barras + Linha SVG + Rótulos X) */}
        <div className="flex-1 min-w-0">
          <div className="relative h-[180px] w-full">
            {/* Linhas de Grade de Fundo */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-dashed border-slate-200/80" />
              <div className="border-b border-dashed border-slate-200/80" />
              <div className="border-b border-dashed border-slate-200/80" />
              <div className="border-b border-dashed border-slate-200/80" />
              <div className="border-b border-slate-200" />
            </div>

            {/* Barras em Colunas Iguais */}
            <div className="relative z-10 h-full w-full flex items-end">
              {dados.map((d, idx) => {
                const hBruta = Math.min((d.receitaBruta / MAX_BARRA) * 100, 100);
                const hTributavel = Math.min((d.baseTributavel / MAX_BARRA) * 100, 100);
                const ativo =
                  hoveredIdx === idx ||
                  (competenciaSelecionada && competenciaSelecionada === d.competencia);
                const esmaecido =
                  competenciaSelecionada &&
                  competenciaSelecionada !== 'YTD' &&
                  competenciaSelecionada !== d.competencia;

                return (
                  <div
                    key={d.competencia}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`relative flex-1 h-full flex items-end justify-center gap-0.5 sm:gap-1 px-0.5 cursor-pointer transition-opacity ${
                      esmaecido ? 'opacity-35' : 'opacity-100'
                    }`}
                  >
                    {/* Barra Azul: Receita Bruta */}
                    <div
                      style={{ height: `${hBruta}%` }}
                      className={`w-2 sm:w-3 rounded-t-[3px] transition-colors ${
                        ativo ? 'bg-blue-700' : 'bg-blue-600'
                      }`}
                    />
                    {/* Barra Verde: Base Tributável */}
                    <div
                      style={{ height: `${hTributavel}%` }}
                      className={`w-2 sm:w-3 rounded-t-[3px] transition-colors ${
                        ativo ? 'bg-emerald-700' : 'bg-emerald-600'
                      }`}
                    />

                    {/* Tooltip Flutuante no Hover */}
                    {hoveredIdx === idx && (
                      <div
                        className={`absolute -top-2 z-30 w-48 bg-slate-900 text-white rounded-lg p-2.5 shadow-lg text-[10px] pointer-events-none ${
                          idx >= dados.length - 2 ? 'right-0' : idx <= 1 ? 'left-0' : 'left-1/2 -translate-x-1/2'
                        }`}
                      >
                        <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1 mb-1">
                          {d.mesRotulo} ({d.competencia})
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-blue-300">Receita Bruta:</span>
                          <span className="font-mono font-medium">{formatarBRL(d.receitaBruta)}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-emerald-300">Base PASEP:</span>
                          <span className="font-mono font-medium">{formatarBRL(d.baseTributavel)}</span>
                        </div>
                        <div className="flex justify-between gap-2 pt-0.5 mt-0.5 border-t border-slate-800">
                          <span className="text-indigo-300">PASEP (1%):</span>
                          <span className="font-mono font-bold">{formatarBRL(d.pasepDevido)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Linha Roxa do PASEP (SVG com viewBox sincronizado) */}
            {dados.length > 0 && (
              <>
                <svg
                  viewBox={`0 0 ${SVG_LARGURA} ${ALTURA_PLOT}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full z-20 pointer-events-none overflow-visible"
                >
                  <path
                    d={linhaD}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Pontos Circulares em HTML para manter proporção 1:1 em qualquer tela */}
                {pontosLinha.map((p, i) => (
                  <span
                    key={p.item.competencia}
                    style={{ left: `${p.xPct}%`, top: `${p.yPct}%` }}
                    className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-600 bg-white pointer-events-none transition-transform ${
                      hoveredIdx === i ? 'w-2.5 h-2.5 scale-110' : 'w-2 h-2'
                    }`}
                  />
                ))}
              </>
            )}
          </div>

          {/* Eixo X: Rótulos alinhados exatamente abaixo de cada coluna */}
          <div className="w-full flex items-center pt-2">
            {dados.map((d) => (
              <span
                key={d.competencia}
                className={`flex-1 text-center text-[10px] font-mono whitespace-nowrap ${
                  competenciaSelecionada === d.competencia
                    ? 'font-bold text-indigo-700'
                    : 'text-slate-500'
                }`}
              >
                {d.mesRotulo}
              </span>
            ))}
          </div>
        </div>

        {/* Eixo Y Direito (PASEP 1%) */}
        <div className="w-8 shrink-0 h-[180px] flex flex-col justify-between text-[10px] text-indigo-400 font-mono text-left pl-1 select-none">
          <span>22k</span>
          <span>17k</span>
          <span>11k</span>
          <span>6k</span>
          <span>0k</span>
        </div>
      </div>

      {/* Legenda Inferior */}
      <div className="flex items-center justify-center gap-6 pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
          <span>Receita Bruta</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
          <span>Base Tributável</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center w-4 justify-center relative">
            <span className="w-full h-0.5 bg-indigo-600" />
            <span className="w-1.5 h-1.5 rounded-full border border-indigo-600 bg-white absolute" />
          </span>
          <span className="text-indigo-700 font-medium">PASEP (1%)</span>
        </div>
      </div>
    </div>
  );
};
