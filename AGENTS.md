# AGENTS.md

## Visão Geral do Projeto

- **Descrição:** Frontend SPA do Quarto Projeto de TADS (2º semestre).
- **Filosofia:** Simplicidade máxima. Código enxuto, direto e componentes focados com recursos do React.
- **Stack:** React 19, Vite, TypeScript, React Router DOM 7, CSS Modules, ESLint.

## Comandos

- **Desenvolvimento:** `npm run dev` (porta 5173)
- **Build:** `npm run build` (`tsc -b && vite build`)
- **Lint:** `npm run lint` (`eslint .`)
- **Pré-visualização:** `npm run preview` (`vite preview`)

## Arquitetura e Diretrizes de Código

- **Estrutura:**
  - `src/components/`: Componentes reutilizáveis (ex.: Header, Footer) em pastas com seu `.tsx` e `.module.css`.
  - `src/pages/`: Páginas da aplicação (ex.: Home, Login, Register) em pastas com seu `.tsx` e `.module.css`.
  - `src/layouts/`: Layouts base (ex.: `MainLayout.tsx`).
  - `src/utils/`: Funções utilitárias e validações (ex.: `validation.ts`).
- **Estilização:** CSS Modules (`NomeComponente.module.css`) para escopo local. Evitar estilos globais fora de `src/index.css`.
- **Roteamento:** Use `react-router-dom` v7 nativo (`Link`, `useNavigate`) centralizado em `src/App.tsx`. Evite manipulações manuais de histórico.
- **Idioma da Interface:** Todos os textos, botões, títulos, placeholders e avisos exibidos ao usuário na tela DEVEM ser em **inglês**.

## Regras e Limites (O que fazer e o que não fazer)

- **Fazer:** Manter componentes pequenos, diretos e adequados ao nível de 2º semestre.
- **Fazer:** Fazer apenas edições cirúrgicas e pontuais estritamente ligadas à solicitação.
- **Não fazer:** NÃO adicionar bibliotecas externas de estado global (Redux, Zustand) ou formulários (Formik, React Hook Form, Zod) quando `useState` for suficiente.
- **Não fazer:** NÃO duplicar validações pesadas do backend; mantenha no frontend apenas validações básicas de formulário e formato.
- **Não fazer:** NÃO refatorar nem reescrever componentes existentes que já estejam funcionando sem solicitação explícita.
