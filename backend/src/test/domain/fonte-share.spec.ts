// 📁 Caminho: backend/src/test/domain/fonte-share.spec.ts
import { describe, expect, it } from 'vitest';
import { FonteShare } from '../../domain/entities/FonteShare.js';
import { ValorMonetario } from '../../domain/value-object/valor-monetario.js';
import { DomainError } from '../../domain/errors/domain-errors.js';

describe('FonteShare (Entity - Cálculo de Participação Orçamentária)', () => {
  it('deve calcular o share percentual e a formatação com precisão de 2 casas decimais', () => {
    // COMPESA: R$ 10.671.267,60 sobre Total Geral: R$ 20.231.736,09
    const compesaTotal = ValorMonetario.de(10671267.6);
    const totalGeral = ValorMonetario.de(20231736.09);

    const share = new FonteShare(
      'tfsd_compesa',
      'COMPESA (Saneamento Básico)',
      'TFSD',
      compesaTotal,
      totalGeral,
    );

    // 10671267.60 / 20231736.09 * 100 = 52.745... que arredonda para 52.75
    expect(share.id).toBe('tfsd_compesa');
    expect(share.nome).toBe('COMPESA (Saneamento Básico)');
    expect(share.percentualShare).toBe(52.75);
    expect(share.percentualFormatado).toBe('52,75%');
    expect(share.isIsentoPasep).toBe(false);
  });

  it('deve aceitar flag isIsentoPasep para repasses como Convênio ANEEL', () => {
    const aneelTotal = ValorMonetario.de(528788.09);
    const totalGeral = ValorMonetario.de(20231736.09);

    const share = new FonteShare(
      'receita_aneel',
      'Convênio ANEEL',
      'CONVENIO_ANEEL',
      aneelTotal,
      totalGeral,
      true,
    );

    expect(share.isIsentoPasep).toBe(true);
    expect(share.percentualShare).toBe(2.61);
    expect(share.percentualFormatado).toBe('2,61%');
  });

  it('deve lançar DomainError se totalGeral for zero ou negativo (divisão por zero)', () => {
    expect(
      () =>
        new FonteShare(
          'id',
          'Nome',
          'TFSD',
          ValorMonetario.de(100),
          ValorMonetario.zero(),
        ),
    ).toThrow(DomainError);
  });

  it('deve lançar DomainError se valorTotal for maior que totalGeral (fatia maior que bolo)', () => {
    expect(
      () =>
        new FonteShare(
          'id',
          'Nome',
          'TFSD',
          ValorMonetario.de(200),
          ValorMonetario.de(100),
        ),
    ).toThrow(DomainError);
  });

  it('deve lançar DomainError se id ou nome forem vazios', () => {
    expect(
      () =>
        new FonteShare(
          '  ',
          'Nome',
          'TFSD',
          ValorMonetario.de(50),
          ValorMonetario.de(100),
        ),
    ).toThrow(DomainError);

    expect(
      () =>
        new FonteShare(
          'id',
          '',
          'TFSD',
          ValorMonetario.de(50),
          ValorMonetario.de(100),
        ),
    ).toThrow(DomainError);
  });
});

