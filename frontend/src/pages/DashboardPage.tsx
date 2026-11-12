import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { KpiGrid } from '../components/kpis/KpiGrid';
import { PasepMemoriaTable } from '../components/pasep/PasepMemoriaTable';
import { obterKpisConsolidados, obterMemoriaPasep } from '../services/receitaService';
import type { KpisOutputDTO, PasepConsolidadoOutputDTO } from '../types/receita';

export const DashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<KpisOutputDTO | null>(null);
  const [pasep, setPasep] = useState<PasepConsolidadoOutputDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro(null);
      const [dadosKpis, dadosPasep] = await Promise.all([
        obterKpisConsolidados(),
        obterMemoriaPasep(),
      ]);
      setKpis(dadosKpis);
      setPasep(dadosPasep);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <AppLayout>
      {/* Banner de Erro com Ação de Retry se a API falhar */}
      {erro && (
        <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-start justify-between gap-4 shadow-xs">
          <div>
            <strong className="font-semibold block mb-1">Aviso de Comunicação com a API:</strong>
            <span>{erro}</span>
          </div>
          <button
            onClick={carregarDados}
            className="shrink-0 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Grid de 4 Cards de KPIs Executivos (HU-01) */}
      <section>
        <KpiGrid dados={kpis} loading={loading} erro={null} />
      </section>

      {/* Memória de Cálculo Mensal Auditável do PASEP 1% (HU-02) */}
      <section>
        <PasepMemoriaTable dados={pasep} loading={loading} />
      </section>
    </AppLayout>
  );
};
