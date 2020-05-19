# Amigo Secreto

Aplicação desenvolvida para fazer sorteios de amigo secreto desenvolvido em NodeJS com typescrypt.

Acesse https://ad-2019-front.herokuapp.com/.

## Backend

1. Acesse a pasta `backend`
2. instale os pacotes rodando `npm install` ou, caso use o *yarn*, rode `yarn install`.
3. crie um arquivo `.dev` contendo as seguintes variáveis de ambiente:
    - `MONGODB_URI`: uri de conexão com o mongo
    - `SENDGRID_API_KEY`: chave de api do sendgrid para enviar emails.
    - `PORT`: porta a qual o sistema rodará. O padrão é a 3000.
4. inicialize o modo de desenvolvimento rodando o comando `yarn dev`.
5. O serviço estará rodando em `http://localhost:$PORT`.

## Frontend

1. Acessa a pasta `frontend`.
2. instale os pacotes rodando `npm install` ou, caso use o *yarn*, rode `yarn install`.
3. crie um arquivo `.dev` contendo as seguintes variáveis de ambiente:
    - `REACT_APP_API_URL`: uri de conexão com o serviço de backend.
4. inicialize o modo de desenvolvimento rodando o comando `yarn start`.
