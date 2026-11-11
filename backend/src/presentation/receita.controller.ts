import { 
  Controller, 
  Get, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException,
  Logger 
} from "@nestjs/common";
import { CalcularKpisFinanceirosUseCase } from "../application/use-cases/calcular-kpis-financeiros.use-case.js";
import { KpisOutputDTO } from "../application/dtos/kpis-output.dto.js";
import { DadosNaoEncontradosError } from "../application/errors/application-errors.js";
import { DomainError } from "../domain/errors/domain-errors.js";

@Controller('receita')
export class ReceitaController {
    private readonly logger = new Logger(ReceitaController.name);

    constructor(private readonly calcularKpisUseCase: CalcularKpisFinanceirosUseCase) {}

    /**
     * GET /api/v1/receita/kpis
     * Retorna os 4 KPIs consolidados e o indicador de risco fiscal (RN03)
     */
    @Get('kpis')
    async execute(): Promise<KpisOutputDTO> {
        try {
            return await this.calcularKpisUseCase.executar();
        } catch (error) {
            if (error instanceof DadosNaoEncontradosError) {
                this.logger.warn(`Base de receitas não localizada: ${error.message}`);
                throw new NotFoundException({
                    statusCode: 404,
                    mensagem: "A base consolidada de receitas e PASEP não foi encontrada.",
                    detalhe: error.message,
                });
            }

            if (error instanceof DomainError) {
                this.logger.warn(`Inconsistência de domínio ao processar KPIs: ${error.message}`);
                throw new BadRequestException({
                    statusCode: 400,
                    mensagem: "Os dados de receitas apresentam inconsistência orçamentária ou tributária.",
                    detalhe: error.message,
                });
            }

            this.logger.error("Erro interno não previsto ao calcular KPIs", error);
            throw new InternalServerErrorException({
                statusCode: 500,
                mensagem: "Ocorreu uma falha inesperada no servidor ao consolidar os KPIs.",
            });
        }
    }
}
