import { Controller, Get } from "@nestjs/common";
import { CalcularKpisFinanceirosUseCase } from "../application/use-cases/calcular-kpis-financeiros.use-case";
import { KpisOutputDTO } from "../application/dtos/kpis-output.dto";


@Controller('receita')
export class ReceitaController {
    constructor(private readonly calcularKpisUseCase: CalcularKpisFinanceirosUseCase){}
    @Get('kpis')
    async execute(): Promise<KpisOutputDTO> {
        return await this.calcularKpisUseCase.executar();
    }
}