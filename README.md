# Teste Serverless

## Descrição

O projeto consiste em um sistema serverless com 3 funções e uma documentação _Swagger_. Sendo essas as funções:

> **POST** /process/customers
- Recebe um payload e salva no MongoDB para o registro ser processado


> **GET** /process/customers
- Recebe como parâmetro o id do documento no MongoDB e retorna o registro.

> **CRON** a cada 60 segundos (1 minuto)
- Processa os registros recebidos através do método _POST_. Consiste em buscar as informações do CNPJ e atualizar o registro no MongoDB.
- Conta com um sistema de cache com base no _Redis_.

## Execução

Para executar esse projeto, é necessário _subir_ o arquivo `doker-compose.yml`. Nesse arquivo se encontra o _Redis_, _MongoDB_ e o _Swagger_.

A sequencia de esperada comandos é a seguinte:

- `docker compose up -d`
- `npm install` or `yarn`
- `npm run dev` or `yarn dev`

Obs: A UI do Swagger vai estar acessível através do "servidor" na porta configurada no `docker-compose.yml` 