# 🏷️ Guia de Convenções de Commits & Git Flow

Este documento define os padrões de mensagens de commit para o repositório **Dashboard de Receitas e Regulação**, garantindo rastreabilidade, clareza no histórico do Git e facilidade de revisão em Pull Requests.

---

## 📐 1. Formato Padrão

Todo commit deve seguir a estrutura base do **Conventional Commits**:

```bash
<tipo>(<escopo>): <descrição em minúsculo e sem ponto final>
```

### Regras Gerais:
1. **Verbo no presente do indicativo / imperativo**: `adiciona`, `corrige`, `remove`, `ajusta` (ou em inglês: `add`, `fix`, `refactor`).
2. **Caixa baixa na descrição**: não iniciar a mensagem após `:` com letra maiúscula.
3. **Sem ponto final**: mantenha a linha do título enxuta (idealmente até 72 caracteres).
4. **Escopo é opcional, mas altamente recomendado** para identificar a camada arquitetural impactada.

---

## 📌 2. Tipos Principais & Exemplos Práticos

| Tipo | Quando usar | Exemplos no Projeto |
| :--- | :--- | :--- |
| **`feat`** | Nova funcionalidade, regra ou entrega de negócio | `feat(domain): adiciona entidade lancamento receita e calculo do pasep`<br>`feat(frontend): cria card de kpi com alerta de risco fiscal`<br>`feat(backend): implementa endpoint de consolidacao mensal de receitas` |
| **`fix`** | Correção de bug ou erro de cálculo no código | `fix(etl): ajusta parse de valores com virgula na planilha`<br>`fix(application): corrige percentual de concentracao de estatais`<br>`fix(frontend): ajusta renderizacao do grafico de distribuicao no resize` |
| **`refactor`** | Mudança interna sem alterar o comportamento ou criar nova feature | `refactor(backend): isola calculo do pasep em value object`<br>`refactor(presentation): limpa imports do controller de receita`<br>`refactor(frontend): extrai card metrico para componente compartilhado` |
| **`chore`** | Tarefas de manutenção, setup, scripts, pacotes ou `.gitignore` | `chore: ignora planilhas xlsx no gitignore`<br>`chore(deps): instala lucide-react e recharts no frontend`<br>`chore(backend): configura porta e variaveis de ambiente` |
| **`test`** | Criação ou ajuste de testes automatizados (unitários, integração, E2E) | `test(domain): adiciona testes unitarios para invariantes de receita`<br>`test(application): cobre caso de borda de deducao tributavel do pasep`<br>`test(backend): adiciona teste e2e para endpoint de kpis` |
| **`docs`** | Alteração exclusiva em documentação, guias ou README | `docs: atualiza guia de arquitetura no stack.md`<br>`docs: cria guia de convencoes de commit`<br>`docs: documenta regras de negocio do pasep no readme` |
| **`style`** | Ajustes de formatação, lint, espaços em branco (sem impacto em código) | `style(frontend): formata componentes com prettier`<br>`style: ajusta indentacao dos arquivos de configuracao` |
| **`perf`** | Melhoria de desempenho / otimização de queries ou renderização | `perf(frontend): memoriza calculo de acumulado ytd com usememo`<br>`perf(etl): otimiza leitura de linhas da planilha com chunking` |

---

## 🎯 3. Escopos Sugeridos (Alinhados com a Clean Architecture)

Utilize escopos para deixar claro em qual fatia do software a mudança ocorreu:

- **`domain`**: Entidades centrais, Value Objects e regras puras (ex.: cálculo do PASEP, validação de competência, alíquotas).
- **`application`** / **`usecase`**: Casos de uso de orquestração (ex.: consolidação mensal, cálculo de KPIs executivos).
- **`backend`**: Endpoints, rotas, controllers, middlewares e injeção de dependências.
- **`frontend`**: Componentes de tela, páginas, gráficos (Recharts), temas e Tailwind CSS.
- **`etl`**: Scripts e adaptadores de parsing/extração de dados de planilhas Excel/CSV.
- **`deps`**: Gerenciamento de bibliotecas nos arquivos `package.json` ou `requirements.txt`.
- **`infra`**: Configurações de banco, containers Docker ou serviços externos.

---

## 💡 4. Boas Práticas para Commits Atômicos

1. **Evite commits gigantes do tipo "faz tudo"**:
   - ❌ `feat: cria backend inteiro e tela de kpi e arruma bug de planilha`
   - ✅ Divida em 3 commits menores:
     - `feat(backend): cria endpoint de consolidacao de receitas`
     - `fix(etl): trata campos nulos na importacao da planilha`
     - `feat(frontend): exibe cards de kpis executivos`
2. **Commits atômicos facilitam o `git revert`**: se um bug for introduzido, fica trivial desfazer apenas a alteração específica sem perder o resto do trabalho.

