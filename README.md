# Habit Tracker

Um aplicativo minimalista para rastrear hábitos, permitindo que você adicione, visualize e gerencie seus hábitos diários de forma simples e eficaz.

[Acesse](https://habit-tracker-tawny-kappa.vercel.app/)

## Funcionalidades

- **Adicionar Hábitos**: Crie novos hábitos com nome, frequência e cor.
- **Visualização de Hábitos**: Veja seus hábitos pendentes e completados em um painel intuitivo.
- **Estatísticas**: Acompanhe seu progresso com taxas de conclusão e sequências de hábitos.
- **Modo Escuro**: Alternar entre modos claro e escuro para uma melhor experiência visual.

## Tecnologias Utilizadas

- **React**: Biblioteca para construção de interfaces de usuário.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
- **Supabase**: Backend como serviço para autenticação e armazenamento de dados.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasmarujo/habit-tracker.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd habit-tracker
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais do Supabase:
     ```
     VITE_SUPABASE_URL=seu_url_supabase
     VITE_SUPABASE_ANON_KEY=seu_chave_anonima
     ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Uso

- Acesse o aplicativo em `http://localhost:5173`.
- Crie uma conta ou faça login para começar a adicionar seus hábitos.
- Utilize o painel para gerenciar seus hábitos e acompanhar seu progresso.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ por Lucas Marujo**
