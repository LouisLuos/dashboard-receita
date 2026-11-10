// 📁 Caminho: src/presentation/receita.module.ts
import { Module } from '@nestjs/common';
import { ReceitaController } from './receita.controller.js';
import { CalcularKpisFinanceirosUseCase } from '../application/use-cases/calcular-kpis-financeiros.use-case.js';
import { JsonReceitaRepository } from '../infrastructure/repository/json-receita.repository.js';

@Module({
  controllers: [ReceitaController],
  providers: [
    // 1. Registra o repositório - Prover o dado para ser consumido.
    JsonReceitaRepository,
    {
      provide: CalcularKpisFinanceirosUseCase,
      useFactory: (repo: JsonReceitaRepository) => {
        return new CalcularKpisFinanceirosUseCase(repo);
      },
      inject: [JsonReceitaRepository],
    },
  ],
  exports: [CalcularKpisFinanceirosUseCase],
})
export class ReceitaModule {}