"""
Domínio Puro: Entidades e Value Objects do sistema de Receitas e PASEP.
Regra de Dependência: Este módulo NÃO importa bibliotecas externas ou frameworks.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass(frozen=True)
class ReceitaItem:
    categoria: str          # ex: "TFSD", "TFSI", "CONVENIO", "PATRIMONIAL", "MULTA"
    origem: str             # ex: "COMPESA", "COPERGÁS", "ANEEL", "APLICAÇÕES"
    competencia: str        # ex: "JAN", "FEV", ..., "OUT"
    mes_numero: int         # 1 a 12
    valor: float


@dataclass
class AnomaliaOuNota:
    mes: str
    descricao: str
    impacto_financeiro: Optional[float] = None
    acao_sugerida: str = ""


@dataclass
class CompetenciaMensal:
    mes_sigla: str          # ex: "JAN"
    mes_nome: str           # ex: "Janeiro"
    mes_numero: int
    tfsd_compesa: float = 0.0
    tfsd_copergas: float = 0.0
    tfsd_rota_atlantico: float = 0.0
    tfsd_rota_coqueiros: float = 0.0
    tfsd_socicam: float = 0.0
    tfsi_os_oscip: float = 0.0
    receita_aneel: float = 0.0
    multa_compesa: float = 0.0
    receitas_financeiras: float = 0.0
    total_arrecadado: float = 0.0
    base_calculo_pasep: float = 0.0
    recolhimento_pasep: float = 0.0


@dataclass
class ResumoExecutivoKPIs:
    total_arrecadado_ytd: float
    media_mensal: float
    total_pasep_apurado_ytd: float
    concentracao_por_fonte: Dict[str, float]
    concentracao_percentual: Dict[str, float]
    maior_fonte: str
    maior_fonte_percentual: float
    top2_fontes_percentual: float
    meses_disponiveis: List[str]
    anomalias_detectadas: List[AnomaliaOuNota] = field(default_factory=list)

