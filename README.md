# MyIdeas — Monorepo (Frontend + Backend)

> Aplicação **MyIdeas** — planejador de ideias para conteúdo (app mobile em Expo + API REST em Node/Express + MySQL).
> Este repositório contém **frontend** (Expo / React Native / TypeScript) e **backend** (Node.js / Express / MySQL) no mesmo repositório para facilitar desenvolvimento local.

---

## Sumário

* Visão geral
* Estrutura do repositório
* Tecnologias
* Configuração

  * Backend
  * Frontend
* Variáveis de ambiente (.env) — exemplos
* Como rodar (desenvolvimento)
* API — endpoints principais
* Banco de dados — schema
* Dicas para desenvolvimento / deploy
* Contribuições
* Licença

---

## Visão geral

MyIdeas permite criar, organizar e agendar ideias de conteúdo com categorias, status, favoritos e integração com uma API que fornece autenticação por e-mail+senha (bcrypt + JWT).

---

## Estrutura recomendada do repositório

```
myideas/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── README.md (opcional)
│
├── frontend/
│   ├── src/
│   ├── app/
│   ├── package.json
│   └── README.md (opcional)
│
├── .gitignore
└── README.md  <-- este arquivo unificado
```

> Observação: manter BACKEND e FRONTEND em pastas separadas facilita deploy independente. Se quiser, adote um gerenciador de monorepo (pnpm workspaces, Yarn Workspaces, turborepo) no futuro.

---

## Tecnologias

**Backend:** Node.js, Express, MySQL, bcryptjs, jsonwebtoken, dotenv
**Frontend:** Expo (React Native), TypeScript, Axios, AsyncStorage, react-native-calendars, @expo/vector-icons

---

## Configuração

### 1) Clonar repositório

```bash
git clone https://link-do-seu-repositorio.git
cd myideas
```

### 2) Backend — instalar e configurar

```bash
cd backend
npm install
# opcional: npm install -D nodemon
```

Crie o arquivo `.env` dentro de `backend/` (exemplo abaixo). Configure também `src/models/db.js` se necessário.

#### Rodar backend (desenvolvimento)

Em um terminal:

```bash
cd backend
# sem nodemon
node src/index.js

# ou com nodemon (reinício automático)
npx nodemon src/index.js
```

O servidor ficará disponível em `http://localhost:3000` (ou `http://<SEU_IP>:3000` para testes em dispositivo físico).

---

### 3) Frontend (Expo) — instalar e configurar

```bash
cd frontend
npm install
```

Ajuste a `baseURL` do Axios em `src/api.js` (ou `src/api.ts`) para apontar para a API local:

```js
// exemplo
const api = axios.create({
  baseURL: 'http://SEU_IP:3000/',
  timeout: 10000,
});
```

#### Rodar frontend (Expo)

Em outro terminal:

```bash
cd frontend
npm run start
# ou
npx expo start
```

Abra no emulador/dispositivo ou use o app Expo Go. Se estiver testando em dispositivo físico, use o IP do computador (não `localhost`).

---

## Exemplo de `.env`

### backend/.env

```
JWT_SECRET=uma_chave_secreta_forte_aqui
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=banco_ideias
```

> **Nunca** commite `.env` — adicione ao `.gitignore`.

### frontend (opcional) — usar arquivo ou variável de ambiente via expo

Em `frontend/src/api.js` defina `baseURL` apontando à API:

```
API_BASE_URL=http://192.168.0.15:3000
```

---

## Como rodar os dois ao mesmo tempo

Abra dois terminais:

1. `cd backend` → `npx nodemon src/index.js`
2. `cd frontend` → `npx expo start`

Opcional: adicionar script root para rodar ambos com `concurrently` ou `npm-run-all`:

```json
// package.json (raiz) - exemplo
"scripts": {
  "start:backend": "cd backend && npx nodemon src/index.js",
  "start:frontend": "cd frontend && npx expo start",
  "start:dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
}
```

(Instale `concurrently` se usar essa abordagem.)

---

## API — Endpoints principais

### Ideias

* `POST /ideias` — criar nova ideia
* `GET /ideias` — listar todas as ideias
* `GET /ideias/:id` — obter ideia por ID
* `PUT /ideias/:id` — atualizar ideia por ID
* `DELETE /ideias/:id` — deletar ideia por ID

### Autenticação

* `POST /auth/register` — registra usuário `{ nome, email, password, nascimento, telefone, instagram_username }`
* `POST /auth/login` — autentica com `{ email, password }` → retorna `{ token, user }`
* `GET /auth/me` — retorna usuário autenticado (header `Authorization: Bearer <token>`)

#### Exemplo cURL — registrar

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "nome":"Ayrton", "email":"ayrton@example.com", "password":"minhasenha123" }'
```

#### Exemplo cURL — criar ideia (com token)

```bash
curl -X POST http://localhost:3000/ideias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "titulo":"Exemplo",
    "videoUrl":"https://...",
    "musicaUrl":"https://...",
    "categoria":"Meme",
    "descricao":"Descrição",
    "status":"Pendente",
    "favorito": false,
    "publicidade": false,
    "data": "2025-08-13 12:00:00"
  }'
```

---

## Banco de dados — Schema (MySQL)

### Tabela `ideias`

```sql
CREATE TABLE ideias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  videoUrl VARCHAR(255) NOT NULL,
  musicaUrl VARCHAR(255) NOT NULL,
  categoria ENUM('Legendado', 'Matéria', 'Meme') NOT NULL,
  descricao TEXT NOT NULL,
  status ENUM('Pendente', 'Concluída') NOT NULL,
  favorito BOOLEAN NOT NULL DEFAULT false,
  publicidade BOOLEAN NOT NULL DEFAULT false,
  data DATETIME NOT NULL
);
```

### Tabela `users`

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nascimento DATE DEFAULT NULL,
  telefone VARCHAR(50) DEFAULT NULL,
  instagram_username VARCHAR(100) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Dicas e observações

* **CORS:** se frontend e backend rodarem em hosts/ports diferentes, habilite CORS no backend (`cors`).
* **HTTPS:** em produção, use HTTPS e proteja `JWT_SECRET`.
* **Refresh tokens:** considere implementar refresh tokens para sessões longas.
* **Validação:** use `Joi` ou `zod` para validar payloads.
* **Rate limiting / segurança:** proteger rota de login com `express-rate-limit`.
* **Testes & Docker:** adicione testes automatizados e dockerização para facilidade de deploy.
* **Uploads:** se for suportar imagens/vídeos, planeje armazenamento (S3, Cloudinary) e validação.

---

## Roadmap / Melhorias sugeridas

* Upload de imagens/preview para ideias
* Busca avançada e ordenação
* Notificações/lembranças baseadas em data
* Tema claro/escuro dinâmico no app
* CI/CD e Docker para backend
* Separar em monorepo gerenciado (pnpm/workspaces) se o projeto crescer

---

## Contribuições

Contribuições são bem-vindas! Faça um fork, crie uma branch com o seu recurso/fix (`feature/xxx` ou `fix/xxx`) e abra um Pull Request descrevendo as mudanças.

---

## Licença

MIT License

---

> **Se quiser**: posso também adicionar um `.gitignore` recomendado, um `docker-compose.yml` de exemplo ou os scripts de `package.json` na raiz para facilitar o `start:dev`. Basta me dizer qual opção prefere.
