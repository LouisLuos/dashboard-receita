import React from 'react';

export interface FilterBarProps {
  periodoSelecionado?: string;
  onPeriodoChange?: (periodo: string) => void;
  categoriaSelecionada?: string;
  onCategoriaChange?: (categoria: string) => void;
  onExportarCsv?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  periodoSelecionado = 'YTD',
  onPeriodoChange,
  categoriaSelecionada = 'TODAS',
  onCategoriaChange,
  onExportarCsv,
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filtros em Select */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Período */}
          <div className="relative">
            <select
              value={periodoSelecionado}
              onChange={(e) => onPeriodoChange?.(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg pl-3 pr-8 py-2 hover:bg-slate-100/80 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="YTD">Acumulado YTD (Jan–Out/2026)</option>
              <option value="2026-10">Outubro / 2026</option>
              <option value="2026-09">Setembro / 2026</option>
              <option value="2026-08">Agosto / 2026</option>
              <option value="2026-07">Julho / 2026</option>
              <option value="2026-06">Junho / 2026</option>
              <option value="2026-05">Maio / 2026</option>
              <option value="2026-04">Abril / 2026</option>
              <option value="2026-03">Março / 2026</option>
              <option value="2026-02">Fevereiro / 2026</option>
              <option value="2026-01">Janeiro / 2026</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-3.5 h-3.5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Seletor de Categoria */}
          <div className="relative">
            <select
              value={categoriaSelecionada}
              onChange={(e) => onCategoriaChange?.(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg pl-3 pr-8 py-2 hover:bg-slate-100/80 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="TODAS">Todas as Fontes</option>
              <option value="TFSD">TFSD (Concessionárias)</option>
              <option value="TFSI">TFSI (Organizações Sociais)</option>
              <option value="CONVENIO_ANEEL">Convênio ANEEL</option>
              <option value="PATRIMONIAL">Patrimoniais & Multas</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-3.5 h-3.5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Botão Exportar Memória */}
        <button
          type="button"
          onClick={onExportarCsv}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-slate-500 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          <span>Exportar Memória (DARF/PASEP)</span>
        </button>
      </div>
    </div>
  );
};
