// 📁 Caminho: src/infrastructure/repository/json-receita.repository.ts
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { IReceitaRepository } from '../../application/ports/IReceitaRepository.js';
import type { IBaseConsolidadaReceita } from '../../scripts/etl-interface.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class JsonReceitaRepository implements IReceitaRepository {
    private cache: IBaseConsolidadaReceita | null = null;

    private resolverCaminhoJson(): string {
        // Opção 1: Caminho relativo a partir de __dirname
        const caminhoRelativo = path.resolve(__dirname, '../data/receita-consolidada.json');
        if (fs.existsSync(caminhoRelativo)) {
            return caminhoRelativo;
        }

        // Opção 2: Caminho direto na pasta src (quando executando a partir do dist)
        const caminhoSrc = path.resolve(process.cwd(), 'src/infrastructure/data/receita-consolidada.json');
        if (fs.existsSync(caminhoSrc)) {
            return caminhoSrc;
        }

        // Opção 3: Se o comando foi rodado da raiz do projeto (fora da pasta backend)
        const caminhoRaiz = path.resolve(process.cwd(), 'backend/src/infrastructure/data/receita-consolidada.json');
        if (fs.existsSync(caminhoRaiz)) {
            return caminhoRaiz;
        }

        throw new Error(
            `Arquivo de receita consolidada não encontrado!\nTentou em:\n- ${caminhoRelativo}\n- ${caminhoSrc}\n- ${caminhoRaiz}`
        );
    }

    async obterDadosConsolidados(): Promise<IBaseConsolidadaReceita> {
        if (this.cache) {
            return this.cache;
        }

        const caminhoJson = this.resolverCaminhoJson();
        const conteudoArquivo = fs.readFileSync(caminhoJson, 'utf-8');
        this.cache = JSON.parse(conteudoArquivo) as IBaseConsolidadaReceita;

        return this.cache;
    }
}