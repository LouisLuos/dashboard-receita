import {
  Controller,
  Get,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CalcularKpisFinanceirosUseCase } from '../application/use-cases/calcular-kpis-financeiros.use-case.js';
import { ApurarPasepMensalUseCase } from '../application/use-cases/apurar-pasep-mensal.use-case.js';
import { ObterGraficosDashboardUseCase } from '../application/use-cases/obter-graficos-dashboard.use-case.js';
import type { KpisOutputDTO } from '../application/dtos/kpis-output.dto.js';
import type { PasepConsolidadoOutputDTO } from '../application/dtos/pasep-output.dto.js';
import type { GraficosDashboardOutputDTO } from '../application/dtos/graficos-dashboard-output.dto.js';
import { DadosNaoEncontradosError } from '../application/errors/application-errors.js';
import { DomainError } from '../domain/errors/domain-errors.js';

@Controller('receita')
export class ReceitaController {
  private readonly logger = new Logger(ReceitaController.name);

  constructor(
    private readonly calcularKpisUseCase: CalcularKpisFinanceirosUseCase,
    private readonly apurarPasepUseCase: ApurarPasepMensalUseCase,
    private readonly obterGraficosUseCase: ObterGraficosDashboardUseCase,
  ) {}

  /**
   * GET /api/v1/receita/kpis
   * Retorna os 4 KPIs consolidados e o indicador de risco fiscal (RN03)
   */
  @Get('kpis')
  async execute(): Promise<KpisOutputDTO> {
    try {
      return await this.calcularKpisUseCase.executar();
    } catch (error) {
      this.tratarErro(error, 'consolidar os KPIs');
    }
  }

  /**
   * GET /api/v1/receita/pasep
   * Retorna a memória de cálculo mensal do PASEP 1% com expurgo do Convênio ANEEL (RN01/RN02)
   */
  @Get('pasep')
  async apurarPasep(): Promise<PasepConsolidadoOutputDTO> {
    try {
      return await this.apurarPasepUseCase.executar();
    } catch (error) {
      this.tratarErro(error, 'apurar a memória mensal do PASEP');
    }
  }

  /**
   * GET /api/v1/receita/graficos
   * Retorna os dados agregados para Evolução Mensal e Distribuição de Share (Donut)
   */
  @Get('graficos')
  async obterGraficos(): Promise<GraficosDashboardOutputDTO> {
    try {
      return await this.obterGraficosUseCase.executar();
    } catch (error) {
      this.tratarErro(error, 'obter os gráficos do dashboard');
    }
  }

  private tratarErro(error: unknown, operacao: string): never {
    if (error instanceof DadosNaoEncontradosError) {
      this.logger.warn(`Base de receitas não localizada ao ${operacao}: ${error.message}`);
      throw new NotFoundException({
        statusCode: 404,
        mensagem: 'A base consolidada de receitas e PASEP não foi encontrada.',
        detalhe: error.message,
      });
    }

    if (error instanceof DomainError) {
      this.logger.warn(`Inconsistência de domínio ao ${operacao}: ${error.message}`);
      throw new BadRequestException({
        statusCode: 400,
        mensagem: 'Os dados de receitas apresentam inconsistência orçamentária ou tributária.',
        detalhe: error.message,
      });
    }

    this.logger.error(`Erro interno não previsto ao ${operacao}`, error);
    throw new InternalServerErrorException({
      statusCode: 500,
      mensagem: `Ocorreu uma falha inesperada no servidor ao ${operacao}.`,
    });
  }
}
