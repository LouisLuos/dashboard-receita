
import { ValorMonetario } from "../value-object/valor-monetario.js";

export class KpiFinanceiros {
    private readonly arrecadacaoTotal: ValorMonetario;
    private readonly totalPasep: ValorMonetario;
    private readonly quantidadeCompetencias: number;
    private readonly totalEstataisTop2: ValorMonetario;

    public static readonly LIMIAR_RISCO_FISCAL = 80.0;

    constructor(
        arrecadacaoTotal: ValorMonetario,
        totalPasep: ValorMonetario, 
        
        // Se refere ao mês de referencia do dinheiro (competência) 
        quantidadeCompetencias: number,
        totalEstataisTop2: ValorMonetario
    ) {
        if (arrecadacaoTotal.valor <= 0) {
            throw new Error("Valor de arrecadação inválido: deve ser maior que zero.");
        }

        if (quantidadeCompetencias <= 0 || !Number.isInteger(quantidadeCompetencias)) {
            throw new Error("A quantidade de competências deve ser um número inteiro maior que zero.");
        }

        if (totalEstataisTop2.valor > arrecadacaoTotal.valor) {
            throw new Error("Inconsistência orçamentária: o total das estatais não pode ser maior que a arrecadação total.");
        }

        this.arrecadacaoTotal = arrecadacaoTotal;
        this.totalPasep = totalPasep;
        this.quantidadeCompetencias = quantidadeCompetencias;
        this.totalEstataisTop2 = totalEstataisTop2;
    }

    public get total(): ValorMonetario {
        return this.arrecadacaoTotal;
    }

    public get pasep(): ValorMonetario {
        return this.totalPasep;
    }

    public get meses(): number {
        return this.quantidadeCompetencias;
    }

    public get estataisTop2(): ValorMonetario {
        return this.totalEstataisTop2;
    }

    public get mediaMensal(): ValorMonetario {
        const media = this.arrecadacaoTotal.valor / this.quantidadeCompetencias;
        return ValorMonetario.de(media);
    }

    public get percentualConcentracao(): number {
        const proporcao = (this.totalEstataisTop2.valor / this.arrecadacaoTotal.valor) * 100;
        return Math.round(proporcao * 100) / 100;
    }

    public get temAlertaRiscoConcentracao(): boolean {
        return this.percentualConcentracao >= KpiFinanceiros.LIMIAR_RISCO_FISCAL;
    }
}