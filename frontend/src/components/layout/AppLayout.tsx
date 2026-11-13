import React from 'react';
import { Header } from './Header';
import { FilterBar, type FilterBarProps } from './FilterBar';

interface AppLayoutProps extends FilterBarProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  periodoSelecionado,
  onPeriodoChange,
  categoriaSelecionada,
  onCategoriaChange,
  onExportarCsv,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1 & 2. Header Institucional + Barra de Filtros Fixos no Topo ao Rolar */}
      <div className="sticky top-0 z-40 shadow-xs">
        <Header />

        <FilterBar
          periodoSelecionado={periodoSelecionado}
          onPeriodoChange={onPeriodoChange}
          categoriaSelecionada={categoriaSelecionada}
          onCategoriaChange={onCategoriaChange}
          onExportarCsv={onExportarCsv}
        />
      </div>

      {/* 3. Conteúdo Dinâmico da Página */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {children}
      </main>
    </div>
  );
};
