"""
Porta Dirigida (Driven / Outbound Port): Interface que define o contrato de obtenção dos dados.
O Core depende desta abstração, e nunca de implementações concretas (Dependency Inversion Principle - DIP).
"""
from abc import ABC, abstractmethod
from typing import List, Tuple
from core.domain.models import CompetenciaMensal, AnomaliaOuNota


class IReceitaRepository(ABC):
    @abstractmethod
    def obter_competencias(self) -> List[CompetenciaMensal]:
        """Retorna os dados consolidados mês a mês."""
        pass

    @abstractmethod
    def obter_anomalias_e_notas(self) -> List[AnomaliaOuNota]:
        """Retorna notas fiscais e anomalias registradas na origem."""
        pass

