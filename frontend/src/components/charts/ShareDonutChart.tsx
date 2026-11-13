import React, { useState } from 'react';
import type { ShareFonteItemDTO } from '../../types/receita';

interface ShareDonutChartProps {
  dados: ShareFonteItemDTO[];
  loading?: boolean;
}

const CORES = [
  '#2563eb', // Azul Royal (COMPESA)
  '#7c3aed', // Roxo (COPERGÁS)
  '#059669', // Verde Esmeralda (Patrimoniais & Multas)
  '#ea580c', // Laranja (TFSI)
  '#94a3b8', // Cinza Slate (Convênio ANEEL)
  '#dc2626', // Vermelho (Rodovias & SOCICAM)
];

const ROTULOS_CATEGORIA: Record<string, string> = {
  TFSD: 'TFSD (Concessionárias)',
  PATRIMONIAL: 'Patrimoniais & Multas',
  TFSI: 'TFSI (Organizações Sociais)',
  CONVENIO_ANEEL: 'Convênio ANEEL (Repasse)',
  MULTAS: 'Multas Contratuais',
};

export const ShareDonutChart: React.FC<ShareDonutChartProps> = ({ dados, loading }) => {
  const [modoVisao, setModoVisao] = useState<'fonte' | 'grupo'>('fonte');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 h-[330px] flex flex-col justify-between animate-pulse">
        <div className="h-4 w-56 bg-slate-200 rounded" />
        <div className="flex items-center gap-6">
          <div className="w-36 h-36 rounded-full bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-3.5 bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const fatiasExibidas = modoVisao === 'fonte' ? dados : agruparPorCategoria(dados);

  const raio = 62;
  const raioInterno = 36;
  const cx = 76;
  const cy = 76;

  let anguloAcumulado = 0;
  const arcosSvg = fatiasExibidas.map((item, idx) => {
    const anguloBruto = (item.percentualShare / 100) * 360;
    const angulo = Math.min(anguloBruto, 359.99);
    const inicio = anguloAcumulado;
    const fim = anguloAcumulado + angulo;
    anguloAcumulado += angulo;

    // -90 graus para começar exatamente no topo (12h) no sentido horário
    const inicioRad = ((inicio - 90) * Math.PI) / 180;
    const fimRad = ((fim - 90) * Math.PI) / 180;

    const x1 = cx + raio * Math.cos(inicioRad);
    const y1 = cy + raio * Math.sin(inicioRad);
    const x2 = cx + raio * Math.cos(fimRad);
    const y2 = cy + raio * Math.sin(fimRad);

    const x3 = cx + raioInterno * Math.cos(fimRad);
    const y3 = cy + raioInterno * Math.sin(fimRad);
    const x4 = cx + raioInterno * Math.cos(inicioRad);
    const y4 = cy + raioInterno * Math.sin(inicioRad);

    const grandeArco = angulo > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${raio} ${raio} 0 ${grandeArco} 1 ${x2} ${y2} L ${x3} ${y3} A ${raioInterno} ${raioInterno} 0 ${grandeArco} 0 ${x4} ${y4} Z`;

    return {
      d,
      cor: CORES[idx % CORES.length],
      item,
    };
  });

  const fatiaAtiva = hoveredIdx !== null ? fatiasExibidas[hoveredIdx] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
      {/* Cabeçalho com Alternador "Por Fonte / Por Grupo" */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight leading-snug">
          Participação Orçamentária por Fonte de Receita (Share)
        </h3>

        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px] font-medium shrink-0">
          <button
            type="button"
            onClick={() => setModoVisao('fonte')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              modoVisao === 'fonte'
                ? 'bg-white shadow-2xs text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Por Fonte
          </button>
          <button
            type="button"
            onClick={() => setModoVisao('grupo')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              modoVisao === 'grupo'
                ? 'bg-white shadow-2xs text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Por Grupo
          </button>
        </div>
      </div>

      {/* Conteúdo: Donut na Esquerda + Legenda Detalhada na Direita */}
      <div className="flex flex-col sm:flex-row items-center gap-5 my-auto">
        {/* Gráfico Donut SVG */}
        <div className="relative shrink-0 flex items-center justify-center w-[152px] h-[152px]">
          <svg width="152" height="152" viewBox="0 0 152 152">
            {arcosSvg.map((arco, i) => {
              const ativo = hoveredIdx === i;
              const esmaecido = hoveredIdx !== null && !ativo;
              return (
                <path
                  key={arco.item.id}
                  d={arco.d}
                  fill={arco.cor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`transition-all duration-150 cursor-pointer ${
                    esmaecido ? 'opacity-45' : 'opacity-100'
                  }`}
                />
              );
            })}
          </svg>

          {/* Centro do Donut: mostra detalhe ao passar o mouse */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
            {fatiaAtiva ? (
              <>
                <span className="text-[11px] font-bold text-slate-900 font-mono">
                  {fatiaAtiva.percentualFormatado}
                </span>
                <span className="text-[9px] text-slate-500 leading-tight line-clamp-2 max-w-[64px]">
                  {fatiaAtiva.nome.split('(')[0]}
                </span>
              </>
            ) : (
              <span className="text-[10px] font-medium text-slate-400">YTD 2026</span>
            )}
          </div>
        </div>

        {/* Lista Detalhada das Fatias */}
        <div className="flex-1 w-full min-w-0 space-y-2.5">
          {fatiasExibidas.map((item, idx) => {
            const ativo = hoveredIdx === idx;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between gap-2 rounded-md px-1.5 py-0.5 -mx-1.5 transition-colors cursor-pointer ${
                  ativo ? 'bg-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CORES[idx % CORES.length] }}
                  />
                  <span
                    className="truncate text-slate-700 font-medium text-[11px]"
                    title={item.nome}
                  >
                    {item.nome}
                  </span>
                  {item.isIsentoPasep && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0 leading-none">
                      Isento PASEP
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0 font-mono text-[11px] tabular-nums whitespace-nowrap">
                  <span className="text-slate-500">{item.valorFormatado}</span>
                  <span className="font-bold text-slate-900 w-12 text-right">
                    {item.percentualFormatado}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function agruparPorCategoria(dados: ShareFonteItemDTO[]): ShareFonteItemDTO[] {
  const mapa = new Map<string, { centavos: number; share: number; isento: boolean }>();

  dados.forEach((d) => {
    const atual = mapa.get(d.categoria) ?? { centavos: 0, share: 0, isento: Boolean(d.isIsentoPasep) };
    mapa.set(d.categoria, {
      centavos: atual.centavos + Math.round(d.valorTotal * 100),
      share: Math.round((atual.share + d.percentualShare) * 100) / 100,
      isento: atual.isento || Boolean(d.isIsentoPasep),
    });
  });

  return Array.from(mapa.entries())
    .map(([cat, v]) => {
      const valorTotal = v.centavos / 100;
      return {
        id: cat,
        nome: ROTULOS_CATEGORIA[cat] ?? cat,
        categoria: cat,
        valorTotal,
        valorFormatado: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(valorTotal),
        percentualShare: v.share,
        percentualFormatado: `${v.share.toFixed(2).replace('.', ',')}%`,
        isIsentoPasep: v.isento,
      };
    })
    .sort((a, b) => b.valorTotal - a.valorTotal);
}
