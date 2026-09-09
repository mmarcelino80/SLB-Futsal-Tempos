# Regras permanentes de desenvolvimento

## Branches e versões

- A branch `main` é a versão estável e não deve ser alterada diretamente.
- O desenvolvimento deve ser feito a partir da branch `develop` ou de branches `feature/...`.
- A versão estável atual é **v18.9**.
- Nunca fazer merge diretamente para `main`.

## Âmbito das alterações

- Nunca alterar funcionalidades fora do âmbito explicitamente pedido.
- Nunca refatorar código apenas por preferência técnica.
- Preservar integralmente a lógica de jogo, relógio, substituições, rotações, cartões, golos, inferioridade numérica, histórico, relatórios, PWA, funcionamento offline e dados persistidos, salvo pedido explícito.
- Não alterar UI/UX sem pedido explícito.
- Não alterar `service-worker.js`, `manifest.json` ou a lógica de atualização/offline sem necessidade direta.
- Não alterar nomes, números, fotografias ou dados do plantel sem pedido explícito.

## Validação e comunicação

- Antes de concluir qualquer tarefa, verificar regressões nas funcionalidades relacionadas.
- Explicar no final exatamente quais ficheiros foram alterados e porquê.
