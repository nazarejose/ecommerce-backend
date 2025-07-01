# API de E-commerce com Node.js e Sequelize

Esta é uma API RESTful completa para um sistema de e-commerce, construída com Node.js, Express e Sequelize. A API inclui gerenciamento de usuários, categorias e produtos, com autenticação baseada em JWT (JSON Web Token).

## Índice

* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Estrutura de Diretórios](#estrutura-de-diretórios)
* [Pré-requisitos](#pré-requisitos)
* [Instalação e Execução](#instalação-e-execução)
* [Configuração do Ambiente (.env)](#configuração-do-ambiente-env)
* [Populando o Banco de Dados](#populando-o-banco-de-dados)
* [Endpoints da API](#endpoints-da-api)

## Tecnologias Utilizadas

* **Node.js**: Ambiente de execução JavaScript no servidor.
* **Express.js**: Framework para criação da API e gerenciamento de rotas.
* **Sequelize**: ORM (Object-Relational Mapper) para interagir com o banco de dados de forma produtiva.
* **MySQL**: Banco de dados relacional para persistência de dados.
* **JSON Web Tokens (JWT)**: Para autenticação e proteção de rotas.
* **Bcrypt**: Para hashing e segurança de senhas.
* **Dotenv**: Para gerenciamento de variáveis de ambiente.

## Estrutura de Diretórios

A estrutura do projeto foi organizada para separar as responsabilidades, facilitando a manutenção e escalabilidade.

```
api-backend-ecommerce/
├── node_modules/
├── src/
│   ├── config/         # Configurações do Sequelize.
│   ├── controllers/    # Lógica de negócio (recebe requisições e envia respostas).
│   ├── middleware/     # Funções que rodam entre a requisição e o controller (ex: autenticação).
│   ├── migrations/     # Arquivos de migração do banco de dados (histórico de alterações).
│   ├── models/         # Definição dos modelos do banco de dados.
│   └── routes/         # Definição dos endpoints da API.
├── uploads/            # Pasta para onde as imagens dos produtos são salvas.
├── .env                # Arquivo local com as variáveis de ambiente (NÃO ENVIAR PARA O GIT).
├── .env.example        # Arquivo de exemplo para as variáveis de ambiente.
├── .gitignore          # Arquivos e pastas a serem ignorados pelo Git.
├── .sequelizerc        # Configuração de caminhos para o Sequelize CLI.
├── package.json        # Dependências e scripts do projeto.
└── README.md           # Documentação do projeto.
```

## Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 14 ou superior)
* [MySQL](https://www.mysql.com/) (ou outro banco de dados compatível)

## Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/nazarejose/ecommerce-backend.git
    cd api-backend-ecommerce
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    * Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
        ```bash
        cp .env.example .env
        ```
    * Abra o arquivo `.env` e preencha com suas credenciais do banco de dados e o JWT.

4.  **Configure o banco de dados:**
    * Acesse o seu cliente MySQL e crie um novo banco de dados com o nome que você definiu em `DB_NAME` no arquivo `.env`.

5.  **Execute as migrations:**
    * Este comando criará todas as tabelas no banco de dados.
        ```bash
        npx sequelize-cli db:migrate
        ```

6.  **Execute o servidor:**
    * Para ambiente de desenvolvimento com reinicialização automática:
        ```bash
        npm run dev
        ```
    * Para produção:
        ```bash
        npm start
        ```
* O servidor estará rodando em `http://localhost:3000` (ou na porta definida em seu arquivo `.env`).

## Configuração do Ambiente (.env)

As seguintes variáveis de ambiente são necessárias para rodar o projeto.

* `PORT`: Porta em que o servidor irá rodar (padrão: 3000).
* `DB_HOST`: Host do banco de dados (padrão: 127.0.0.1).
* `DB_USER`: Usuário do banco de dados.
* `DB_PASS`: Senha do banco de dados.
* `DB_NAME`: Nome do banco de dados.
* `JWT_SECRET`: Uma string longa e aleatória para assinar os tokens JWT.

## Populando o Banco de Dados

Para testar a API, você pode usar os scripts SQL fornecidos durante o desenvolvimento para inserir dados de teste para categorias e produtos. Execute-os em um cliente SQL conectado ao seu banco.

## Endpoints da API

### Usuários (`/v1/user`)
* `POST /` - Cria um novo usuário.
* `POST /token` - Autentica um usuário e retorna um token JWT.
* `PUT /:id` - **[Protegido]** Atualiza os dados de um usuário.
* `DELETE /:id` - **[Protegido]** Deleta um usuário.

### Categorias (`/v1/category`)
* `GET /search` - Lista categorias com filtros, paginação e seleção de campos.
* `GET /:id` - Busca uma única categoria pelo ID.
* `POST /` - **[Protegido]** Cria uma nova categoria.
* `PUT /:id` - **[Protegido]** Atualiza uma categoria.
* `DELETE /:id` - **[Protegido]** Deleta uma categoria.

### Produtos (`/v1/product`)
* `GET /search` - Lista produtos com filtros avançados (texto, preço, categoria), paginação e seleção de campos.
* `GET /:id` - Busca um único produto pelo ID com todos os seus dados associados.
* `POST /` - **[Protegido]** Cria um novo produto com suas categorias, imagens e opções.
* `PUT /:id` - **[Protegido]** Atualiza um produto e seus dados associados.
* `DELETE /:id` - **[Protegido]** Deleta um produto.


## Conclusão

Este projeto foi desenvolvido como parte da formação da **Geração Tech 2.0**, em parceria com a **Digital College**. Agradeço à instituição pelo suporte, conteúdo de qualidade e pela oportunidade de aprimorar meus conhecimentos em desenvolvimento back-end.

