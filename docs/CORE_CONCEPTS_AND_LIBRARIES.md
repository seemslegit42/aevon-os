# Core Concepts and Libraries Documentation

This document explains the fundamental concepts, architectural patterns, and key libraries that underpin the ΛΞVON OS. Understanding these is crucial for developing within the ecosystem.

## Core Architectural Concepts

These concepts are derived from the existing `docs/` materials and define the unique nature of ΛΞVON OS.

### 1. ΛΞVON OS - The Agentic Operating System

- **Description:** ΛΞVON OS is not a traditional web application or SaaS product. It's an "Agentic Operating System" designed for autonomous workflows. It emphasizes modularity, AI-driven interactions, and a persistent, dynamic workspace.
- **Key Principles:**
    - **Modularity:** Achieved through Micro-Apps.
    - **AI-Native:** Interactions and operations are heavily reliant on AI agents and systems like BEEP and LangGraph.
    - **Agentic Control:** Users primarily interact with the OS and its functionalities through conversational commands to AI agents.
    - **Minimalism & Elegance:** A design philosophy emphasizing "sharp, elegant, minimal, and lethal" tools, avoiding bloat and unnecessary complexity.

### 2. Micro-Apps

- **Description:** Micro-Apps are the "atomic units of utility" in ΛΞVON OS. They are self-contained, modular applications that solve specific business problems.
- **Characteristics:**
    - Draggable, resizable, and stackable within the Canvas workspace.
    - Dynamically registered and launched (likely via `src/config/app-registry.ts` and Zustand stores).
    - Must be agent-controllable (respond to BEEP commands).
    - Context-aware.
    - Adhere to the "Ancient Roman Glass" aesthetic.
- **Location:** Implemented in `src/micro-apps/`.

### 3. Core Subsystems (Not Micro-Apps)

These are foundational, privileged layers of the OS, distinct from user-launchable Micro-Apps.

#### a. BEEP (Behavioral Event & Execution Processor)

- **Reference:** `docs/CORE-SUBSYSTEMS/BEEP.md`
- **Description:** The conversational command core of ΛΞVON OS. It's an always-on, privileged interface for system-wide control via natural language.
- **Functionality:**
    - Parses user commands and dispatches agentic workflows (via Loom Studio or the core LangGraph agent).
    - Embeds contextual intelligence.
    - Integrated with Aegis (security) and Loom Studio (workflow building).
    - Lives in the persistent UI shell (likely the `TopBar`).
- **Components:** UI elements for BEEP are in `src/components/beep/`. The core agent logic is in `src/lib/ai/agent.ts`.

#### b. Loom Studio

- **Reference:** `docs/CORE-SUBSYSTEMS/LOOM-STUDIO.md`
- **Description:** A native, privileged orchestration layer for visually wiring agents, workflows, and prompt chains. It's the primary interface for inspecting and manipulating agentic logic.
- **Functionality:**
    - Provides runtime debugging, observability, and configuration for LangGraph graphs (or similar workflow definitions).
    - AI-assisted workflow generation from natural language prompts (powered by `src/lib/ai/loom-flow.ts`).
    - Lives in the persistent Canvas layer.
    - Can interact with Micro-Apps, BEEP, and Aegis.
- **Location:** UI and logic primarily in `src/app/loom/`. AI generation logic in `src/lib/ai/loom-flow.ts`.

#### c. AEGIS

- **Reference:** `docs/CORE-SUBSYSTEMS/AEGIS.md`
- **Description:** An embedded, always-on AI-powered cybersecurity subsystem. It operates globally across the OS.
- **Functionality:**
    - Anomaly detection and threat monitoring.
    - Sends alerts, events, and state changes to BEEP, Loom Studio, and subscribed Micro-Apps.
    - Its status and events directly influence the BEEP agent's behavior via the system prompt.
    - It's a native runtime layer, not a Micro-App itself, though companion Micro-Apps might display Aegis data.
- **Service:** `src/services/aegis.service.ts` handles its backend logic and event retrieval.

### 4. Agentic Workflows & LangGraph

- **Description:** ΛΞVON OS's core operations are driven by AI agents orchestrated using LangGraph. These agents, particularly the main conversational agent BEEP, perform tasks, interact with Micro-Apps, manage UI elements, and drive automation throughout the OS.
- **Core Agent (`src/lib/ai/agent.ts` - Powers BEEP):**
    - **Architecture:** Implemented as a sophisticated LangGraph `StateGraph`. This allows for complex, multi-step reasoning and tool use.
    - **State (`AgentState`):** The agent maintains a comprehensive state that includes:
        - `messages`: History of the conversation.
        - `layout`: Current state of the user's UI workspace (Micro-Apps open, their positions, etc.).
        - `loomState`: Current state of the Loom Studio workflow editor, if active.
        - `currentRoute`: The user's current navigation path within the OS.
        - `activeMicroAppPersona`: Persona information if the user is interacting with a Micro-App that has a specific AI persona.
    - **Language Model (LLM):** Primarily uses `ChatGroq` with the `llama3-70b-8192` model, chosen for its speed in conversational contexts.
    - **Dynamic System Prompt:** A highly contextual system prompt is generated for the LLM on each turn. This prompt incorporates real-time information from the `AgentState` (UI layout, Loom state, current route, active persona) and critical AEGIS security alerts. This rich, dynamic context is key to the agent's ability to provide relevant and aware responses.
    - **Tools:** The agent is equipped with an extensive array of tools (functions it can call) to interact with the OS, external services, and generate information. These include, but are not limited to:
        - Internal knowledge base search (`searchKnowledgeBaseTool`).
        - Workspace analysis and UI manipulation (`generateWorkspaceInsightsTool`, `addItemTool`, `focusItemTool`, `removeItemTool`, `resetLayoutTool`).
        - Content generation and processing (`generateMarketingContentTool`, `summarizeWebpageTool`, `extractInvoiceDataTool`).
        - Specialized business logic tools (e.g., `createInvoiceTool`, `generateVinTool`).
        - System monitoring and security (`analyzeSecurityAlertTool`, `getSystemHealthReportTool`).
        - Tools for executing and interacting with Loom Studio workflows (`evaluateConditionTool`, `executeDataTransformTool`, `executeLoomWorkflowTool`).
        - **Critical Safety Tool:** `requestHumanActionTool` is used to obtain explicit user confirmation before performing any sensitive or potentially destructive actions (e.g., deleting data, modifying configurations).
    - **Logging & Monitoring:** Agent actions and tool calls are logged via the `action-log.service` for traceability and debugging.
    - **Sentiment Analysis:** The agent's text responses are analyzed for emotional tone (using `getEmotionFromText` from `src/lib/sentiment-parser.ts`), which can be used to influence BEEP's avatar or other UI feedback.
- **Loom Workflow Generation (`src/lib/ai/loom-flow.ts` - Powers Loom Studio's AI features):**
    - This module enables AI-assisted creation of workflows within Loom Studio.
    - It uses a Google Gemini model (via the Vercel AI SDK's `generateObject` function) to translate a user's natural language prompt into a structured JSON representation of a workflow, including nodes, connections, and initial configurations.

## Key Libraries and Utilities (`src/lib/`)

This section details important custom libraries and utilities found in `src/lib/`.

### 1. Database (`src/lib/db.ts`)

- **Description:** Initializes and exports a singleton Prisma client instance.
- **Enhancements:** Uses `withAccelerate()` from `@prisma/extension-accelerate` for potentially faster database queries through connection pooling.
- **Usage:** Imported by services in `src/services/` to interact with the database.
- **Schema:** Defined in `prisma/schema.prisma`.

### 2. AI Libraries (`src/lib/ai/`)

- **`src/lib/ai/agent.ts`**: (Described in detail under "Agentic Workflows & LangGraph" above). This is the heart of BEEP's intelligence and capabilities.
- **`src/lib/ai/groq.ts`**:
    - Configures and exports AI SDK clients for multiple providers:
        - `groq`: For Groq's OpenAI-compatible API (likely primary for speed).
        - `google`: For Google Generative AI (e.g., Gemini, used in `loom-flow.ts`).
        - `openai`: For OpenAI models.
    - Also exports a direct `groqSdk` instance from `groq-sdk`, possibly for features not fully supported by `ai-sdk` (e.g., audio transcription).
    - This setup allows flexibility in choosing the best model for different tasks (e.g., Groq for conversational speed, Gemini for complex generation).
- **`src/lib/ai/loom-flow.ts`**: (Described under "Loom Workflow Generation" above). Powers the AI-driven creation of workflows in Loom Studio.
- **`src/lib/ai-schemas.ts`**: (Inferred from `agent.ts` imports) Defines Zod schemas for validating the outputs of AI object generation and tool calls (e.g., `AiInsightsSchema`, `InvoiceDataSchema`).

### 3. Utility Functions (`src/lib/utils.ts`)

- **Description:** A collection of general-purpose utility functions.
- **Contents:**
    - `cn`: Utility from `clsx` and `tailwind-merge` for conditionally joining CSS class names, crucial for dynamic styling with Tailwind CSS.
    - `generateNodeId(type: string, title: string, index: number | string): string`: Generates unique node IDs, likely used in Loom Studio or other graph-based interfaces.

### 4. Event Bus (`src/lib/event-bus.ts`)

- **Description:** Implements a typed, application-wide event emitter using the `mitt` library.
- **Purpose:** Facilitates decoupled communication between different parts of the application (e.g., BEEP, Loom, Micro-Apps, UI panels).
- **Defined Events (`AppEvents` type):**
    - `beep:submitQuery`, `beep:response`, `beep:setEmotion`
    - `loom:flow-generated`, `loom:open-templates`
    - `orchestration:log`
    - `panel:focus`
    - And others, indicated by `[key: string]: unknown;` allowing for extension.

### 5. Shaders (`src/lib/shaders/`)

- **Description:** Contains GLSL (OpenGL Shading Language) code used for advanced 2D/3D visual effects.
- **Example:** `src/lib/shaders/beep-3d-sphere-vertex.glsl.ts` is used by the `BeepAvatar3D` component to render the dynamic particle sphere.
- **Usage:** Typically imported as strings and used within Three.js shader materials.

### 6. Other Notable Libraries (Inferred from `agent.ts`):

- **`@langchain/langgraph`**: The core library for building the agent's stateful, graph-based workflow.
- **`@langchain/core`, `@langchain/groq`**: LangChain components for messages, tools, and LLM integrations.
- **`ai` (Vercel AI SDK)**: Used for `generateObject` and potentially other AI model interactions, working alongside LangChain.
- **`zod`**: Used extensively for schema definition and data validation, especially for tool inputs/outputs and AI-generated objects.
- **`src/lib/sentiment-parser.ts`**: (Inferred) Likely contains logic for `getEmotionFromText`, used to analyze agent responses.

This detailed understanding of the core concepts and `src/lib` contents provides a strong foundation for grasping how ΛΞVON OS functions.
