# Exame de Suficiência Web 2 (Backend) - UTFPR

Devem ser implementadas todas as rotinas de consulta, cadastro, validação e autenticação no
lado servidor, como APIs Web REST.


## Executando

### Requisitos

É necessário a versão 20 do Node.js, assim como um Banco de Dados MySQL.

### Com Docker 

Caso você tenha Docker, você pode usar o `docker-compose.yml` disponibilizado 
junto com o código. Ele possui tanto as dependências do backend quanto o MySQL.

Para usa-lo, siga os seguintes passos:

- Copie o `.env.example` para `.env` e preencha as variáveis devidamente, como
os secrets do JWT, salt da senha e dados do usuário Admin. Quanto as 
informações do banco de dados, é recomendado alterar apenas a senha.
- Execute `docker compose build` para construir a imagem do backend.
- Inicie os serviços com `docker compose up -d`. Caso precise ver as _logs_ do
backend, use `docker compose logs backend`.

### Sem Docker

Com o **Node.js 20** e um **Banco de Dados MySQL** instalado, 
siga os seguintes passos:

- Copie o `.env.example` para `.env` e preencha as variáveis devidamente, desde
os dados de acesso ao banco de dados até os secrets do JWT, salt da senha e 
dados do usuário Admin.
- Use algum gerenciador de pacotes para instalar as dependências, recomendo o 
[pnpm](https://pnpm.io/pt/) com `pnpm install` ou `npm install`.
- Inicie o backend com `node .`. Isso irá criar as tabelas e o usuário Admin
de acorod com o que foi colocado no arquivo `.env`.

## Mamma Mia

https://www.instagram.com/p/Cq6ykMFL2cN/
