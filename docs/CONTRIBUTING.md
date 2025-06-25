# Contributing to ΛΞVON OS

Thank you for your interest in contributing to ΛΞVON OS! We aim to build a robust, elegant, and highly performant Agentic Operating System. Your contributions are valuable in achieving this vision.

## Core Philosophy & Mindset

Before you start, please familiarize yourself with our core philosophies:

- **Agent Onboarding Protocol (`docs/AGENT-ONBOARDING-PROTOCOL.md`):** Understand that ΛΞVON OS is not a typical web app. You are building for an agentic system. Micro-Apps are key, and interactions flow through AI agents (BEEP) and LangGraph orchestrations.
- **Production Mindset (`docs/PRODUCTION-MINDSET.md`):** All code should be written as if it's going directly to production. This means a strong emphasis on reliability, observability, reusability, and thorough testing.
- **Ancient Roman Glass Aesthetic (`docs/blueprint.md`):** UI components and Micro-Apps should adhere to the defined style guidelines: glassmorphism, specific color palettes, and typography.

## Getting Started

1.  **Fork the repository:** Create your own fork of the main ΛΞVON OS repository.
2.  **Clone your fork:** `git clone https://github.com/YOUR_USERNAME/aevon-os.git`
3.  **Create a branch:** `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
4.  **Install dependencies:** Run `npm install` (or `yarn install` / `pnpm install` depending on the project's package manager - check `package.json`).
5.  **Set up environment variables:** Ensure you have a `.env.local` file with necessary environment variables (e.g., `DATABASE_URL`, `GROQ_API_KEY`, etc.). Refer to `.env.example` if available (to be created).

## Development Process

### Code Style & Conventions

- **TypeScript:** All new code should be written in TypeScript.
- **Formatting:** Code is formatted using Prettier. Please ensure your contributions are formatted before committing (`npm run format` - script to be added to `package.json`).
- **Linting:** ESLint is used for identifying code quality issues. Ensure your code passes lint checks (`npm run lint` - script to be added).
- **Naming Conventions:**
    - Components: PascalCase (e.g., `MyComponent.tsx`)
    - Functions/Variables: camelCase (e.g., `myFunction`)
    - Types/Interfaces: PascalCase (e.g., `type MyType = ...`)
- **Modularity:** Strive for small, focused modules and components. Micro-Apps should address a single business problem.
- **Comments:** Write clear and concise comments where necessary, especially for complex logic or non-obvious decisions. Document public functions and component props using TSDoc.

### Agent & Micro-App Development

- **Agent Controllability:** Micro-Apps must be designed to be controllable by AI agents via BEEP and LangGraph. Consider how an agent would interact with your Micro-App's functionality.
- **Context Awareness:** Micro-Apps should be context-aware, leveraging system state and user context where appropriate.
- **Performance:** Prioritize performance. Avoid unnecessary re-renders in React components. Optimize backend services and database queries.

### Testing

- **Unit Tests:** Write unit tests for services, utility functions, and complex component logic. (Testing framework like Jest/Vitest to be integrated).
- **Integration Tests:** Test interactions between different parts of the system (e.g., API and service, service and database).
- **End-to-End Tests:** (To be set up, e.g., using Playwright or Cypress) for testing user flows and agent interactions.
- **Run Tests:** Ensure all tests pass before submitting a pull request (`npm run test` - script to be added).

### Commit Messages

Follow the Conventional Commits specification. This helps in generating changelogs and makes the commit history more readable.
Example:
`feat: add new button variant for destructive actions`
`fix: correct calculation error in invoice service`
`docs: update CONTRIBUTING.md with testing guidelines`

Prefixes:
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation.

### Updating Documentation

- If your changes affect existing functionality, data models, APIs, components, or core concepts, please update the relevant documentation in the `docs/` directory.
- For new Micro-Apps, components, or services, create new documentation pages following the established templates.

## Submitting Pull Requests

1.  Push your changes to your fork: `git push origin feature/your-feature-name`.
2.  Open a pull request (PR) against the `main` branch of the official ΛΞVON OS repository.
3.  Provide a clear title and description for your PR, explaining the changes and referencing any related issues.
4.  Ensure your PR passes all automated checks (linting, testing, builds).
5.  Be prepared to address feedback and make changes if requested during the review process.

## Code of Conduct

While a formal Code of Conduct is not yet in place, please be respectful and constructive in all interactions. We aim to foster a positive and collaborative community.

---

By contributing to ΛΞVON OS, you agree that your contributions will be licensed under the project's license (to be determined and added).
