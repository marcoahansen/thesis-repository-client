# Cliente do Repositório de Teses

Este projeto é um cliente para o repositório de teses, desenvolvido com **React** e **Vite**, utilizando **TypeScript**.

## Tabela de Conteúdos

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Scripts](#scripts)
- [Licença](#licença)

## Visão Geral

Este cliente permite aos usuários interagir com o repositório de teses, oferecendo funcionalidades para submissão, visualização e pesquisa de teses. Ele é construído com uma interface moderna e responsiva.

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **[React](https://reactjs.org/)**: Uma biblioteca para construção de interfaces de usuário.
- **[Vite](https://vitejs.dev/)**: Um bundler e servidor de desenvolvimento rápido para projetos front-end.
- **[TypeScript](https://www.typescriptlang.org/)**: Um superconjunto tipado de JavaScript que melhora a robustez do código.

## Pré-requisitos

Certifique-se de ter o seguinte instalado antes de começar:

- **[Node.js](https://nodejs.org/)**: Versão LTS recomendada.
- **[pnpm](https://pnpm.io/)**: Gerenciador de pacotes alternativo ao npm.

## Instalação

Siga estes passos para configurar o projeto localmente:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/marcoahansen/thesis-repository-client.git
   cd theses-repository-client
   ```

2. **Instale as dependências usando pnpm:**

   ```bash
   pnpm install
   ```

## Uso

Para iniciar o servidor de desenvolvimento, use o seguinte comando:

```bash
pnpm run dev
```

O aplicativo estará disponível em:

```
http://localhost:5173
```

## Scripts

O projeto inclui alguns scripts pnpm para tarefas comuns:

- **`pnpm run dev`**: Inicia o servidor de desenvolvimento com Vite.
- **`pnpm run build`**: Compila o projeto para produção.
- **`pnpm run lint`**: Verifica o código em busca de problemas de estilo e qualidade.
- **`pnpm run preview`**: Visualiza a versão de produção.

## Licença

Este projeto é licenciado sob a Licença ISC. Veja o arquivo [LICENSE](./LICENSE) para detalhes.
