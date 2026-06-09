# Cosechas · Contagem de Estoque

App web para a loja contar o estoque e o administrador ver, automaticamente, **o que precisa comprar** para repor.

- **Tela da loja** (`/`) — link aberto, sem senha. A pessoa conta cada produto e digita a quantidade. Salva sozinho.
- **Tela do admin** (`/admin`) — protegida por senha. Você cadastra produtos, define o **estoque regulador** (quantidade ideal) e vê a lista de compras: `comprar = regulador − contado`.

Os dados ficam num banco online (Upstash Redis), então a contagem feita no celular da loja aparece pra você em qualquer aparelho.

---

## Passo a passo (sem usar terminal)

### 1. Colocar o código no GitHub
1. Crie uma conta em **github.com** (se ainda não tiver).
2. Clique em **New repository**, dê o nome `cosechas-estoque` e crie.
3. Na página do repositório, clique em **Add file → Upload files** e arraste **todos os arquivos e pastas deste projeto** (não a pasta de fora, e sim o conteúdo). Clique em **Commit changes**.

### 2. Publicar no Vercel
1. Crie uma conta em **vercel.com** (pode entrar com o GitHub).
2. Clique em **Add New… → Project** e selecione o repositório `cosechas-estoque`.
3. O Vercel reconhece o Next.js sozinho. Clique em **Deploy** e aguarde.

> Nesse primeiro deploy o app ainda mostra um aviso de "banco não conectado" — é esperado. Faltam os passos 3 e 4.

### 3. Conectar o banco de dados (grátis)
1. Dentro do projeto no Vercel, abra a aba **Storage**.
2. Clique em **Create Database** e escolha **Upstash → Redis** (no Marketplace).
3. Dê um nome qualquer e, ao final, **conecte ao projeto** (`Connect to Project`).
   - Isso injeta automaticamente as credenciais (`KV_REST_API_URL` e `KV_REST_API_TOKEN`). Não precisa copiar nada.

### 4. Definir a senha do admin
1. No projeto, vá em **Settings → Environment Variables**.
2. Adicione:
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** a senha que você quiser usar para entrar em `/admin`
3. Salve.

### 5. Fazer um novo deploy
1. Vá na aba **Deployments**, abra o deploy mais recente, clique nos **três pontinhos (…) → Redeploy**.
2. Pronto! Depois que terminar:
   - Mande o **link principal** (ex.: `https://cosechas-estoque.vercel.app`) para quem vai contar na loja.
   - Acesse **`/admin`** (ex.: `https://cosechas-estoque.vercel.app/admin`) com sua senha para gerenciar e ver a lista de compras.

---

## Como usar no dia a dia
1. **No admin:** cadastre os produtos (nome, unidade e estoque regulador).
2. **Antes de uma nova contagem:** no admin, clique em **Zerar contagens da loja**.
3. **Na loja:** a pessoa abre o link e digita a contagem de cada item.
4. **No admin:** clique em **Atualizar contagens**, veja a coluna **Comprar** e use **Copiar lista** para enviar ao fornecedor/WhatsApp.

---

## Alternativa: publicar pelo terminal (Vercel CLI)
Se preferir usar o terminal e já tiver o **Node.js** instalado:

```bash
npm install
npm install -g vercel
vercel          # primeiro deploy (siga as perguntas)
```
Depois conecte o banco e a variável `ADMIN_PASSWORD` no painel (passos 3 e 4) e rode:
```bash
vercel --prod
```

## Rodar no seu computador (opcional, para testar)
Crie um arquivo `.env.local` baseado no `.env.example`, preencha `ADMIN_PASSWORD` e as credenciais do Upstash, e rode:
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000`.

---

## Detalhes técnicos
- **Next.js 14** (App Router) — roda nativamente no Vercel.
- **Upstash Redis** para os dados (o app aceita tanto `KV_REST_API_*` quanto `UPSTASH_REDIS_REST_*`).
- A área da loja **não** usa senha (acesso rápido). As ações do admin exigem a `ADMIN_PASSWORD`.
- Cálculo de reposição: `comprar = máx(0, estoque_regulador − contagem)`.
