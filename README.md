Diário do copiloto
Registro 1 — Etapa 1

O que eu pedi: Como resolver o erro de tipagem no \_layout.tsx ao importar o arquivo ../global.css.
O que a IA sugeriu (resumo): Adicionar a declaração declare module "\*.css"; dentro do arquivo nativewind-env.d.ts e reiniciar o TypeScript Server.
O que eu fiz: Aceitei a sugestão e adicionei a declaração no nativewind-env.d.ts. O erro de tipagem deixou de aparecer e o projeto continuou compilando normalmente.

Registro 2 — Etapa 5
O que eu pedi: Como estruturar a listagem com filtros na tela app/index.tsx.
O que a IA sugeriu (resumo): Utilizar um useEffect simples para carregar as séries do SQLite sempre que o filtro fosse alterado.
O que eu fiz: Analisei a sugestão e percebi que ela não atendia completamente ao comportamento esperado da navegação. Como a tela de lista permanece montada ao navegar para outras telas, o useEffect não seria suficiente para atualizar os dados ao retornar. Optei por utilizar useFocusEffect junto com useCallback, fazendo a consulta novamente quando a tela recupera o foco.

Registro 3 — Etapa 5

O que eu pedi: Como resolver o erro Module has no default export e o conflito relacionado ao arquivo index.ts ao executar o npx tsc.
O que a IA sugeriu (resumo): Verificar se o arquivo index.ts da raiz ainda era necessário, considerando que o projeto estava configurado para utilizar o Expo Router através de "main": "expo-router/entry" no package.json.
O que eu fiz: Verifiquei a estrutura do projeto e percebi que o index.ts antigo não era mais necessário. Removi o arquivo e executei novamente o npx tsc --noEmit. O conflito deixou de aparecer.
