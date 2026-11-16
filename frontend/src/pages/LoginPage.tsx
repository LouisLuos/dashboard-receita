import React, { useState } from 'react';
import { autenticarGestor } from '../services/authService';

interface LoginPageProps {
  onLoginSucesso?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSucesso }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro(null);

    if (!email.trim() || !senha) {
      setErro('Informe o e-mail institucional e a senha.');
      return;
    }

    setCarregando(true);
    try {
      await autenticarGestor(email, senha);
      if (onLoginSucesso) {
        onLoginSucesso();
      } else {
        window.location.pathname = '/';
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado ao autenticar.');
    } finally {
      setCarregando(false);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <div
              role="alert"
              className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-xs text-red-300"
            >
              {erro}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">
              E-mail Institucional
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gestor@arpe.pe.gov.br"
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-xs font-medium text-slate-300 mb-1">
              Credencial de Segurança
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{carregando ? 'Autenticando...' : 'Autenticar com Credencial JWT'}</span>
            {!carregando && (
              <svg className="w-3.5 h-3.5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

