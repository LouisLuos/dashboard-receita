# 🏗️ Arquitetura do Backend — Estrutura e Responsabilidades

Este documento detalha o desenho arquitetural do **Backend** do **Dashboard de Receitas e PASEP**, fundamentado nos princípios de **Clean Architecture**, **Hexagonal (Ports & Adapters)** e **DDD Tático (Domain-Driven Design)**.

---

## 🧭 A Regra de Dependência

As camadas são organizadas em círculos concêntricos. O princípio orientador é:
> **O código das camadas internas NUNCA deve conhecer ou importar detalhes das camadas externas.**
> 
> `Presentation` e `Infrastructure` ➔ conhecem ➔ `Application` ➔ conhece ➔ `Domain`  
> *(O `Domain` não conhece nada fora dele).*

---

## 📁 Árvore de Diretórios do Backend

```bash
backend/
└── src/
    ├── domain/                 # 🏛️ Core do Negócio (Regras Puras, Zero Dependências)
    │   ├── entities/           # Entidades com identidade, ciclo de vida e invariantes
    │   └── value-objects/      # Objetos de Valor imutáveis e auto-validados
    │
    ├── application/            # ⚙️ Orquestração de Casos de Uso
    │   ├── use-cases/          # Lógica da aplicação / fluxos de negócio
    │   ├── ports/              # Contratos e Interfaces de entrada/saída (Ports)
    │   └── dtos/               # Objetos de Transferência de Dados (Inputs e Outputs)
    │
    ├── infrastructure/         # 🔌 Detalhes Técnicos e Adaptadores Externos
    │   ├── data/               # Fontes de dados brutas, parsers de planilhas e DB
    │   └── repositories/       # Implementações concretas das interfaces de repositório
    │
    └── presentation/           # 🌐 Fronteira de Entrada (Driving Adapters)
        └── controllers/        # Controladores HTTP / Rotas de API que expõem os dados
```

---

## 🔍 Descrição Detalhada por Camada

### 1. 🏛️ `src/domain/` (Camada de Domínio Puro)
É o núcleo mais protegido da aplicação. **Não possui dependências de frameworks, banco de dados ou bibliotecas de I/O.** Se trocarmos o framework web ou o banco, esta camada permanece 100% intacta.

* **`entities/` (Entidades)**:
  * **O que é**: Classes de negócio que possuem identidade única, ciclo de vida e protegem invariantes de negócio.
  * **Exemplos no projeto**:
    * `LancamentoReceita`: representa a entrada financeira de uma concessionária em determinada competência (mês/ano), validando se o valor é positivo e se a categoria é válida.
    * `ApuracaoPasep`: consolida a base de cálculo tributável e calcula a retenção devida de 1%.
    * `Concessionaria`: representa a entidade regulada (COMPESA, COPERGÁS, Rota do Atlântico, etc.).

* **`value-objects/` (Objetos de Valor)**:
  * **O que é**: Objetos imutáveis definidos pelos seus atributos e não por um ID. Eles se auto-validam no momento em que são instanciados. Se dois Value Objects têm os mesmos valores, são considerados iguais.
  * **Exemplos no projeto**:
    * `Competencia`: encapsula mês e ano (ex.: `2026-03`), garantindo formato válido e impedindo meses fora do intervalo 1-12.
    * `ValorMonetario`: garante precisão monetária (centavos/arredondamento), impede valores negativos inválidos e padroniza formatação.
    * `AliquotaPasep`: encapsula a regra de percentual (fixa em 1,0% ou configurável), impedindo valores fora da faixa legal.

---

### 2. ⚙️ `src/application/` (Camada de Aplicação / Casos de Uso)
É a maestrina da orquestração. Ela implementa as regras de negócio específicas da aplicação, guiando o fluxo entre o domínio e o mundo externo através de contratos (*Ports*).

* **`use-cases/` (Casos de Uso / Interactors)**:
  * **O que é**: Cada classe executa uma ação ou fluxo específico que o sistema oferece aos usuários.
  * **Exemplos no projeto**:
    * `CalcularKpisFinanceirosUseCase`: busca os lançamentos via porta, agrega arrecadação YTD (R$ 20.2M), calcula média mensal e computa o índice de concentração das estatais (~82%).
    * `ApurarPasepMensalUseCase`: isola as receitas correntes e patrimoniais, expurga deduções (repasses ANEEL) e apura o 1% a recolher.
    * `ListarReceitasPorConcessionariaUseCase`: consolida os repasses por concessionária e destaca anomalias/atrasos.

* **`ports/` (Interfaces / Contratos)**:
  * **O que é**: As fronteiras abstratas da Arquitetura Hexagonal. A camada de aplicação define *o que* ela precisa, mas não *como* será feito (Inversão de Dependência - DIP).
  * **Exemplos no projeto**:
    * `IReceitaRepository`: contrato com métodos como `buscarTodos()`, `buscarPorCompetencia(competencia)` e `buscarPorConcessionaria(id)`.
    * `IPlanilhaParser`: contrato para ingestão e conversão de dados tabulares.

* **`dtos/` (Data Transfer Objects)**:
  * **O que é**: Estruturas de dados simples (sem regras de negócio) usadas para transportar informações entre o mundo externo e os casos de uso.
  * **Exemplos no projeto**:
    * `CalcularKpisInputDTO`: parâmetros de filtro (ex.: intervalo de competências `dataInicio` e `dataFim`).
    * `KpisFinanceirosOutputDTO`: resposta consolidada com `arrecadacaoTotal`, `mediaMensal`, `percentualEstatais` e `totalPasep`.

---

### 3. 🔌 `src/infrastructure/` (Infraestrutura / Driven Adapters)
Implementa tecnicamente as necessidades definidas pela camada de aplicação. É onde os frameworks e bibliotecas externas vivem.

* **`data/` (Fontes de Dados & Parsing)**:
  * **O que é**: Arquivos brutos de dados (planilhas Excel `.xlsx`, arquivos JSON/CSV) ou serviços de conexão direta a banco de dados.
  * **Exemplos no projeto**:
    * Mapeadores de planilhas (`ExcelReceitaReader`), responsáveis por ler abas, cabeçalhos, converter vírgulas para números de ponto flutuante e sanitizar linhas em branco.

* **`repositories/` (Repositórios Concretos)**:
  * **O que é**: As classes concretas que implementam as interfaces definidas em `application/ports/`.
  * **Exemplos no projeto**:
    * `ExcelReceitaRepository`: lê a base consolidada de receitas e instancia as entidades do `domain`.
    * `InMemoryReceitaRepository`: implementação rápida em memória, perfeita para testes unitários e de integração instantâneos.
    * *(Futuro)* `SqlReceitaRepository`: se os dados forem migrados para PostgreSQL/Prisma.

---

### 4. 🌐 `src/presentation/` (Apresentação / Driving Adapters)
É o ponto de contato que recebe as requisições externas, traduz os dados para a linguagem dos Casos de Uso e devolve a resposta formatada para o cliente (Frontend/Dashboard).

* **`controllers/` (Controladores HTTP)**:
  * **O que é**: Classes que expõem endpoints REST (seja em NestJS, Express ou FastAPI).
  * **Responsabilidade**:
    1. Receber o payload HTTP / query params;
    2. Converter para o DTO do caso de uso;
    3. Invocar o `UseCase`;
    4. Devolver status code HTTP apropriado (`200 OK`, `400 Bad Request`, `404 Not Found`) e JSON estruturado.
  * **Exemplos no projeto**:
    * `ReceitaController`: rotas `/api/receitas` e `/api/receitas/kpis`.
    * `PasepController`: rota `/api/pasep/apuracao`.
    * `ConcessionariaController`: rota `/api/concessionarias/ranking`.

---

## 🛡️ Vantagens Desta Arquitetura para a Avaliação

1. **Testabilidade Real**: o cálculo do PASEP (1%) e os KPIs de risco fiscal podem ser testados com testes unitários puros sem subir servidor web ou ler disco.
2. **Desacoplamento**: a troca da fonte de dados (de planilha Excel para banco PostgreSQL) exige mexer **apenas** em `infrastructure/repositories/`, deixando regras de negócio e controllers 100% intocados.
3. **Padrão de Mercado**: reflete a maturidade técnica exigida por grandes consultorias de engenharia de software (Clean Architecture e SOLID rigorosos).

