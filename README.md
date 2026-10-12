# Biblioteca Musical

Uma biblioteca musical interativa desenvolvida com **React e Vite**, ambientada no universo fictício de *Outbreak*, com foco na coleção musical de Raymond Thompson.

O projeto apresenta uma interface para explorar músicas, pesquisar por títulos e artistas, filtrar faixas por gênero e interagir com um player musical simulado.

## ✨ Funcionalidades

- **Biblioteca musical:** exibe as faixas cadastradas na coleção.
- **Busca dinâmica:** permite pesquisar músicas por título ou artista, ignorando diferenças entre letras maiúsculas, minúsculas e acentos.
- **Filtros por gênero:** organiza a coleção de acordo com os gêneros musicais disponíveis.
- **Player musical simulado:** permite selecionar faixas, reproduzir, pausar e navegar entre músicas.
- **Controle de tempo:** simula o avanço da reprodução e permite navegar pela duração da faixa.
- **Modo aleatório:** permite selecionar outra faixa de maneira aleatória.
- **Modo de repetição:** reinicia a faixa atual ao final da reprodução.
- **Navegação entre faixas:** permite avançar ou retornar à música anterior, respeitando a lista filtrada.
- **Indicador de reprodução:** informa qual música está selecionada e se a reprodução está ativa.
- **Interface modular:** utiliza componentes React reutilizáveis para organizar a aplicação.
- **Rodapé personalizado:** apresenta informações complementares por meio de um componente dedicado.

> **Observação:** o player é simulado. Atualmente, a aplicação controla o estado da reprodução e o tempo das faixas, mas não reproduz arquivos de áudio reais.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface e gerenciamento de estado. |
| Vite | Ambiente de desenvolvimento e ferramenta de build. |
| JavaScript (ES6+) | Implementação da lógica da aplicação. |
| HTML5 | Estruturação semântica do conteúdo. |
| CSS3 | Estilização da interface e dos componentes. |
| Bootstrap Icons | Ícones utilizados nos controles e elementos visuais. |

### Principais recursos do React utilizados

- `useState`: gerenciamento dos estados de busca, gênero, reprodução, tempo, modo aleatório e repetição.
- `useEffect`: atualização do relógio do player e tratamento do fim das faixas.
- `useMemo`: otimização dos cálculos de filtragem e seleção da música atual.
- `useCallback`: memorização de funções utilizadas nos controles do player.

## 📁 Estrutura do projeto

A estrutura abaixo representa a organização esperada dos arquivos utilizados pela aplicação:

```text
outbreak/
├── public/
│   └── outbreak_1.png
├── src/
│   ├── components/
│   │   ├── CardMusica.jsx
│   │   └── Rodape.jsx
│   ├── data/
│   │   └── musicas.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

A estrutura pode variar conforme a configuração inicial do projeto e os arquivos adicionais criados durante o desenvolvimento.

### Organização dos arquivos

- `App.jsx`: componente principal, responsável pela biblioteca, busca, filtros e lógica do player.
- `App.css`: estilos específicos da interface principal.
- `components/CardMusica.jsx`: componente responsável pela apresentação das músicas e pelos controles individuais.
- `components/Rodape.jsx`: componente do rodapé da aplicação.
- `data/musicas.js`: arquivo que armazena os dados das faixas musicais.
- `public/outbreak_1.png`: imagem utilizada na identidade visual do projeto.
- `main.jsx`: ponto de entrada da aplicação React.
- `package.json`: dependências, metadados e scripts do projeto.

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- npm, instalado junto com o Node.js.

### 1. Clone o repositório

Caso o projeto esteja hospedado no GitHub, execute:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd outbreak
```

Substitua `URL_DO_REPOSITORIO` pelo endereço real do repositório.

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o servidor de desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação. Normalmente, ele será:

```text
http://localhost:5173/
```

Acesse o endereço no navegador para utilizar a biblioteca musical.

### 4. Gere a versão de produção

Para compilar a aplicação:

```bash
npm run build
```

Os arquivos finais serão gerados no diretório `dist/`.

Para testar localmente a versão compilada, utilize:

```bash
npm run preview
```

## 🎵 Cadastro de músicas

As músicas são armazenadas em `src/data/musicas.js`.

Cada faixa deve seguir a estrutura de dados esperada pelos componentes da aplicação:

```javascript
const musicas = [
  {
    id: 1,
    titulo: "Nome da música",
    artista: "Nome do artista",
    duracao: 180,
    genero: "Rock",
    capa: ""
  }
];

export default musicas;
```

### Propriedades de cada faixa

| Propriedade | Descrição |
|---|---|
| `id` | Identificador único da música. |
| `titulo` | Nome da faixa musical. |
| `artista` | Nome do artista ou grupo musical. |
| `duracao` | Duração da faixa em segundos. |
| `genero` | Gênero musical utilizado nos filtros. |
| `capa` | Caminho ou endereço da imagem de capa, conforme a implementação do componente. |

Para adicionar uma nova música, basta incluir outro objeto no array, respeitando as propriedades utilizadas pela aplicação.

**Importante:** o arquivo deve exportar a biblioteca com `export default musicas`, pois o componente principal importa os dados por meio de uma exportação padrão.

## 🧠 Lógica de funcionamento

A aplicação utiliza os dados da biblioteca para construir dinamicamente a interface.

1. **Carregamento:** as músicas são importadas do arquivo `musicas.js`.
2. **Filtragem:** a coleção é atualizada de acordo com o gênero selecionado e o texto digitado na busca.
3. **Seleção:** ao escolher uma faixa, o player registra seu identificador e reinicia o contador de tempo.
4. **Reprodução simulada:** enquanto o player está ativo, um intervalo incrementa o tempo a cada segundo.
5. **Navegação:** os controles permitem avançar ou retornar entre as músicas filtradas.
6. **Finalização:** ao atingir a duração cadastrada, o player reinicia a faixa ou seleciona a próxima, dependendo do modo de repetição.
7. **Renderização:** os componentes React atualizam a interface conforme as mudanças de estado.

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de desenvolvimento pessoal.

Caso pretenda distribuir ou publicar o projeto, recomenda-se definir uma licença apropriada e verificar os direitos de uso das imagens, capas e demais recursos utilizados.