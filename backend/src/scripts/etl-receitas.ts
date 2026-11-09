// 📁 Caminho sugerido: backend/src/scripts/etl-receitas.ts
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx'

import type {
  IBaseConsolidadaReceita,
  IFonteReceita,
  ILancamentoMensal,
  IMemoriaPasepMensal,
} from './etl-interface.js';

// Suporte ao ESM para identificar diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Higieniza células vazias, '-', null ou NaN para 0.00 (RN05)
 */
function sanitizarNumero(valor: unknown): number {
  if (valor === null || valor === undefined || valor === '' || valor === '-') {
    return 0;
  }
  const num = typeof valor === 'number' ? valor : parseFloat(String(valor).replace(',', '.'));
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

async function executarETL() {
  console.log('🚀 Iniciando Pipeline ETL de Receitas e PASEP...');

  // Caminho da planilha na raiz do projeto e destino em infrastructure/data/
  const caminhoPlanilha = path.resolve(__dirname, '../../../QUADRO_RECEITA_PASEP_2026.ANDRE - outubro.xlsx');
  const caminhoDestinoJson = path.resolve(__dirname, '../infrastructure/data/receita-consolidada.json');

  if (!fs.existsSync(caminhoPlanilha)) {
    throw new Error(`❌ Planilha não encontrada no caminho: ${caminhoPlanilha}`);
  }

  // 1. Carregar planilha resolvendo valores calculados
  const workbook = XLSX.readFile(caminhoPlanilha, { cellFormula: false, cellHTML: false });
  const sheet = workbook.Sheets['RECEITA.2026'];

  if (!sheet) {
    throw new Error('❌ Aba RECEITA.2026 não encontrada na planilha!');
  }

  // 2. Colunas de Janeiro a Outubro (B a K)
  const meses = [
    { mes: '01', nome: 'JANEIRO', col: 'B' },
    { mes: '02', nome: 'FEVEREIRO', col: 'C' },
    { mes: '03', nome: 'MARÇO', col: 'D' },
    { mes: '04', nome: 'ABRIL', col: 'E' },
    { mes: '05', nome: 'MAIO', col: 'F' },
    { mes: '06', nome: 'JUNHO', col: 'G' },
    { mes: '07', nome: 'JULHO', col: 'H' },
    { mes: '08', nome: 'AGOSTO', col: 'I' },
    { mes: '09', nome: 'SETEMBRO', col: 'J' },
    { mes: '10', nome: 'OUTUBRO', col: 'K' },
  ];

  // 3. Mapeamento das 9 linhas da matriz RECEITA.2026
  const definicaoLinhas = [
    { linha: 3, id: 'tfsd_compesa', nome: 'TFSD COMPESA', categoria: 'TFSD', concessionaria: 'COMPESA', top2: true, dedutivel: false },
    { linha: 5, id: 'tfsd_copergas', nome: 'TFSD COPERGÁS', categoria: 'TFSD', concessionaria: 'COPERGÁS', top2: true, dedutivel: false },
    { linha: 7, id: 'tfsi_os_oscip', nome: 'TFSI OS/OSCIP', categoria: 'TFSI', concessionaria: 'OS/OSCIP Diversas', top2: false, dedutivel: false },
    { linha: 21, id: 'tfsd_rota_atlantico', nome: 'TFSD ROTA DO ATLÂNTICO', categoria: 'TFSD', concessionaria: 'Rota do Atlântico', top2: false, dedutivel: false },
    { linha: 23, id: 'tfsd_rota_coqueiros', nome: 'TFSD ROTA DOS COQUEIROS', categoria: 'TFSD', concessionaria: 'Rota dos Coqueiros', top2: false, dedutivel: false },
    { linha: 25, id: 'tfsd_socicam', nome: 'TFSD SOCICAM', categoria: 'TFSD', concessionaria: 'SOCICAM Terminais', top2: false, dedutivel: false },
    { linha: 27, id: 'receita_aneel', nome: 'CONVÊNIO ANEEL', categoria: 'CONVENIO_ANEEL', concessionaria: 'ANEEL', top2: false, dedutivel: true },
    { linha: 30, id: 'multa_compesa', nome: 'MULTA COMPESA', categoria: 'MULTAS', concessionaria: 'COMPESA', top2: false, dedutivel: false },
    { linha: 32, id: 'receitas_financeiras', nome: 'RECEITAS FINANCEIRAS', categoria: 'PATRIMONIAL', concessionaria: 'Caixa Econômica', top2: false, dedutivel: false },
  ] as const;

  const fontesProcessadas: IFonteReceita[] = [];

  for (const def of definicaoLinhas) {
    const lancamentos: ILancamentoMensal[] = [];
    let totalYTD = 0;

    for (const m of meses) {
      const cellRef = `${m.col}${def.linha}`;
      const cell = sheet[cellRef];
      const valor = sanitizarNumero(cell ? cell.v : 0);

      lancamentos.push({
        competencia: `2026-${m.mes}`,
        mesExtenso: m.nome,
        valor,
      });

      totalYTD += valor;
    }

    fontesProcessadas.push({
      id: def.id,
      nome: def.nome,
      categoria: def.categoria,
      concessionaria: def.concessionaria,
      isEstatalTop2: def.top2,
      isDedutivelPasep: def.dedutivel,
      lancamentos,
      totalYTD: Math.round(totalYTD * 100) / 100,
    });
  }

  // 4. Memória Mensal de Apuração do PASEP (RN01, RN02)
  const memoriaPasep: IMemoriaPasepMensal[] = [];
  let totalPasepAcumulado = 0;
  let totalBrutoAcumulado = 0;

  for (let i = 0; i < meses.length; i++) {
    const m = meses[i];
    let brutoMes = 0;
    let deducaoAneel = 0;

    for (const fonte of fontesProcessadas) {
      const lanc = fonte.lancamentos[i];
      brutoMes += lanc.valor;
      if (fonte.isDedutivelPasep) {
        deducaoAneel += lanc.valor;
      }
    }

    // Base Tributável = Receitas Correntes + Patrimonial - Expurgo ANEEL
    const baseTributavel = Math.round((brutoMes - deducaoAneel) * 100) / 100;
    const pasepMes = Math.round((baseTributavel * 0.01) * 100) / 100;

    memoriaPasep.push({
      competencia: `2026-${m.mes}`,
      mesExtenso: m.nome,
      receitaBruta: Math.round(brutoMes * 100) / 100,
      deducaoAneel: Math.round(deducaoAneel * 100) / 100,
      baseTributavel,
      aliquota: 0.01,
      pasepDevido: pasepMes,
    });

    totalBrutoAcumulado += brutoMes;
    totalPasepAcumulado += pasepMes;
  }

  // 5. Consolidação dos Indicadores Executivos
  const arrecadacaoTotalYTD = Math.round(totalBrutoAcumulado * 100) / 100;
  const mediaMensal = Math.round((arrecadacaoTotalYTD / meses.length) * 100) / 100;
  const totalPasepYTD = Math.round(totalPasepAcumulado * 100) / 100;

  const compesaYTD = fontesProcessadas.find(f => f.id === 'tfsd_compesa')?.totalYTD ?? 0;
  const copergasYTD = fontesProcessadas.find(f => f.id === 'tfsd_copergas')?.totalYTD ?? 0;
  const percentualEstataisTop2 = Math.round(((compesaYTD + copergasYTD) / arrecadacaoTotalYTD) * 10000) / 100;

  // 6. Blindagem de Checksum Contábil
  const VALOR_ESPERADO_YTD = 20231736.09;
  const diferenca = Math.abs(arrecadacaoTotalYTD - VALOR_ESPERADO_YTD);

  if (diferenca > 0.05) {
    throw new Error(
      `🚨 Falha no Checksum Contábil! Esperado: R$ ${VALOR_ESPERADO_YTD}, Obtido: R$ ${arrecadacaoTotalYTD}`
    );
  }

  // 7. Salvar JSON estruturado
  const resultado: IBaseConsolidadaReceita = {
    anoExercicio: 2026,
    competencias: meses.map(m => `2026-${m.mes}`),
    arrecadacaoTotalYTD,
    mediaMensal,
    totalPasepYTD,
    percentualEstataisTop2,
    fontes: fontesProcessadas,
    memoriaPasep,
    metadata: {
      geradoEm: new Date().toISOString(),
      origem: path.basename(caminhoPlanilha),
      totalCompetenciasValidas: meses.length,
    },
  };

  const dirDestino = path.dirname(caminhoDestinoJson);
  if (!fs.existsSync(dirDestino)) {
    fs.mkdirSync(dirDestino, { recursive: true });
  }

  fs.writeFileSync(caminhoDestinoJson, JSON.stringify(resultado, null, 2), 'utf-8');

  console.log('✅ Ingestão ETL concluída com sucesso!');
  console.log(`📊 Total Arrecadado YTD: R$ ${arrecadacaoTotalYTD.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`⚖️ Total PASEP (1%):     R$ ${totalPasepYTD.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`🎯 Concentração Top 2:    ${percentualEstataisTop2}%`);
  console.log(`📁 Destino: ${caminhoDestinoJson}`);
}

executarETL().catch(err => {
  console.error(err);
  process.exit(1);
});