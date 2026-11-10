// 📁 Caminho: src/application/use-cases/calcular-kpis-financeiros.use-case.ts
import { DadosNaoEncontradosError } from "../errors/application-errors.js";
import { KpiFinanceiros } from "../../domain/entities/KpisFinanceiros.js";
import { ValorMonetario } from "../../domain/value-object/valor-monetario.js";
import { KpisOutputDTO } from "../dtos/kpis-output.dto.js";
import { IReceitaRepository } from "../ports/IReceitaRepository.js";


export class CalcularKpisFinanceirosUseCase {
    constructor(private readonly kpiRepo: IReceitaRepository) {}
    
    async executar(): Promise<KpisOutputDTO> {
        const data = await this.kpiRepo.obterDadosConsolidados();

        if (!data) {
            throw new DadosNaoEncontradosError("Dados não encontrados");
        }

        // 1. Busca os valores de COMPESA e COPERGÁS na base
        const compesaYTD = data.fontes.find(f => f.id === 'tfsd_compesa')?.totalYTD ?? 0;
        const copergasYTD = data.fontes.find(f => f.id === 'tfsd_copergas')?.totalYTD ?? 0;
        const totalEstatais = ValorMonetario.de(compesaYTD + copergasYTD);

        // 2. Instancia a Entidade de Domínio (ela executa as regras e cálculos)
        const kpis = new KpiFinanceiros(
            ValorMonetario.de(data.arrecadacaoTotalYTD),
            ValorMonetario.de(data.totalPasepYTD),
            data.competencias.length,
            totalEstatais
        );

        // 3. Monta e devolve o DTO completo para o Frontend
        return {
            arrecadacaoTotal: kpis.total.valor,
            arrecadacaoFormatada: kpis.total.formatarBRL(),
            mediaMensal: kpis.mediaMensal.valor,
            mediaMensalFormatada: kpis.mediaMensal.formatarBRL(),
            totalPasep: kpis.pasep.valor,
            totalPasepFormatado: kpis.pasep.formatarBRL(),
            percentualConcentracaoTop2: kpis.percentualConcentracao,
            alertaRiscoConcentracao: kpis.temAlertaRiscoConcentracao,
        };
    }
}