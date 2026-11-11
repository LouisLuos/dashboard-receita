import { IBaseConsolidadaReceita } from "../../scripts/etl-interface";

export interface IReceitaRepository {
    obterDadosConsolidados(): Promise<IBaseConsolidadaReceita>
}