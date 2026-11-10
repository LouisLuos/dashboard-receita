import { ValorMonetarioInvalidoError } from '../errors/domain-errors.js';

export class ValorMonetario {
    private readonly _valorEmCentavos: number
    
private constructor(valor: number) {
    if (isNaN(valor) || !isFinite(valor)) {
        throw new ValorMonetarioInvalidoError('Valor monetário inválido: deve ser um número finito.');
    } 

    if (valor < 0) {
        throw new ValorMonetarioInvalidoError('Valor monetário não pode ser negativo em receitas orçamentárias.');
    } 

    // Agora este comando roda para qualquer número válido!
    this._valorEmCentavos = Math.round(valor * 100);
}


    public static de(valor: number): ValorMonetario {
        return new ValorMonetario(valor)
    }

    public static deCentavos(valor: number): ValorMonetario {
        return new ValorMonetario(valor / 100)
    }

    public static zero(): ValorMonetario {
        return new ValorMonetario(0)
    }

    public get valor(): number {
        return this._valorEmCentavos / 100
    }

    public get centavos(): number {
        return this._valorEmCentavos;
    }

    public somar(outro: ValorMonetario): ValorMonetario {
        return ValorMonetario.deCentavos(this._valorEmCentavos + outro._valorEmCentavos)
    }

    public subtrair(outro: ValorMonetario): ValorMonetario {
        const result = this._valorEmCentavos - outro._valorEmCentavos

        if (result < 0) {
            throw new ValorMonetarioInvalidoError('Operação inválida: a dedução não pode resultar em valor negativo.');
        }

        return ValorMonetario.deCentavos(result)
    }

    public formatarBRL(): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(this.valor);
    }


}