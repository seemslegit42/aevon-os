# Project Structure Overview

This document provides a high-level overview of the ΛΞVON OS project structure. Understanding the organization of the codebase is essential for effective development and contribution.

## Root Directory

The root directory contains configuration files, the main `package.json` for project dependencies and scripts, and top-level directories for source code, public assets, and documentation.

- **`.eslintrc.json`**: Configuration for ESLint, a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- **`.gitignore`**: Specifies intentionally untracked files that Git should ignore.
- **`.idx/`**: Directory related to IDX project environment configuration.
- **`.prettierignore`**: Specifies files that Prettier (code formatter) should ignore.
- **`.prettierrc.json`**: Configuration file for Prettier.
- **`.vscode/`**: Contains workspace-specific settings for Visual Studio Code.
- **`components.json`**: Potentially related to a component library or UI framework configuration (e.g., Shadcn/UI). Confirmed to be Shadcn/UI configuration via `CONFIGURATION.md`.
- **`docs/`**: Contains all project documentation, including strategic blueprints (`docs/READ-THIS-DO-NOT-DELETE.md`, `docs/blueprint.md`), core subsystem explanations (`docs/CORE-SUBSYSTEMS/`), and developer guides (like this `PROJECT_STRUCTURE.md`, `API_DOCUMENTATION.md`, etc.). This is the central place for all human-readable project information.
- **`next.config.js`**: Configuration file for Next.js.
- **`package-lock.json`**: Records the exact versions of dependencies used in the project.
- **`package.json`**: Lists project dependencies, scripts (build, dev, test, etc.), and other metadata.
- **`postcss.config.mjs`**: Configuration for PostCSS, a tool for transforming CSS with JavaScript.
- **`prisma/`**: Contains Prisma schema files (`schema.prisma`) for database modeling and migration.
- **`public/`**: Stores static assets that are publicly accessible, such as images, fonts, and favicons.
- **`src/`**: The heart of the application, containing all source code.
- **`tailwind.config.ts`**: Configuration file for Tailwind CSS.
- **`tsconfig.json`**: Configuration file for TypeScript.

## `src/` Directory

The `src/` directory is the primary location for the application's codebase.

- **`src/api/`**: Contains backend API route handlers that are *not* part of the Next.js `app` router. This might include specific handlers for AI, security, or system-level operations that are called internally or by external services.
    - **`src/api/ai/`**: Likely houses AI-specific API logic, possibly for transcription or other AI model interactions.
    - **`src/api/security/`**: API endpoints related to security features, potentially for AEGIS event handling.
    - **`src/api/system/`**: System-level API endpoints, perhaps for logging or statistics.

- **`src/app/`**: The core of the Next.js application, utilizing the App Router.
    - **`src/app/api/`**: Contains backend API route handlers built with the Next.js App Router. These are typically accessed via fetch requests from the frontend or external clients.
        - **`src/app/api/accounting/`**: API routes for accounting-related Micro-Apps or features.
        - **`src/app/api/agents/`**: API routes for managing or interacting with AI agents.
        - **`src/app/api/ai/`**: Further AI-related API routes, potentially for specific models or tasks like image generation, text generation, etc.
        - **`src/app/api/security/`**: Security-related API routes within the App Router context.
        - **`src/app/api/system/`**: System-related API routes within the App Router context.
    - **`src/app/(pages)/`**: Directories defining different pages/routes of the application (e.g., `src/app/armory/`, `src/app/loom/`). Each subdirectory typically contains a `page.tsx` file for the route's UI and potentially `layout.tsx` for shared layout.
        - **`src/app/armory/`**: Code related to the "ΛΞVON Λrmory" marketplace.
        - **`src/app/loom/`**: Code related to the "Loom Studio" visual agent wiring interface.
    - **`src/app/globals.css`**: Global CSS styles applied to the entire application.
    - **`src/app/layout.tsx`**: The root layout component for the application.
    - **`src/app/page.tsx`**: The main landing page of the application.

- **`src/components/`**: Contains reusable UI components used throughout the application.
    - **`src/components/beep/`**: Components specifically for the BEEP conversational interface.
    - **`src/components/layout/`**: Layout-specific components (e.g., TopBar, NotificationCenter).
    - **`src/components/micro-apps/`**: Components related to the general structure or shell of Micro-Apps.
    - **`src/components/ui/`**: Likely holds base UI elements, often from a library like Shadcn/UI (e.g., Button, Card, Dialog).

- **`src/config/`**: Project-wide configuration files or constants.
    - **`src/config/app-registry.ts`**: Potentially a registry for all available Micro-Apps.
    - **`src/config/avatar-presets.config.ts`**: Configuration for avatar presets, possibly for BEEP or user profiles.

- **`src/docs/`**: Contains a copy of `READ-THIS-DO-NOT-DELETE.md`. It's unusual to have a `docs` directory inside `src`. This might be an artifact or serve a specific build purpose. (The main `docs` directory is at the project root).

- **`src/hooks/`**: Custom React hooks to encapsulate reusable stateful logic and side effects.

- **`src/lib/`**: Utility functions, helper modules, and core libraries.
    - **`src/lib/ai/`**: Core AI logic, agent definitions (LangGraph), and interactions with AI services (e.g., Groq).
    - **`src/lib/shaders/`**: GLSL shader code, likely for advanced visual effects (e.g., the 3D BEEP avatar).
    - **`src/lib/db.ts`**: Database client setup and utility functions (likely Prisma).
    - **`src/lib/event-bus.ts`**: An event bus implementation for inter-component communication.

- **`src/micro-apps/`**: Contains the implementations of individual Micro-Apps. Each subdirectory typically represents a distinct Micro-App.
    - **`src/micro-apps/(micro-app-name)/component.tsx`**: The main React component for the Micro-App's UI.
    - **`src/micro-apps/(micro-app-name)/index.ts`**: Entry point for the Micro-App, often exporting its definition or main component.
    - **`src/micro-apps/(micro-app-name)/schemas.ts`**: Data schemas or types specific to the Micro-App.
    - **`src/micro-apps/(micro-app-name)/store.ts`**: State management store (e.g., Zustand) for the Micro-App.

- **`src/prisma/`**: Contains a copy of `schema.prisma`. This is redundant if `prisma/schema.prisma` exists at the root. (The main `prisma` directory is at the project root).

- **`src/services/`**: Business logic services that encapsulate interactions with APIs, databases, or external systems. These services are typically used by API routes and potentially by frontend components via hooks.

- **`src/stores/`**: Global state management stores (e.g., Zustand stores) for application-wide state.

- **`src/types/`**: TypeScript type definitions and interfaces used across the project.

This structure promotes modularity and separation of concerns, aligning with the agentic and Micro-App-centric architecture of ΛΞVON OS.
