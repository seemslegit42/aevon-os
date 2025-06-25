# Services Documentation

This document details the business logic services found within the `src/services/` directory. Services encapsulate specific functionalities, interact with the database (via Prisma), call external APIs, or perform other backend operations. They are typically consumed by API route handlers. All functions within these services are server-side and asynchronous.

## General Principles

- Services are written in TypeScript and marked with `'use server';`.
- They primarily interact with the Prisma ORM for database operations (using `prisma` from `src/lib/db.ts`).
- Services abstract complex logic away from API route handlers, promoting cleaner code.
- Data validation for creation/update operations often relies on schemas defined elsewhere (e.g., `src/micro-apps/accounting/schemas.ts`).

---

## Accounting Service

- **File:** `src/services/accounting.service.ts`
- **Description:** Handles business logic related to accounting features, specifically managing invoices and transactions.
- **Key Functions:**
    - **`createInvoice(data: InvoiceFormValues): Promise<Invoice>`**
        - Creates a new invoice in the database.
        - Parameters:
            - `data`: An object conforming to `InvoiceFormValues` (from `src/micro-apps/accounting/schemas.ts`), containing `client`, `amount`, `dueDate`, and `status`.
        - Returns: A `Promise` that resolves to the newly created `Invoice` object.
    - **`listInvoices(): Promise<Invoice[]>`**
        - Fetches all invoices from the database, ordered by `dueDate` in descending order.
        - Returns: A `Promise` that resolves to an array of `Invoice` objects.
    - **`createTransaction(data: TransactionFormValues): Promise<Transaction>`**
        - Creates a new transaction in the database.
        - Parameters:
            - `data`: An object conforming to `TransactionFormValues` (from `src/micro-apps/accounting/schemas.ts`), containing `date`, `account`, `type`, `debit` (optional), and `credit` (optional).
        - Returns: A `Promise` that resolves to the newly created `Transaction` object.
    - **`listTransactions(): Promise<Transaction[]>`**
        - Fetches all transactions from the database, ordered by `date` in descending order.
        - Returns: A `Promise` that resolves to an array of `Transaction` objects.
- **Dependencies:**
    - `prisma` from `@/lib/db`
    - `InvoiceFormValues`, `TransactionFormValues` types from `@/micro-apps/accounting/schemas`
    - Prisma-generated types: `Invoice`, `Transaction`
- **Notes:**
    - This service is primarily used by API routes in `src/app/api/accounting/`.

---

## Agent Management Service

- **File:** `src/services/agent-management.service.ts`
- **Description:** Manages the lifecycle (creation, listing, updating, deletion) and configuration of AI agents within the system.
- **Data Interfaces:**
    - `CreateAgentData`:
      ```typescript
      export interface CreateAgentData {
          name: string;
          type: AgentType; // Prisma enum
          description: string;
      }
      ```
    - `UpdateAgentData`:
      ```typescript
      export interface UpdateAgentData {
          name?: string;
          description?: string;
      }
      ```
- **Key Functions:**
    - **`createAgent(data: CreateAgentData): Promise<Agent>`**
        - Creates a new agent in the database with a default `status` of `'idle'`.
        - Parameters:
            - `data`: An object conforming to `CreateAgentData`.
        - Returns: A `Promise` that resolves to the newly created `Agent` object.
    - **`listAgents(): Promise<Agent[]>`**
        - Fetches all agents from the database, ordered by `createdAt` in descending order.
        - Returns: A `Promise` that resolves to an array of `Agent` objects.
    - **`deleteAgent(agentId: string): Promise<void>`**
        - Deletes an agent from the database using its ID.
        - Parameters:
            - `agentId`: The string ID of the agent to delete.
        - Returns: A `Promise` that resolves when the operation is complete.
    - **`updateAgent(agentId: string, data: UpdateAgentData): Promise<Agent>`**
        - Updates an existing agent's `name` and/or `description`.
        - Parameters:
            - `agentId`: The string ID of the agent to update.
            - `data`: An object conforming to `UpdateAgentData`.
        - Returns: A `Promise` that resolves to the updated `Agent` object.
- **Dependencies:**
    - `prisma` from `@/lib/db`
    - Prisma-generated types: `Agent`, `AgentType`
- **Notes:**
    - This service is primarily used by API routes in `src/app/api/agents/`.

---

*(Further services like `aegis.service.ts`, `agent.service.ts`, `system-monitor.service.ts` will be documented here following this structure.)*
