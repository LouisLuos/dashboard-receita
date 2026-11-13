// 📁 Caminho: backend/src/domain/entities/FonteShare.ts
import { ValorMonetario } from '../value-object/valor-monetario.js';
import { CategoriaReceita } from '../types/categoria-receita.js';
import { DomainError } from '../errors/domain-errors.js';

export class FonteShare {
  private readonly _id: string;
  private readonly _nome: string;
  private readonly _categoria: CategoriaReceita;
  private readonly _valorTotal: ValorMonetario;
  private readonly _totalGeral: ValorMonetario;
  private readonly _isIsentoPasep: boolean;

  constructor(
    id: string,
    nome: string,
    categoria: CategoriaReceita,
    valorTotal: ValorMonetario,
    totalGeral: ValorMonetario,
    isIsentoPasep = false,
  ) {
    if (!id || id.trim().length === 0) {
      throw new DomainError('Identificador da fonte de receita não pode ser vazio.');
    }

    if (!nome || nome.trim().length === 0) {
      throw new DomainError('Nome da fonte de receita não pode ser vazio.');
    }

    if (totalGeral.centavos <= 0) {
      throw new DomainError(
        'Inconsistência orçamentária: o total geral de referência deve ser maior que zero para cálculo de share.',
      );
    }

    if (valorTotal.centavos > totalGeral.centavos) {
      throw new DomainError(
        'Inconsistência orçamentária: o valor da fonte não pode ser superior à arrecadação total geral.',
      );
    }

    this._id = id;
    this._nome = nome;
    this._categoria = categoria;
    this._valorTotal = valorTotal;
    this._totalGeral = totalGeral;
    this._isIsentoPasep = isIsentoPasep;
  }

  public get id(): string {
    return this._id;
  }

  public get nome(): string {
    return this._nome;
  }

  public get categoria(): CategoriaReceita {
    return this._categoria;
  }

  public get valorTotal(): ValorMonetario {
    return this._valorTotal;
  }

  public get isIsentoPasep(): boolean {
    return this._isIsentoPasep;
  }

  public get percentualShare(): number {
    const proporcao = (this._valorTotal.valor / this._totalGeral.valor) * 100;
    return Math.round(proporcao * 100) / 100;
  }

  public get percentualFormatado(): string {
    return `${this.percentualShare.toFixed(2).replace('.', ',')}%`;
  }
}

