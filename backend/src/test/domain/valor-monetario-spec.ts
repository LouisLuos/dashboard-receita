// 📁 Caminho: backend/test/domain/valor-monetario.spec.ts
import { describe, expect, it } from 'vitest';
// Note a importação apontando para o seu arquivo:
import { ValorMonetario } from '../../domain/value-object/valor-monetario';

describe('ValorMonetario (Value Object)', () => {
  it('deve instanciar um valor monetário válido com arredondamento correto de centavos', () => {
    const valor = ValorMonetario.de(1067126.76);
    expect(valor.valor).toBe(1067126.76);
    expect(valor.centavos).toBe(106712676);
  });

  it('deve somar dois valores monetários sem erro de precisão de ponto flutuante IEEE 754', () => {
    // 0.10 + 0.20 em JS puro dá 0.30000000000000004
    const v1 = ValorMonetario.de(0.1);
    const v2 = ValorMonetario.de(0.2);
    const total = v1.somar(v2);

    expect(total.valor).toBe(0.3);
  });

  it('deve lançar erro ao tentar instanciar valor negativo', () => {
    expect(() => ValorMonetario.de(-50.0)).toThrow(
      'Valor monetário não pode ser negativo em receitas orçamentárias.'
    );
  });

  it('deve subtrair valores corretamente', () => {
    const v1 = ValorMonetario.de(100);
    const v2 = ValorMonetario.de(30);
    const resultado = v1.subtrair(v2);

    expect(resultado.valor).toBe(70);
  });

  it('deve lançar erro se a subtração resultar em valor negativo', () => {
    const v1 = ValorMonetario.de(30);
    const v2 = ValorMonetario.de(100);

    expect(() => v1.subtrair(v2)).toThrow(
      'Operação inválida: a dedução não pode resultar em valor negativo.'
    );
  });

  it('deve formatar corretamente para moeda brasileira (BRL)', () => {
    const valor = ValorMonetario.de(20231736.09);
    // Remove espaços não-quebráveis típicos do Intl
    const formatado = valor.formatarBRL().replace(/\u00a0/g, ' ');
    expect(formatado).toBe('R$ 20.231.736,09');
  });
});