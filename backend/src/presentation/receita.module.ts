// 📁 Caminho: src/presentation/receita.module.ts
import { Module } from '@nestjs/common';
import { ReceitaController } from './receita.controller.js';
import { CalcularKpisFinanceirosUseCase } from '../application/use-cases/calcular-kpis-financeiros.use-case.js';
import { ApurarPasepMensalUseCase } from '../application/use-cases/apurar-pasep-mensal.use-case.js';
import { JsonReceitaRepository } from '../infrastructure/repository/json-receita.repository.js';

@Module({
  controllers: [ReceitaController],
  providers: [
    JsonReceitaRepository,
    {
      provide: CalcularKpisFinanceirosUseCase,
      useFactory: (repo: JsonReceitaRepository) => {
        return new CalcularKpisFinanceirosUseCase(repo);
      },
      inject: [JsonReceitaRepository],
    },
    {
      provide: ApurarPasepMensalUseCase,
      useFactory: (repo: JsonReceitaRepository) => {
        return new ApurarPasepMensalUseCase(repo);
      },
      inject: [JsonReceitaRepository],
    },
  ],
  exports: [CalcularKpisFinanceirosUseCase, ApurarPasepMensalUseCase],
})
export class ReceitaModule {}
