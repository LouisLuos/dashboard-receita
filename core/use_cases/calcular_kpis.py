"""
Caso de Uso: CalcularKPIsUseCase
Responsável por orquestrar a obtenção dos dados através da Porta IReceitaRepository,
calcular indicadores estratégicos e consolidar o relatório executivo para o Dashboard.
"""
from typing import Dict, List
from core.domain.models import CompetenciaMensal, ResumoExecutivoKPIs, AnomaliaOuNota
from core.ports.repository import IReceitaRepository


class CalcularKPIsUseCase:
    def __init__(self, repository: IReceitaRepository):
        self._repository = repository

    def executar(self) -> ResumoExecutivoKPIs:
        competencias = self._repository.obter_competencias()
        anomalias = self._repository.obter_anomalias_e_notas()

        if not competencias:
            raise ValueError("Nenhuma competência encontrada para cálculo de KPIs.")

        # Filtra apenas competências com dados lançados (total > 0)
        competencias_ativas = [c for c in competencias if c.total_arrecadado > 0]
        qtd_meses = len(competencias_ativas)

        total_ytd = sum(c.total_arrecadado for c in competencias_ativas)
        total_pasep_ytd = sum(c.recolhimento_pasep for c in competencias_ativas)
        media_mensal = total_ytd / qtd_meses if qtd_meses > 0 else 0.0

        # Totais por fonte de receita
        totais_fonte: Dict[str, float] = {
            "COMPESA (Saneamento)": sum(c.tfsd_compesa for c in competencias_ativas),
            "COPERGÁS (Gás Canalizado)": sum(c.tfsd_copergas for c in competencias_ativas),
            "TFSI (OS / OSCIP)": sum(c.tfsi_os_oscip for c in competencias_ativas),
            "Receitas Financeiras (Tesouraria)": sum(c.receitas_financeiras for c in competencias_ativas),
            "Convênio ANEEL (Energia Elétrica)": sum(c.receita_aneel for c in competencias_ativas),
            "Rota do Atlântico (Rodovia)": sum(c.tfsd_rota_atlantico for c in competencias_ativas),
            "Rota dos Coqueiros (Rodovia)": sum(c.tfsd_rota_coqueiros for c in competencias_ativas),
            "Multa COMPESA": sum(c.multa_compesa for c in competencias_ativas),
            "SOCICAM (Terminais)": sum(c.tfsd_socicam for c in competencias_ativas),
        }

        # Percentuais de concentração sobre o total YTD
        percentuais_fonte: Dict[str, float] = {
            k: (v / total_ytd * 100) if total_ytd > 0 else 0.0
            for k, v in totais_fonte.items()
        }

        # Identificação da maior fonte e Top 2
        fontes_ordenadas = sorted(percentuais_fonte.items(), key=lambda item: item[1], reverse=True)
        maior_fonte_nome, maior_fonte_pct = fontes_ordenadas[0]
        top2_pct = fontes_ordenadas[0][1] + fontes_ordenadas[1][1]

        # Detecção de anomalias operacionais (ex: meses com receita de rodovia zerada)
        anomalias_operacionais: List[AnomaliaOuNota] = list(anomalias)
        for c in competencias_ativas:
            if c.tfsd_rota_coqueiros == 0.0:
                anomalias_operacionais.append(
                    AnomaliaOuNota(
                        mes=c.mes_sigla,
                        descricao=f"Repasse zerado da Concessionária Rota dos Coqueiros em {c.mes_nome}.",
                        acao_sugerida="Auditar se houve compensação de saldo ou inadimplência de tarifa."
                    )
                )
            if c.tfsd_rota_atlantico == 0.0:
                anomalias_operacionais.append(
                    AnomaliaOuNota(
                        mes=c.mes_sigla,
                        descricao=f"Repasse zerado da Concessionária Rota do Atlântico em {c.mes_nome}.",
                        acao_sugerida="Verificar histórico de conciliação bancária do mês anterior."
                    )
                )

        return ResumoExecutivoKPIs(
            total_arrecadado_ytd=round(total_ytd, 2),
            media_mensal=round(media_mensal, 2),
            total_pasep_apurado_ytd=round(total_pasep_ytd, 2),
            concentracao_por_fonte={k: round(v, 2) for k, v in totais_fonte.items()},
            concentracao_percentual={k: round(v, 2) for k, v in percentuais_fonte.items()},
            maior_fonte=maior_fonte_nome,
            maior_fonte_percentual=round(maior_fonte_pct, 2),
            top2_fontes_percentual=round(top2_pct, 2),
            meses_disponiveis=[c.mes_sigla for c in competencias_ativas],
            anomalias_detectadas=anomalias_operacionais
        )

