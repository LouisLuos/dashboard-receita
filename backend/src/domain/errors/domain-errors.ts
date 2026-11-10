// 📁 Caminho: src/domain/errors/domain-errors.ts

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValorMonetarioInvalidoError extends DomainError {
  constructor(message = 'Valor monetário inválido: deve ser um número finito e não negativo.') {
    super(message);
    this.name = 'ValorMonetarioInvalidoError';
  }
}

export class KpiInconsistenteError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'KpiInconsistenteError';
  }
}

