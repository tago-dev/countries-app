# Countries Explorer - Desafio Técnico

## Descrição do Projeto

Este projeto foi desenvolvido como parte de um desafio técnico, consistindo em uma aplicação Angular que consome a API REST Countries para exibir informações sobre países de todo o mundo. A aplicação permite visualizar, pesquisar e obter detalhes sobre cada país.

## Tecnologias Utilizadas

- **Angular**: Framework front-end para construção da interface
- **PrimeNG**: Biblioteca de componentes UI para Angular
- **PrimeFlex**: Biblioteca de utilidades CSS
- **RxJS**: Biblioteca para programação reativa
- **REST Countries API**: API pública para obtenção de dados dos países

## Funcionalidades

- **Listagem de Países**: Visualização de países em cards com bandeira e informações básicas
- **Pesquisa**: Busca de países por nome, região ou capital
- **Paginação**: Navegação entre páginas de resultados
- **Detalhes do País**: Visualização de informações detalhadas sobre cada país
- **Responsividade**: Layout adaptável para diferentes tamanhos de tela

## Estrutura do Projeto

A aplicação segue uma arquitetura de componentes organizada com:

- **Componentes**: Elementos reutilizáveis da interface
- **Serviços**: Lógica de negócio e comunicação com APIs
- **Interfaces**: Tipagem de dados
- **Estilos**: Customizações CSS/SCSS

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM (normalmente instalado com o Node.js)
- Angular CLI (instalado globalmente é recomendado)

### Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. Navegue até a pasta do projeto:
   ```bash
   cd countries-app
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

### Execução

Para iniciar o servidor de desenvolvimento:
```bash
ng serve
```

Acesse a aplicação em seu navegador:
```
http://localhost:4200
```

Para compilar o projeto para produção:
```bash
ng build --prod
```

## Abordagem de Desenvolvimento

Este projeto foi desenvolvido seguindo as melhores práticas de Angular:

1. **Componentes Standalone**: Utilização do novo padrão de componentes independentes
2. **Lazy Loading**: Carregamento sob demanda para melhor performance
3. **RxJS**: Manipulação de dados assíncronos com Observables
4. **Componentes PrimeNG**: Uso de biblioteca para agilizar o desenvolvimento da UI
5. **CSS Customizável**: Uso de variáveis CSS para tema consistente

## Desafios e Soluções

Durante o desenvolvimento, alguns desafios foram superados:

- **Performance na Pesquisa**: Implementação de debounce para evitar requisições desnecessárias
- **Responsividade**: Adaptação do layout para diferentes dispositivos usando grid e media queries
- **Estilização Consistente**: Criação de um tema unificado usando variáveis CSS

## Melhorias Futuras

Algumas melhorias que poderiam ser implementadas:

- Cache de dados para reduzir requisições à API
- Testes unitários e de integração
- Implementação de PWA para uso offline
- Mais opções de filtros e ordenação
- Modo escuro

---

Este projeto foi desenvolvido como parte de um desafio técnico para demonstrar habilidades em desenvolvimento front-end com Angular.
