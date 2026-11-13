import React from 'react';

export const Header: React.FC = () => {
  const handleLogout = () => {
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header className="w-full bg-[#0b1329] border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Identidade Institucional ARPE */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
            <svg className="w-5 h-5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2 2 7h20L12 2Z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>ARPE / Acompanhamento Orçamentário & PASEP</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Agência Reguladora de Serviços Públicos Delegados do Estado de PE
            </p>
          </div>
        </div>

        {/* Status Central: Competência */}
        <div className="hidden md:flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
            <span>
              Exercício: <strong className="text-white font-medium">Jan–Out / 2026</strong>
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-slate-400">Base Consolidada</span>
          </div>
        </div>

        {/* Lado Direito: Perfil & Sessão */}
        <div className="flex items-center gap-3.5">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
            <span>Sessão Segura • JWT Ativo</span>
          </div>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-white leading-tight">Diretoria Executiva</div>
              <div className="text-[10px] text-slate-400 leading-tight">Auditoria Interna</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
              DA
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Trocar de sessão / Ir para Login"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
