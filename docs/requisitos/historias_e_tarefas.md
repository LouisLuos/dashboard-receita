# 📋 Especificação de Requisitos, Histórias de Usuário & Backlog Técnico

## 1. Tríade de Requisitos (`RF`, `RN`, `RNF`)

| Código | Tipo | Especificação |
| :--- | :--- | :--- |
| **RF01** | Funcional | Consolidar e exibir os KPIs executivos acumulados (YTD): Arrecadação Total Bruta, Média Mensal, Base Tributável, Total PASEP Apurado e Índice de Concentração Top 2. |
| **RF02** | Funcional | Apresentar o detalhamento mensal (Jan a Out/2026) da apuração do PASEP separando Receitas Correntes, Receitas Patrimoniais e Deduções/Expurgos (Convênio ANEEL). |
| **RF03** | Funcional | Exibir o ranking e a participação percentual (*share*) por grupo de receita (`TFSD`, `TFSI`, `Convênio ANEEL`, `Patrimonial`, `Multas`) e por concessionária/entidade. |
| **RF04** | Funcional | Sinalizar anomalias, meses sem repasse (`R$ 0,00`) ou variações atípicas nas concessionárias reguladas. |
| **RF05** | Funcional | Permitir filtragem dinâmica por **Competência (Mês/Intervalo)** e por **Categoria de Receita**. |
| **RF06** | Funcional | Proteger o acesso aos endpoints de dados financeiros via autenticação JWT e políticas estritas de CORS. |
| **RN01** | Regra de Negócio | **Fórmula da Base Tributável PASEP**: $\text{Base PASEP} = (\text{Receitas Correntes} + \text{Receitas Patrimoniais}) - \text{Repasses Convênio ANEEL (Não Tributáveis)}$. |
| **RN02** | Regra de Negócio | **Alíquota PASEP**: Fixada em **1,00% (`0.01`)** aplicada sobre a $\text{Base PASEP}$ de cada competência, com arredondamento contábil em 2 casas decimais. |
| **RN03** | Regra de Negócio | **Gatilho de Risco de Concentração Fiscal**: Se a soma percentual das 2 maiores fontes (`COMPESA + COPERGÁS`) for $\ge 80\%$, o sistema deve ativar o estado `ALERTA_CRITICO_CONCENTRACAO`. |
| **RN04** | Regra de Negócio | **Detecção de Anomalia de Repasse**: Concessionárias de concessão contínua (`TFSD`) que apresentarem valor `0.00` em uma competência ativa devem ser marcadas com flag `anomaliaDetectada = true`. |
| **RN05** | Regra de Negócio | **Saneamento de Ingestão (ETL)**: Células vazias, `null`, `NaN` ou com caractere `"-"` na planilha devem ser convertidas em `0.00` numérico durante a extração, preservando a soma YTD (`R$ 20.231.736,09`). |
| **RNF01** | Não-Funcional | **Arquitetura Desacoplada**: O `domain/` do backend não deve conter nenhum import do NestJS, Express ou bibliotecas de leitura de arquivo (`fs`/`xlsx`). |
| **RNF02** | Não-Funcional | **Performance**: Endpoints de KPIs devem responder em `< 100ms` a partir do JSON higienizado em memória/disco. |
| **RNF03** | Não-Funcional | **Segurança**: CORS restrito aos domínios autorizados (`localhost:5173` e `vercel.app`) + Guard JWT. |

---

## 2. Histórias de Usuário (INVEST) & BDD (Gherkin)

### 📌 HU-01: Painel Executivo de KPIs Consolidados e Alerta de Concentração
> **Como** Diretor Executivo / Gestor Financeiro da Agência,  
> **Quero** visualizar no topo do dashboard os indicadores acumulados do ano (Total Arrecadado YTD, Média Mensal, Total PASEP e Índice de Concentração nas Estatais),  
> **Para que** eu avalie em menos de 10 segundos a saúde orçamentária e o nível de dependência financeira da COMPESA e COPERGÁS.

```gherkin
Cenário 1 [Caminho Feliz]: Exibição dos KPIs consolidados Jan-Out/2026
  Dado que os dados consolidados de Janeiro a Outubro de 2026 foram carregados
  Quando o gestor acessa o dashboard executivo
  Então o sistema deve retornar HTTP 200 e exibir:
    | Indicador                    | Valor Esperado (Ref. Out/2026) |
    | Arrecadação Total YTD        | R$ 20.231.736,09               |
    | Média Mensal (10 meses)      | R$ 2.023.173,61                |
    | PASEP Acumulado YTD (1%)     | R$ 197.029,48                  |
    | Concentração Top 2 Estatais  | 82,53% (COMPESA + COPERGÁS)    |

Cenário 2 [Regra de Negócio - RN03]: Acionamento automático do Alerta de Risco Fiscal
  Dado que a soma da participação de COMPESA (52,74%) e COPERGÁS (29,79%) é 82,53%
  Quando o Caso de Uso avaliar o limiar de risco orçamentário (80%)
  Então a propriedade "alertaRiscoConcentracao" deve ser igual a true
  E o card no frontend deve exibir o badge visual "Risco Alto: >80% em 2 Fontes".
```

---

### 📌 HU-02: Apuração Auditável do PASEP (1%) com Expurgo de Convênios
> **Como** Analista Contábil / Auditor Interno,  
> **Quero** visualizar a memória de cálculo mensal do PASEP discriminando Receitas Tributáveis, Rendimentos Patrimoniais e Deduções Legais (Convênio ANEEL),  
> **Para que** eu possa auditar e comprovar que o recolhimento de 1% incidiu apenas sobre a base legal correta.

```gherkin
Cenário 1 [Regra de Negócio - RN01 e RN02]: Cálculo do PASEP expurgando repasse ANEEL
  Dado uma competência com Receitas Correntes de R$ 1.800.000,00, Receita Patrimonial de R$ 50.000,00 e Convênio ANEEL de R$ 100.000,00
  Quando o domínio processar a Apuração do PASEP daquela competência
  Então a Receita Bruta Total deve ser R$ 1.850.000,00
  Mas a Base de Cálculo Tributável deve expurgar os R$ 100.000,00 da ANEEL (resultando em R$ 1.750.000,00)
  E o PASEP apurado (1%) deve ser exatamente R$ 17.500,00.
```

---

### 📌 HU-03: Evolução Sazonal, Share por Fonte e Auditoria de Concessionárias
> **Como** Coordenador de Regulação e Fiscalização,  
> **Quero** visualizar gráficos de evolução mensal (Jan–Out), distribuição por categoria e uma tabela de acompanhamento por concessionária,  
> **Para que** eu identifique rapidamente meses com queda de arrecadação ou atrasos de repasse de concessionárias de rodovias e terminais.

```gherkin
Cenário 1 [Caminho Feliz]: Renderização da série histórica e distribuição por categoria
  Dado que o dashboard recebeu as 10 competências de 2026
  Quando os componentes gráficos forem montados
  Então deve exibir o gráfico de evolução mensal (Bruto vs Base Tributável vs PASEP)
  E o gráfico de composição percentual destacando COMPESA, COPERGÁS, Rodovias, SOCICAM, TFSI e ANEEL.
```

---

### 📌 HU-04: Blindagem de Acesso ao Dashboard (Autenticação JWT)
> **Como** Gestor Responsável pelos Dados Financeiros,  
> **Quero** que o dashboard em produção exija autenticação antes de exibir os dados da planilha,  
> **Para que** terceiros que descubram o link público na Vercel ou a URL do Render não acessem informações orçamentárias internas sem autorização.

```gherkin
Cenário 1 [Segurança - Bloqueio 401]: Acesso direto à API sem Token JWT
  Dado um cliente externo ou script tentando acessar GET /api/receitas/kpis sem cabeçalho Authorization
  Quando a requisição chegar ao ReceitaController
  Então o JwtAuthGuard deve interceptar a chamada e retornar HTTP 401 Unauthorized.
```

---

## 3. Matriz de Responsabilidades (SOLID & GRASP)

| Classe / Artefato | Camada | Responsabilidade Técnica | Padrão GRASP / SOLID |
| :--- | :--- | :--- | :--- |
| `ValorMonetario`, `Competencia`, `AliquotaPasep` | `domain/value-objects` | Garantir imutabilidade, arredondamento de 2 casas e impedir valores/meses inválidos. | **Information Expert** + **SRP** |
| `LancamentoReceita` | `domain/entities` | Representar cada entrada de receita, sabendo responder `ehTributavelPasep()` e `ehEstatalTop2()`. | **Information Expert** |
| `ApuracaoPasep` | `domain/entities` | Receber os lançamentos de um mês, expurgar isentos (`RN01`) e calcular o 1% devido (`RN02`). | **Creator** + **High Cohesion** |
| `IReceitaRepository` | `application/ports` | Contrato abstrato para busca de receitas sem acoplar ao formato de armazenamento. | **Indirection** + **Protected Variations** + **DIP** |
| `CalcularKpisFinanceirosUseCase` | `application/use-cases` | Orquestrar busca no repositório, agregar o YTD, calcular o índice de concentração (82,53%) e devolver o DTO. | **Pure Fabrication** + **OCP** |
| `JsonReceitaRepository` | `infrastructure/repositories` | Ler o JSON gerado pelo ETL do disco, fazer cache em memória e converter em entidades `LancamentoReceita`. | **Adapter** + **LSP** |
| `ReceitaController` | `presentation/controllers` | Receber requisições HTTP GET, validar filtros de query e delegar aos Use Cases. | **Controller (GRASP)** |

---

## 4. Backlog de Tarefas Técnicas SMART

* **`TASK-01 [ETL]: Criar script de extração e higienização da planilha para JSON estruturado`** (1.5h | `P`)
  * Extrair `QUADRO_RECEITA_PASEP_2026.ANDRE - outubro.xlsx` para `backend/src/infrastructure/data/receita-consolidada.json`, batendo R$ 20.231.736,09 bruto e R$ 197.029,48 no PASEP.
* **`TASK-02 [BE-Domain]: Implementar Value Objects (Competencia, ValorMonetario, AliquotaPasep)`** (1h | `P`)
  * Classes puras com validação no construtor impedindo nulos e valores negativos.
* **`TASK-03 [BE-Domain]: Implementar Entidades LancamentoReceita e ApuracaoPasep`** (2h | `M`)
  * Regras de expurgo da ANEEL (`RN01`), cálculo de 1% (`RN02`) e concentração fiscal (`RN03`).
* **`TASK-04 [BE-App]: Criar Porta IReceitaRepository, DTOs e Casos de Uso Principais`** (2h | `M`)
  * Interfaces, DTOs e use cases orquestrando a lógica sem dependência externa.
* **`TASK-05 [BE-Infra]: Implementar JsonReceitaRepository e InMemoryReceitaRepository`** (1.5h | `P`)
  * Implementação concreta consumindo o arquivo JSON local.
* **`TASK-06 [BE-Presentation]: Expor Endpoints REST no ReceitaController, Swagger e Auth JWT`** (2.5h | `M`)
  * Endpoints `/api/receitas/*` e `/api/auth/login` protegidos por Guard.
* **`TASK-07 [QA-BE]: Escrever testes unitários com Vitest para Domain e Use Cases`** (1.5h | `P`)
  * Garantir integridade dos cálculos matemáticos e regras de borda.
* **`TASK-08 [FE-Core]: Configurar cliente HTTP, tipagens dos DTOs e Tela de Login`** (1.5h | `P`)
  * Base de consumo da API no React com gerenciamento do token JWT.
* **`TASK-09 [FE-UI]: Construir Grid de Cards Executivos (YTD, Média, PASEP e Risco 82%)`** (2h | `M`)
  * Componentes com formatação monetária em pt-BR e badge de alerta de risco.
* **`TASK-10 [FE-Charts]: Construir Gráficos (Série Jan-Out, Donut de Share e Tabela)`** (3h | `G`)
  * Visualizações interativas com Recharts e filtros por competência.