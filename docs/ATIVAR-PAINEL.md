# Como ativar o painel de administração

Leva uns 15 minutos. Faça na ordem.

## 1. Banco de dados (Supabase → SQL Editor)

1. Abra `supabase/migrations/0003_admin.sql` no VS Code.
2. A última linha já está com o e-mail da banda (`thecrownlptribute@gmail.com`).
3. Selecione tudo (Ctrl+A), copie (Ctrl+C) e cole numa query nova do SQL Editor. Clique em **Run**.
   - Copie pelo VS Code, não pelo terminal — assim os acentos não quebram.
   - Resultado esperado: `Success. No rows returned`.

## 2. Login (Supabase → Authentication → Users)

O painel entra com e-mail e senha.

1. **Add user → Create new user**.
2. E-mail da banda, uma senha forte, e marque **Auto Confirm User**.
3. Se o e-mail já estiver na lista (de um login antigo), apague esse usuário antes.

Para trocar a senha depois: no painel, **Trocar senha**.

## 3. Avisos por e-mail (Resend)

1. Crie uma conta em [resend.com](https://resend.com) **usando o e-mail da banda** (o plano grátis só entrega para o e-mail da própria conta enquanto não houver domínio próprio).
2. Em **API Keys → Create API Key**, copie a chave (começa com `re_`).

## 4. Variáveis na Vercel (Settings → Environment Variables)

| Nome | Valor |
|---|---|
| `ADMIN_EMAIL` | o e-mail da banda (o mesmo do passo 1) |
| `RESEND_API_KEY` | a chave do Resend |

Marque **Production** e **Preview**.

## 5. Publicar

O painel está no branch `admin`. Para colocar no ar, é só juntar no `main` (peça ao Claude: "pode publicar o painel").
A Vercel faz o deploy sozinha.

## 6. Primeiro acesso

1. Abra `https://thecrownlp.vercel.app/admin`.
2. Digite o e-mail da banda → **Receber link de acesso**.
3. Abra o e-mail (confira o spam) e clique no link **no mesmo navegador**.

O e-mail de login vem do Supabase e o plano grátis limita a poucos envios por hora — se pedir vários seguidos, espere alguns minutos.

## Usando o painel

- **Shows**: crie o show (nome, local, data) e arraste as fotos/vídeos para dentro dele. Fotos do WhatsApp podem ir direto; o site reduz o tamanho sozinho.
- **Vídeos**: o ideal é postar no Instagram e colar o link do post/reel no show. Vídeos de até 50 MB também podem subir direto (use para poucos destaques).
- **Depoimentos**: só aparecem no site depois de **Aprovar**.
- **Contatos**: pedidos do formulário; marque como respondida para organizar.
