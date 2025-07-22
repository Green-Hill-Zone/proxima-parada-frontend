
# 🌍 Próxima Parada

> Uma plataforma moderna de turismo para descobrir os melhores destinos de viagem

<!-- ![Próxima Parada](docs/screenshot-login.png) -->

<img width="1449" height="931" alt="image" src="https://github.com/user-attachments/assets/12f73901-e52f-43bc-9f27-82f01c51c936" />

<img width="1561" height="904" alt="image" src="https://github.com/user-attachments/assets/b20e88b8-f776-48f7-9b3c-f28ac0987e8d" />


## 📋 Sobre o Projeto

**Próxima Parada** é uma aplicação web desenvolvida em React + TypeScript que oferece uma experiência moderna e responsiva para explorar pacotes de viagem. Com um design limpo e intuitivo, os usuários podem navegar entre diferentes destinos e fazer login na plataforma.

### ✨ Características Principais

- 🎨 **Interface Moderna**: Design responsivo com React Bootstrap
- 🚀 **Performance**: Construído com Vite para desenvolvimento rápido
- 📱 **Mobile-First**: Totalmente responsivo para todos os dispositivos
- 🔒 **Sistema de Login**: Autenticação segura e intuitiva
- 🧭 **Navegação**: React Router DOM para navegação fluida
- 📦 **Componentes Reutilizáveis**: Arquitetura modular e clean code

## 🛠️ Tecnologias Utilizadas

### Core
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida

### UI/UX
- **React Bootstrap** - Componentes UI responsivos
- **Bootstrap 5** - Framework CSS
- **React Router DOM** - Roteamento do lado do cliente

### Desenvolvimento
- **ESLint** - Linting e padronização de código
- **Git** - Controle de versão

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes globais reutilizáveis
│   ├── Header/          # Cabeçalho da aplicação
│   ├── Footer/          # Rodapé da aplicação
│   └── index.ts         # Exports dos componentes
├── pages/               # Páginas da aplicação
│   ├── Home/            # Página inicial
│   │   ├── components/  # Componentes específicos da Home
│   │   │   ├── HeroSection/     # Seção hero
│   │   │   ├── TravelCard/      # Card de pacotes
│   │   │   └── index.ts
│   │   ├── Home.tsx
│   │   └── index.ts
│   └── Login/           # Página de login
│       ├── components/  # Componentes específicos do Login
│       │   ├── LoginForm/       # Formulário de login
│       │   └── index.ts
│       ├── Login.tsx
│       └── index.ts
├── data/                # Dados mockados
│   └── mockData.ts      # Pacotes de viagem mock
├── hooks/               # Custom hooks
├── services/            # Serviços de API
├── store/               # Gerenciamento de estado
├── utils/               # Utilitários
├── styles/              # Estilos globais
└── tests/               # Testes
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16+)
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd proxima-parada-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo de desenvolvimento**
```bash
npm run dev
=======

