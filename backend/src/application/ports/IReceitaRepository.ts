import { IBaseConsolidadaReceita } from "../../scripts/etl-interface";
import { KpisOutputDTO } from "../dtos/kpis-output.dto";

export interface IReceitaRepository {
    obterDadosConsolidados(): Promise<IBaseConsolidadaReceita>
}