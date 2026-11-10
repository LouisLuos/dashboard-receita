// 📁 Caminho: src/application/errors/application-errors.ts

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class DadosNaoEncontradosError extends ApplicationError {
  constructor(message = 'Dados de receitas consolidadas não encontrados.') {
    super(message);
    this.name = 'DadosNaoEncontradosError';
  }
}

