// 📁 Caminho sugerido: backend/src/domain/entities/ApuracaoPasep.ts
import { ValorMonetario } from '../value-object/valor-monetario.js';
import { DomainError, ValorMonetarioInvalidoError } from '../errors/domain-errors.js';

export class ApuracaoPasep {
    public static readonly ALIQUOTA_PADRAO = 0.01; // 1%

    private readonly _competencia: string;
    private readonly _mesExtenso: string;
    private readonly _receitaBruta: ValorMonetario;
    private readonly _deducaoAneel: ValorMonetario;

    constructor(
        competencia: string,
        mesExtenso: string,
        receitaBruta: ValorMonetario,
        deducaoAneel: ValorMonetario,
    ) {

        const regexCompetencia = /^\d{4}-(0[1-9]|1[0-2])$/;
        if (!regexCompetencia.test(competencia)) {
            throw new DomainError('Competência inválida. Utilize o formato YYYY-MM (ex: 2026-01).');
        }
        if (!mesExtenso || mesExtenso.trim().length === 0) {
            throw new DomainError('Mês por extenso não pode ser vazio.');
        }
        if (deducaoAneel.centavos > receitaBruta.centavos) {
            throw new DomainError(
                'Inconsistência tributária: a dedução do Convênio ANEEL não pode ser maior que a receita bruta.',
            );
        }

        this._competencia = competencia;
        this._mesExtenso = mesExtenso;
        this._receitaBruta = receitaBruta;
        this._deducaoAneel = deducaoAneel;
    }

    public get competencia(): string {
        return this._competencia;
    }

    public get mesExtenso(): string {
        return this._mesExtenso;
    }

    public get receitaBruta(): ValorMonetario {
        return this._receitaBruta;
    }

    public get deducaoAneel(): ValorMonetario {
        return this._deducaoAneel;
    }

    public get baseTributavel(): ValorMonetario {
        return this._receitaBruta.subtrair(this.deducaoAneel)
    }

    public get pasepDevido(): ValorMonetario {
        const centavosPasep = Math.round(
            this.baseTributavel.centavos * ApuracaoPasep.ALIQUOTA_PADRAO,
        );
        return ValorMonetario.deCentavos(centavosPasep);
    }
}