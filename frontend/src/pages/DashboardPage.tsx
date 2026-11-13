import React, { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { KpiGrid } from '../components/kpis/KpiGrid';
import { EvolucaoMensalChart } from '../components/charts/EvolucaoMensalChart';
import { ShareDonutChart } from '../components/charts/ShareDonutChart';
import { PasepMemoriaTable } from '../components/pasep/PasepMemoriaTable';
import {
  obterKpisConsolidados,
  obterMemoriaPasep,
  obterGraficosDashboard,
} from '../services/receitaService';
import type {
  KpisOutputDTO,
  PasepConsolidadoOutputDTO,
  GraficosDashboardOutputDTO,
} from '../types/receita';

export const DashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<KpisOutputDTO | null>(null);
  const [pasep, setPasep] = useState<PasepConsolidadoOutputDTO | null>(null);
  const [graficos, setGraficos] = useState<GraficosDashboardOutputDTO | null>(null);
  const [periodo, setPeriodo] = useState<string>('YTD');
  const [categoria, setCategoria] = useState<string>('TODAS');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro(null);
      const [dadosKpis, dadosPasep, dadosGraficos] = await Promise.all([
        obterKpisConsolidados(),
        obterMemoriaPasep(),
        obterGraficosDashboard(),
      ]);
      setKpis(dadosKpis);
      setPasep(dadosPasep);
      setGraficos(dadosGraficos);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const shareFiltrado = useMemo(() => {
    const lista = graficos?.distribuicaoShare ?? [];
    if (categoria === 'TODAS') return lista;
    return lista.filter((item) => item.categoria === categoria);
  }, [graficos, categoria]);

  const exportarMemoriaCsv = () => {
    if (!pasep) return;

    const cabecalho = [
      'Competência',
      'Mês',
      'Receita Bruta (R$)',
      'Dedução ANEEL (R$)',
      'Base Tributável (R$)',
      'Alíquota (%)',
      'PASEP Devido (R$)',
    ];

    const linhas = pasep.meses.map((m) => [
      m.competencia,
      m.mesExtenso,
      m.receitaBruta.toFixed(2),
      m.deducaoAneel.toFixed(2),
      m.baseTributavel.toFixed(2),
      m.aliquotaPercentual.toFixed(2),
      m.pasepDevido.toFixed(2),
    ]);

    const csvConteudo = '\uFEFF' + [cabecalho, ...linhas].map((l) => l.join(';')).join('\n');
    const blob = new Blob([csvConteudo], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'memoria-calculo-pasep-2026.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout
      periodoSelecionado={periodo}
      onPeriodoChange={setPeriodo}
      categoriaSelecionada={categoria}
      onCategoriaChange={setCategoria}
      onExportarCsv={exportarMemoriaCsv}
    >
      {/* Banner de Erro com Ação de Retry se a API falhar */}
      {erro && (
        <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 flex items-start justify-between gap-4 shadow-xs">
          <div>
            <strong className="font-semibold block mb-1">Aviso de Comunicação com a API:</strong>
            <span>{erro}</span>
          </div>
          <button
            onClick={carregarDados}
            className="shrink-0 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* 1. Grid de 4 Cards de KPIs Executivos (HU-01) */}
      <section>
        <KpiGrid
          dados={kpis}
          baseTributavelFormatada={pasep?.resumoYTD.baseTributavelTotalFormatada}
          quantidadeCompetencias={pasep?.meses.length}
          shareFatias={graficos?.distribuicaoShare}
          loading={loading}
          erro={null}
        />
      </section>

      {/* 2. Seção de Gráficos Analíticos Lado a Lado (HU-03) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EvolucaoMensalChart
          dados={graficos?.evolucaoMensal ?? []}
          competenciaSelecionada={periodo}
          loading={loading}
        />
        <ShareDonutChart dados={shareFiltrado} loading={loading} />
      </section>

      {/* 3. Memória de Cálculo Mensal Auditável do PASEP 1% (HU-02) */}
      <section>
        <PasepMemoriaTable
          dados={pasep}
          competenciaFiltro={periodo}
          loading={loading}
        />
      </section>
    </AppLayout>
  );
};
