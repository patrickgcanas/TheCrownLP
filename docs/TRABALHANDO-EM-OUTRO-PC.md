# Trabalhando no projeto em outro computador

O código mora no GitHub ([patrickgcanas/TheCrownLP](https://github.com/patrickgcanas/TheCrownLP)). Qualquer computador com o projeto clonado pode editar, e o GitHub é o ponto de encontro: **puxe antes de começar, envie quando terminar**.

## Instalação (uma vez por computador)

### 1. Programas

- [Node.js 24 LTS](https://nodejs.org) (o projeto usa a versão do arquivo `.nvmrc`)
- [Git](https://git-scm.com/download/win)
- [VS Code](https://code.visualstudio.com)

Confira no terminal: `node -v` (v24.x), `git --version`.

### 2. Clonar

No VS Code: `Ctrl+Shift+P` → **Git: Clone** → cole `https://github.com/patrickgcanas/TheCrownLP.git` → escolha uma pasta (ex.: `Documentos\Projetos`) → **Abrir**.

Na primeira vez o Git pede login no GitHub pelo navegador. Se a rede do escritório bloquear, avise o TI que precisa acessar `github.com`.

Ao abrir, o VS Code sugere instalar as extensões recomendadas (ESLint, Tailwind CSS, Claude Code): aceite.

### 3. Seu nome nos commits

O computador do escritório pode estar com o e-mail corporativo configurado no Git. Para que os commits deste projeto saiam no seu nome pessoal, rode **dentro da pasta do projeto**:

```bash
git config user.name "Patrick Canas"
git config user.email "patrickg.canas@gmail.com"
```

(Sem `--global`: vale só para este projeto e não mexe no Git do trabalho.)

### 4. Instalar as dependências

No terminal do VS Code (`` Ctrl+` ``):

```bash
npm install
```

### 5. Variáveis de ambiente (`.env.local`)

Esse arquivo **não vai para o GitHub** (tem as chaves de acesso), então cada computador precisa do seu. Duas formas:

**A) Puxar da Vercel (recomendado):**

```bash
npx vercel login
npx vercel link        # escolha o projeto "thecrownlp"
npx vercel env pull .env.local --environment=production
```

(O `--environment=production` importa: as variáveis foram cadastradas para Production/Preview, e sem ele vem um arquivo vazio.)

**B) Copiar à mão:** copie `.env.local.example` para `.env.local` e preencha com os valores que estão na Vercel (Settings → Environment Variables).

Sem o `.env.local` o site até abre, mas sem banco de dados (formulários não enviam, Mídia fica vazia).

### 6. Rodar

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). As mudanças nos arquivos aparecem na hora.

## Rotina de trabalho

### Ao começar (sempre)

```bash
git checkout main
git pull
npm install            # só faz algo se alguém adicionou pacotes
```

Isso traz o que foi feito no outro computador. **Pular este passo é a principal causa de conflito.**

### Fazendo uma mudança

Tudo que entra no `main` vai **direto para o site no ar**. Para mexer com calma, trabalhe num branch:

```bash
git checkout -b ajuste-historia     # um nome curto para a mudança
```

Edite, confira em `localhost:3000`, e salve no Git:

```bash
git add -A
git commit -m "Atualiza o texto da História"
git push -u origin ajuste-historia
```

A Vercel cria uma **prévia** com endereço próprio para esse branch (aparece no GitHub e no painel da Vercel). Bom para mostrar para a banda antes de publicar.

### Publicando

No GitHub, abra o **Pull Request** do branch (o GitHub mostra um botão "Compare & pull request") e clique em **Merge**. A Vercel publica sozinha em ~2 minutos.

Para mudanças pequenas e seguras (corrigir um texto), dá para trabalhar direto no `main`: `git pull` → editar → `git add -A` → `git commit -m "..."` → `git push`.

### Ao terminar (sempre)

Envie o que fez (`git push`), mesmo que não esteja pronto — num branch, nada vai para o ar. Assim o outro computador consegue continuar de onde parou.

## Usando o Claude Code no escritório

As anotações que o Claude faz ficam salvas só no computador onde ele rodou. Para o Claude do escritório saber o contexto do projeto, as decisões importantes estão no arquivo [`CLAUDE.md`](../CLAUDE.md) na raiz do projeto — ele lê esse arquivo sozinho. Quando algo importante mudar (decisão nova, pendência resolvida), peça para ele atualizar o `CLAUDE.md`.

## Problemas comuns

| Sintoma | O que fazer |
|---|---|
| `git push` recusado ("rejected", "fetch first") | O outro computador enviou algo antes. Rode `git pull` e depois `git push` de novo. |
| Conflito no `git pull` | Peça ajuda ao Claude Code: "resolva o conflito do git". Não apague arquivos às cegas. |
| Site abre mas formulários dão erro | Falta ou está incompleto o `.env.local` (passo 5). |
| Vídeo de abertura não aparece no `localhost` | Falta `NEXT_PUBLIC_INTRO_VIDEO_URL` no `.env.local`. |
| `npm run dev` reclama de módulo que não existe | Rode `npm install`. |
| Erros estranhos de tipos depois de trocar de branch | Apague a pasta `.next` e rode de novo. |
