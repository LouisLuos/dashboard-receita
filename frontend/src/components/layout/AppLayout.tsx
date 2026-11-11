import React from 'react';
import { Header } from './Header';
import { FilterBar } from './FilterBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Header Institucional ARPE */}
      <Header />

      {/* 2. Barra Superior de Filtros */}
      <FilterBar />

      {/* 3. Conteúdo Dinâmico da Página */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {children}
      </main>
    </div>
  );
};

