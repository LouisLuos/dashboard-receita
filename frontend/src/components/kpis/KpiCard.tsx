import React from 'react';

interface KpiCardProps {
  titulo: string;
  valor: string;
  subtexto?: string;
  badge?: string;
  badgeTipo?: 'info' | 'alerta';
  corIcone?: 'azul' | 'verde' | 'roxo' | 'vermelho';
  destaqueAlerta?: boolean;
  children?: React.ReactNode;
  icone: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  titulo,
  valor,
  subtexto,
  badge,
  badgeTipo = 'info',
  corIcone = 'azul',
  destaqueAlerta = false,
  children,
  icone,
}) => {
  // Configuração das cores de fundo dos ícones estilo clean fintech
  const coresIconeMap = {
    azul: 'bg-blue-50 text-blue-600',
    verde: 'bg-emerald-50 text-emerald-600',
    roxo: 'bg-purple-50 text-purple-600',
    vermelho: 'bg-rose-50 text-rose-600',
  };

  return (
    <div
      className={`relative bg-white rounded-xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
        destaqueAlerta
          ? 'border-rose-400/90 ring-1 ring-rose-400/20'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Topo do Card: Título e Ícone */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-xs font-semibold text-slate-500 leading-tight">
          {titulo}
        </h3>
        <div className={`p-2 rounded-lg shrink-0 ${coresIconeMap[corIcone]}`}>
          {icone}
        </div>
      </div>

      {/* Valor Principal (Fonte destacada estilo GovTech) */}
      <div className="mb-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          {valor}
        </span>
      </div>

      {/* Conteúdo Customizado (Ex: Barra de Progresso) ou Subtexto */}
      <div className="mt-auto pt-1">
        {children}

        {subtexto && (
          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
            {subtexto}
          </p>
        )}

        {/* Badge Informativo ou de Alerta */}
        {badge && (
          <div className="mt-2.5">
            {badgeTipo === 'alerta' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 border border-rose-200 text-rose-700">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                {badge}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 border border-purple-200/60 text-purple-700">
                {badge}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

