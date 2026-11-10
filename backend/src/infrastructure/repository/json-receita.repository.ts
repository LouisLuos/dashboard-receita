// 📁 Caminho: src/infrastructure/repository/json-receita.repository.ts
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { IReceitaRepository } from '../../application/ports/IReceitaRepository.js';
import type { IBaseConsolidadaReceita } from '../../scripts/etl-interface.js';

// Suporte para resolver caminhos em ESM (Node.js nativo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class JsonReceitaRepository implements IReceitaRepository {
    // Cache em memória para não precisar ler o disco toda vez que a rota for chamada
    private cache: IBaseConsolidadaReceita | null = null;

    async obterDadosConsolidados(): Promise<IBaseConsolidadaReceita> {
        // Se já leu uma vez, devolve da memória instantaneamente (< 1ms)
        if (this.cache) {
            return this.cache;
        }

        // Caminho físico: sobe 1 pasta até 'infrastructure' e entra em 'data/receita-consolidada.json'
        const caminhoJson = path.resolve(__dirname, '../data/receita-consolidada.json');

        if (!fs.existsSync(caminhoJson)) {
            throw new Error(`Arquivo de receita consolidada não encontrado em: ${caminhoJson}`);
        }

        const conteudoArquivo = fs.readFileSync(caminhoJson, 'utf-8');
        this.cache = JSON.parse(conteudoArquivo) as IBaseConsolidadaReceita;

        return this.cache;
    }
}