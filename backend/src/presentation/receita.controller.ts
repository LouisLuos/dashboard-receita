import { Controller, Get, NotFoundException, BadRequestException } from "@nestjs/common";
import { CalcularKpisFinanceirosUseCase } from "../application/use-cases/calcular-kpis-financeiros.use-case.js";
import { KpisOutputDTO } from "../application/dtos/kpis-output.dto.js";
import { DadosNaoEncontradosError } from "../application/errors/application-errors.js";
import { DomainError } from "../domain/errors/domain-errors.js";

@Controller('receita')
export class ReceitaController {
    constructor(private readonly calcularKpisUseCase: CalcularKpisFinanceirosUseCase){}

    @Get('kpis')
    async execute(): Promise<KpisOutputDTO> {
        try {
            return await this.calcularKpisUseCase.executar();
        } catch (error) {
            if (error instanceof DadosNaoEncontradosError) {
                throw new NotFoundException(error.message);
            }
            if (error instanceof DomainError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }
}