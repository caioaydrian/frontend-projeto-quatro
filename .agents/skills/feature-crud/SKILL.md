---
name: feature-crud
description: Cria um CRUD completo e bem separado para uma feature neste app React + TypeScript + Vite, seguindo as convenções do projeto e padrões comuns de React.
---

# Feature CRUD

Use esta skill quando o usuário pedir para adicionar um novo CRUD de uma feature (listar, criar, ler/detalhar, atualizar, excluir) ou para completar uma página placeholder com comportamento completo de CRUD.

## Objetivos

- Manter a implementação **simples, explícita e fácil de apresentar** (adequada ao nível de 2º semestre).
- Separar responsabilidades com clareza: tipos, acesso à API, componentes de UI e orquestração da página.
- Seguir os padrões existentes do projeto: React 19, Vite, TypeScript, `react-router-dom` v7, CSS Modules.
- Usar `useState`/`useEffect` e componentes pequenos; **não adicionar** bibliotecas de estado/formulário (Redux/Zustand/React Hook Form etc.), a menos que seja solicitado explicitamente.
- Manter validações de frontend básicas (campos obrigatórios, verificações simples de formato). Não duplicar regras pesadas do backend.
- Todo texto de interface exibido ao usuário (labels, botões, títulos, placeholders, mensagens) deve ser em **inglês**.
- Fazer apenas alterações cirúrgicas necessárias para a feature solicitada; não refatorar código funcional não relacionado.

## Antes de começar

1. Inspecione os padrões existentes no repositório:
   - Roteamento: `src/App.tsx`
   - Layouts/páginas: `src/layouts/`, `src/pages/`
   - Componentes compartilhados: `src/components/AdminCard`, `AdminTitle`, etc.
   - Utilitários: `src/utils/api.ts`, `src/utils/auth.ts`, `src/utils/validation.ts`
2. Identifique o nome do recurso (singular/plural), campos, endpoints da API e onde a página ficará (ex.: `/admin/<recurso>`).
3. Prefira reutilizar primitivas de UI existentes (`AdminTitle`, `AdminCard`, estilos de formulário/botão de páginas existentes) para manter consistência.

## Estrutura recomendada

Mantenha cada responsabilidade em seu próprio lugar. Um CRUD admin típico:

```text
src/
  types/
    <feature>.ts                 # Tipos da entidade e payloads
  services/ (ou src/api/)
    <feature>.ts                 # Helpers de fetch para este recurso
  pages/
    <Feature>/
      <Feature>.tsx              # Página: estado, carregamento de dados, orquestração
      <Feature>.module.css
      components/
        <Feature>List.tsx        # Renderização de tabela/lista
        <Feature>List.module.css
        <Feature>Form.tsx        # Formulário de criação/edição (inputs controlados)
        <Feature>Form.module.css
      index.ts                   # export { <Feature> } / default
```

Adapte ao projeto se ele já usar uma convenção diferente (ex.: helpers de API em `src/utils/`). Não introduza um padrão paralelo sem motivo. Para features muito pequenas, colocar tudo na pasta da página é aceitável, desde que a lógica de lista/formulário não fique embaralhada.

## Fluxo de implementação

### 1. Definir tipos

- Crie tipos claros para a entidade e para entradas/payloads:
  - `Entity` (inclui `id`)
  - `CreateEntityInput` / `UpdateEntityInput` (ou um tipo compartilhado de valores do formulário)
- Use tipos explícitos para os campos; evite `any`.

### 2. Isolar chamadas à API

- Centralize as chamadas HTTP do recurso em um único módulo (ex.: `src/services/<feature>.ts` ou seguindo o uso de `src/utils/api.ts`).
- Use `API_BASE_URL` de `src/utils/api.ts` e inclua headers/tokens de autenticação de forma consistente com o código existente.
- Exponha funções pequenas: `listX()`, `getX(id)`, `createX(data)`, `updateX(id, data)`, `deleteX(id)`.
- Trate respostas não-OK (`if (!res.ok) throw ...`) e faça o parse do JSON em um só lugar, para que a UI receba dados/erros de forma limpa.

### 3. Construir componentes de UI (responsabilidades separadas)

- **Página (`<Feature>.tsx`)**: responsável pelo estado e efeitos colaterais.
  - Estado: `items`, `loading`, `error`, `editingItem` (ou modo), `isSubmitting`, opcional `formError`.
  - Carrega dados na montagem (`useEffect`) e fornece handlers: `handleCreate`, `handleUpdate`, `handleDelete`, `handleEdit`, `handleCancel`.
  - Renderiza `AdminTitle`, feedback (carregando/erro/vazio), `<FeatureForm />` e `<FeatureList />`.
- **Lista (`<Feature>List.tsx`)**: apresentacional.
  - Props: `items`, `onEdit`, `onDelete` (e flags de loading/disabled se necessário).
  - Renderiza linhas/cards com ações claras: **Edit**, **Delete**.
  - Confirme ações destrutivas antes de chamar a exclusão (ex.: `window.confirm("Delete this item?")`), a menos que o projeto já tenha um padrão de diálogo.
- **Formulário (`<Feature>Form.tsx`)**: formulário controlado para criar e editar.
  - Props: `initialValues` ou `editingItem`, `onSubmit`, `onCancel`, `isSubmitting`.
  - Estado local para os valores dos campos; `useEffect` para sincronizar quando `editingItem` mudar.
  - Validação básica antes do submit (obrigatórios/não vazios, formatos simples). Mostre mensagens de erro inline ou locais em inglês.
  - Ações primárias claras: **Create** / **Save changes** e **Cancel** ao editar.
  - Limpe o formulário após criação bem-sucedida.

### 4. Estados da página e UX

- Mostre um estado de carregamento durante o fetch.
- Mostre um estado/mensagem de erro clara quando requisições falharem, com forma de tentar novamente se for simples.
- Mostre um estado vazio quando não houver itens.
- Desabilite botões de submit/exclusão enquanto houver requisições em andamento para evitar duplicações.
- Após criar/atualizar/excluir, atualize a lista (re-fetch ou atualização consistente do estado local).

### 5. Rotas e exports

- Exporte a página em `src/pages/<Feature>/index.ts` e `src/pages/index.ts` conforme necessário.
- Registre/atualize a rota em `src/App.tsx` sob o layout correto (siga as rotas admin existentes).
- Adicione navegação/links apenas onde for relevante e consistente com a UI atual.

### 6. Estilização

- Use CSS Modules: `<Nome>.module.css` ao lado do componente.
- Mantenha estilos com escopo, legíveis e consistentes com as páginas/componentes admin existentes.
- Prefira marcação simples e semântica (`form`, `label`, `input`, `button`, `table`/lista) para clareza.

## Checklist de qualidade

- [ ] Tipos explícitos; sem `any`; payloads/retornos da API tipados.
- [ ] Lógica de API separada dos componentes de apresentação.
- [ ] Página orquestra estado/efeitos; Lista e Formulário são focados e reutilizáveis dentro da feature.
- [ ] Fluxos de criar, listar, editar e excluir funcionam e tratam estados de carregamento/erro/vazio.
- [ ] Exclusão exige confirmação; ações em andamento são protegidas.
- [ ] Validação básica de formulário presente; textos de UI voltados ao usuário em inglês.
- [ ] CSS Modules utilizados; sem quebra de estilos globais não relacionados.
- [ ] Rotas/exports configurados; sem imports não utilizados ou código morto introduzido.
- [ ] Alterações consistentes com as convenções do projeto e limitadas à feature solicitada.

## Notas para este projeto

- Prefira a abordagem mais simples que funcione: `fetch` + `useState`/`useEffect` em vez de abstrações.
- Verifique `src/utils/api.ts` e utilitários de autenticação antes de introduzir novos padrões de requisição.
- Mantenha o tom/estrutura das páginas admin existentes (ex.: `AdminTitle` + cards/seções de conteúdo).
- Se o contrato do backend for desconhecido, defina tipos razoáveis e pontos de integração sem TODOs, e deixe claras as premissas na sua resposta. Evite adivinhar validações complexas ou comportamentos do backend.
