# Data Model Documentation (Prisma Schema)

This document outlines the data models used in ΛΞVON OS, as defined in the `prisma/schema.prisma` file. Prisma is used as the ORM for interacting with the PostgreSQL database.

## General Notes

- **Primary Keys:** Most models use a `String` `id` field with `@id @default(cuid())` as the primary key.
- **Timestamps:** Common timestamp fields include `createdAt` (defaults to `now()`) and `updatedAt` (updates on modification).
- **Enums:** Several enums are defined to constrain the values of specific fields (e.g., `AgentType`, `SeverityLevel`, `InvoiceStatus`, `TransactionType`).
- **Relations:** Relationships between models are defined using `@relation`.

## Agent & System Models

These models are central to the functioning of AI agents and system-level operations.

### 1. `Agent`

Represents an AI agent within the system.

| Field           | Type        | Attributes                      | Description                                     |
|-----------------|-------------|---------------------------------|-------------------------------------------------|
| `id`            | `String`    | `@id @default(cuid())`          | Unique identifier for the agent.                |
| `createdAt`     | `DateTime`  | `@default(now())`               | Timestamp of when the agent was created.        |
| `updatedAt`     | `DateTime`  | `@updatedAt`                    | Timestamp of the last update to the agent.      |
| `name`          | `String`    | `@unique`                       | Unique name of the agent.                       |
| `description`   | `String`    |                                 | A description of the agent's purpose/capabilities. |
| `type`          | `AgentType` |                                 | The type or category of the agent (see enum).   |
| `status`        | `String`    | `@default("idle")`              | Current status of the agent (e.g., "idle", "active"). |
| `invocations`   | `Int`       | `@default(0)`                   | Number of times the agent has been invoked.     |
| `lastInvokedAt` | `DateTime?` |                                 | Timestamp of the last invocation. Optional.     |
| `logs`          | `ActionLog[]`| `@relation`                    | Related action logs performed by this agent.    |
| `events`        | `SecurityEvent[]`| `@relation`                 | Related security events involving this agent.   |

**Enum: `AgentType`**

Defines the categories for agents.

- `CONVERSATIONAL`
- `WEB_INTELLECT`
- `TASK_ORCHESTRATOR`
- `CONTENT_SYNTHESIZER`
- `DATA_CRUNCHER`
- `SUPPORT_RESPONDER`

### 2. `ActionLog`

Records actions performed by agents, typically tool calls.

| Field       | Type        | Attributes                      | Description                                     |
|-------------|-------------|---------------------------------|-------------------------------------------------|
| `id`        | `String`    | `@id @default(cuid())`          | Unique identifier for the log entry.            |
| `timestamp` | `DateTime`  | `@default(now())`               | Timestamp of when the action occurred.          |
| `agentId`   | `String`    |                                 | ID of the agent that performed the action.      |
| `agent`     | `Agent`     | `@relation(...) onDelete: Cascade`| Relation to the `Agent` model.                  |
| `toolName`  | `String`    |                                 | Name of the tool that was called.               |
| `arguments` | `Json?`     |                                 | Arguments passed to the tool (JSON format). Optional. |
| `status`    | `String`    |                                 | Outcome of the action (e.g., "success", "failure"). |
| `result`    | `Json?`     |                                 | Result returned by the tool (JSON format). Optional. |
| `tokens`    | `Int?`      |                                 | Number of tokens consumed by the action (if applicable). Optional. |

### 3. `SecurityEvent`

Logs security-related events detected by the AEGIS subsystem or other parts of the OS.

| Field       | Type            | Attributes                          | Description                                   |
|-------------|-----------------|-------------------------------------|-----------------------------------------------|
| `id`        | `String`        | `@id @default(cuid())`              | Unique identifier for the security event.     |
| `timestamp` | `DateTime`      | `@default(now())`                   | Timestamp of when the event occurred.         |
| `type`      | `String`        |                                     | Type of security event (e.g., "unauthorized_access", "anomaly_detected"). |
| `severity`  | `SeverityLevel` |                                     | Severity of the event (see enum).             |
| `details`   | `Json`          |                                     | Detailed information about the event (JSON format). |
| `agentId`   | `String?`       |                                     | ID of the agent involved, if any. Optional.   |
| `agent`     | `Agent?`        | `@relation(...) onDelete: SetNull`  | Relation to the `Agent` model. Optional.    |

**Enum: `SeverityLevel`**

Defines the severity levels for security events.

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

## Accounting Micro-App Models

These models support the functionality of the Accounting Micro-App.

### 1. `Invoice`

Represents a financial invoice.

| Field       | Type          | Attributes                 | Description                                     |
|-------------|---------------|----------------------------|-------------------------------------------------|
| `id`        | `String`      | `@id @default(cuid())`     | Unique identifier for the invoice.              |
| `createdAt` | `DateTime`    | `@default(now())`          | Timestamp of when the invoice was created.      |
| `updatedAt` | `DateTime`    | `@updatedAt`               | Timestamp of the last update to the invoice.    |
| `client`    | `String`      |                            | Name or identifier of the client.               |
| `amount`    | `Float`       |                            | Total amount of the invoice.                    |
| `dueDate`   | `DateTime`    |                            | Date when the invoice payment is due.           |
| `status`    | `InvoiceStatus`| `@default(DRAFT)`         | Current status of the invoice (see enum).       |

**Enum: `InvoiceStatus`**

Defines the possible statuses for an invoice.

- `DRAFT`
- `SENT`
- `PAID`
- `OVERDUE`

### 2. `Transaction`

Represents a financial transaction.

| Field     | Type            | Attributes              | Description                                     |
|-----------|-----------------|-------------------------|-------------------------------------------------|
| `id`      | `String`        | `@id @default(cuid())`  | Unique identifier for the transaction.          |
| `createdAt`| `DateTime`     | `@default(now())`       | Timestamp of when the transaction was recorded. |
| `date`    | `DateTime`      |                         | Actual date of the transaction.                 |
| `account` | `String`        |                         | Account affected by the transaction.            |
| `type`    | `TransactionType`|                         | Type of transaction (see enum).                 |
| `debit`   | `Float?`        |                         | Debit amount. Optional.                         |
| `credit`  | `Float?`        |                         | Credit amount. Optional.                        |

**Enum: `TransactionType`**

Defines the types of financial transactions.

- `INCOME`
- `EXPENSE`
- `ASSET`
- `LIABILITY`
- `EQUITY`
---

This documentation provides a snapshot of the database schema. For the most current details, always refer to `prisma/schema.prisma`.
