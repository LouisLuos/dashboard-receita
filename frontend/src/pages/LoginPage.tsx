import React from 'react';

interface LoginPageProps {
  onLoginSucesso?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSucesso }) => {
  const handleDemoLogin = () => {
    // Simula armazenamento de token JWT
    localStorage.setItem('arpe_jwt_token', 'demo-token-jwt-executivo');
    if (onLoginSucesso) {
      onLoginSucesso();
    } else {
      window.location.pathname = '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Identidade / Brasão */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
            <svg className="w-6 h-6 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2 2 7h20L12 2Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">ARPE / Pernambuco</h1>
          <p className="text-xs text-slate-400">
            Portal de Inteligência Orçamentária & PASEP (Exercício 2026)
          </p>
        </div>

        {/* Informação Institucional */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Acesso Restrito
          </div>
          <p className="text-[11px] text-slate-400">
            Ambiente reservado para a Diretoria Executiva e Auditoria Interna.
          </p>
        </div>

        {/* Formulário / Ação */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Institucional</label>
            <input 
              type="email" 
              defaultValue="auditoria@arpe.pe.gov.br" 
              disabled 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Credencial de Segurança</label>
            <input 
              type="password" 
              defaultValue="••••••••••••" 
              disabled 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 cursor-not-allowed"
            />
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Autenticar com Credencial JWT</span>
            <svg className="w-3.5 h-3.5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

