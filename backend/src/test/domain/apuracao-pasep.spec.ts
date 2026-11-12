// 📁 Caminho: backend/src/test/domain/apuracao-pasep.spec.ts
import { describe, expect, it } from 'vitest';
import { ApuracaoPasep } from '../../domain/entities/ApuracaoPasep.js';
import { ValorMonetario } from '../../domain/value-object/valor-monetario.js';
import { DomainError } from '../../domain/errors/domain-errors.js';

describe('ApuracaoPasep (Entity - RN01 e RN02)', () => {
  it('deve calcular a base tributável expurgando o convênio ANEEL e apurar 1% de PASEP (Cenário 1 Gherkin)', () => {
    const receitaBruta = ValorMonetario.de(1850000.0);
    const deducaoAneel = ValorMonetario.de(100000.0);

    const apuracao = new ApuracaoPasep('2026-01', 'JANEIRO', receitaBruta, deducaoAneel);

    expect(apuracao.competencia).toBe('2026-01');
    expect(apuracao.mesExtenso).toBe('JANEIRO');
    expect(apuracao.baseTributavel.valor).toBe(1750000.0);
    expect(apuracao.pasepDevido.valor).toBe(17500.0);
  });

  it('deve permitir apuração zerada (R$ 0,00 bruto e R$ 0,00 ANEEL) resultando em PASEP R$ 0,00', () => {
    const apuracao = new ApuracaoPasep(
      '2026-02',
      'FEVEREIRO',
      ValorMonetario.zero(),
      ValorMonetario.zero(),
    );

    expect(apuracao.baseTributavel.valor).toBe(0);
    expect(apuracao.pasepDevido.valor).toBe(0);
  });

  it('deve lançar DomainError quando a competência não seguir o padrão YYYY-MM', () => {
    expect(
      () => new ApuracaoPasep('2026-13', 'JANEIRO', ValorMonetario.de(1000), ValorMonetario.zero()),
    ).toThrow(DomainError);

    expect(
      () => new ApuracaoPasep('01/2026', 'JANEIRO', ValorMonetario.de(1000), ValorMonetario.zero()),
    ).toThrow(DomainError);
  });

  it('deve lançar DomainError quando o mês por extenso for vazio ou apenas espaços', () => {
    expect(
      () => new ApuracaoPasep('2026-03', '   ', ValorMonetario.de(1000), ValorMonetario.zero()),
    ).toThrow(DomainError);
  });

  it('deve lançar DomainError quando a dedução ANEEL for maior que a receita bruta', () => {
    const receitaBruta = ValorMonetario.de(50000.0);
    const deducaoAneel = ValorMonetario.de(100000.0);

    expect(() => new ApuracaoPasep('2026-04', 'ABRIL', receitaBruta, deducaoAneel)).toThrow(
      DomainError,
    );
  });
});

