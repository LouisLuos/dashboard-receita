# 📊 Dashboard de Receitas e PASEP (Regulação Estadual)

Dashboard analítico e executivo para acompanhamento de receitas de fiscalização, receitas patrimoniais e apuração de tributos (PASEP) de uma Agência Reguladora de Serviços Públicos Delegados.

---

## 🎯 1. Domínio de Negócio

Este sistema analisa os fluxos financeiros de uma agência de regulação pública estadual (ex.: regulação de serviços concedidos no Estado de Pernambuco, como saneamento, gás, rodovias pedagiadas, terminais rodoviários e parcerias com o terceiro setor).

### Principais Fontes de Receita:
1. **TFSD (Taxa de Fiscalização sobre Serviços Delegados):**
   - **COMPESA:** Concessionária de saneamento básico (maior fatia da receita, ~52,7%).
   - **COPERGÁS:** Distribuidora de gás canalizado (~29,8%).
   - **Rota do Atlântico & Rota dos Coqueiros:** Concessionárias de rodovias pedagiadas.
   - **SOCICAM:** Gestão de terminais rodoviários.
2. **TFSI (Taxa de Fiscalização de Serviços de Interesse Público):**
   - Organizações Sociais (OS) e OSCIPs conveniadas com o Estado (ex.: Porto Digital, ITEP, CEASA, etc.).
3. **Receitas de Convênios Federativos (ANEEL):**
   - Repasses descentralizados vinculados ao cumprimento de metas regulatórias do setor elétrico.
4. **Receitas Patrimoniais / Financeiras:**
   - Rendimentos de aplicações de tesouraria da agência (CDBs e Fundos de Renda Fixa Caixa).
5. **Multas Contratuais:**
   - Penalidades aplicadas a concessionárias por descumprimento de indicadores de qualidade.

### Apuração de PASEP (1%):
- **Base de Cálculo:** Receitas Correntes Tributáveis + Receitas Patrimoniais, expurgando deduções não-tributáveis (como repasses de convênio da ANEEL sujeitos a regime especial).
- **Alíquota:** 1,0% sobre a receita tributável líquida.

---

## 📈 2. KPIs e Métricas Críticas

- **Arrecadação Total Acumulada (YTD):** R$ 20.231.736,09 (Jan-Out/2026).
- **Média Mensal de Entrada:** ~R$ 2,02 Milhões/mês.
- **Concentração de Risco / Dependência:** Saneamento e Gás representam mais de 82% do orçamento.
- **Índice de Pontualidade / Atrasos de Concessionárias:** Rastreabilidade de atrasos e compensações entre competências (ex: notas sobre repasses da Rota do Atlântico e conciliações da COMPESA).
- **Provisão e Recolhimento de PASEP:** Rastreabilidade mensal do montante a recolher (~R$ 19k a R$ 20k/mês).

---

## 🏗️ 3. Arquitetura Planejada (Clean Architecture / Ports & Adapters)

A arquitetura do projeto foi desenhada visando independência de dados e facilidade de evolução:

```
dashboard-receita/
├── core/                   # 🏛️ Regras de Negócio e Domínio Puro
│   ├── domain/             # Entidades (Receita, Competencia, Pasep, Concessionaria)
│   ├── ports/              # Interfaces (IReceitaRepository, IPasepCalculator)
│   └── use_cases/          # Casos de Uso (CalcularKPIs, ConciliarPasep)
│
├── adapters/               # 🔌 Adaptadores (Mundo Externo)
│   ├── driven/             # Outbound: Leitores de Excel (OpenPyXL/Pandas), Banco de Dados
│   └── driving/            # Inbound: API REST (FastAPI) ou Controllers Web
│
└── ui/                     # 🖥️ Interface de Apresentação (Dashboard Web)
```

---

## 🚀 4. Como Executar

*(Instruções detalhadas serão adicionadas conforme os componentes do dashboard forem desenvolvidos).*



---

## 🏷️ 5. Convenção de Commits

Para manter a rastreabilidade e um histórico limpo, seguimos o padrão **Conventional Commits**. Consulte o guia completo e detalhado com escopos arquiteturais e boas práticas em:
👉 **[guia_convecoes.md](guia_convecoes.md)**

