# API Documentation

This document provides details on the available API endpoints within the ΛΞVON OS. These endpoints are used by the frontend Micro-Apps and can also be utilized for third-party integrations where appropriate.

## General Principles

- All API routes are located under `/api/`.
- Requests and responses are typically in JSON format.
- **Authentication & Authorization:** Most, if not all, API endpoints require proper authentication (e.g., via session cookies, bearer tokens). Authorization mechanisms ensure that the authenticated user has the necessary permissions to perform the requested operation. Specific authentication details should be obtained from system architects or by inspecting authentication middleware/logic. Unauthorized requests will typically result in a `401 Unauthorized` or `403 Forbidden` status code.
- Standard HTTP status codes are used to indicate success or failure (e.g., `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).
- **Rate Limiting:** Some endpoints (e.g., `/api/accounting/invoices`) are subject to rate limiting to prevent abuse, returning a `429 Too Many Requests` error if limits are exceeded.

## API Endpoints

Endpoints are organized by their functionality.

---

### Accounting APIs

Base Path: `/api/accounting`

These endpoints handle operations related to financial data and accounting Micro-Apps.

#### 1. List Invoices

- **Endpoint:** `GET /api/accounting/invoices`
- **Description:** Retrieves a list of all invoices.
- **Request Parameters:**
    - None
- **Response:**
    - **Success (200 OK):**
      ```json
      [
        {
          "id": "inv_123xyz",
          "client": "Client A",
          "amount": 1500.75,
          "dueDate": "2023-12-31T00:00:00.000Z",
          "status": "SENT", // Example InvoiceStatus
          "createdAt": "2023-11-01T10:00:00.000Z",
          "updatedAt": "2023-11-01T10:00:00.000Z"
        }
        // ... more invoices
      ]
      ```
      *(The exact structure will depend on the `listInvoices` service and Prisma model)*
    - **Error (429 Too Many Requests):** If rate limit is exceeded.
        ```json
        { "error": "Too many requests" }
        ```
    - **Error (500 Internal Server Error):**
      ```json
      { "error": "Internal Server Error" }
      ```
- **Notes:**
    - Requires authentication.
    - Subject to rate limiting.

#### 2. Create Invoice

- **Endpoint:** `POST /api/accounting/invoices`
- **Description:** Creates a new invoice.
- **Request Body:**
  ```json
  {
    "client": "Client B",
    "amount": 250.00,
    "dueDate": "2024-01-15", // ISO 8601 date string
    "status": "DRAFT" // Optional, defaults to DRAFT. Must be a valid InvoiceStatus
  }
  ```
- **Request Body Schema (Zod):**
  ```typescript
  // From src/micro-apps/accounting/schemas.ts
  z.object({
    client: z.string().min(2, "Client name is required."),
    amount: z.coerce.number().positive("Amount must be positive."),
    dueDate: z.date(), // Handled as new Date(string) in the route
    status: z.nativeEnum(InvoiceStatus).default('DRAFT'), // InvoiceStatus from Prisma Client
  })
  ```
- **Response:**
    - **Success (201 Created):**
      ```json
      {
        "id": "inv_abc789",
        "client": "Client B",
        "amount": 250.00,
        "dueDate": "2024-01-15T00:00:00.000Z",
        "status": "DRAFT",
        "createdAt": "2023-11-15T12:00:00.000Z",
        "updatedAt": "2023-11-15T12:00:00.000Z"
      }
      ```
      *(The exact structure will depend on the `createInvoice` service and Prisma model)*
    - **Error (400 Bad Request):**
      ```json
      {
        "error": "Invalid input",
        "details": { /* Zod error formatting */ }
      }
      ```
    - **Error (429 Too Many Requests):** If rate limit is exceeded.
        ```json
        { "error": "Too many requests" }
        ```
    - **Error (500 Internal Server Error):**
      ```json
      { "error": "Internal Server Error" }
      ```
- **Notes:**
    - Requires authentication.
    - Subject to rate limiting.
    - `InvoiceStatus` is an enum defined in `prisma/schema.prisma`.
    - The `dueDate` is sent as a string in JSON but converted to a `Date` object on the server.

---

### Agent APIs

Base Path: `/api/agents`

These endpoints are used for managing and interacting with AI agents within the ΛΞVON OS.

#### 1. List Agents

- **Endpoint:** `GET /api/agents`
- **Description:** Retrieves a list of all available AI agents.
- **Request Parameters:**
    - None
- **Response:**
    - **Success (200 OK):**
      ```json
      [
        {
          "id": "clxko26no000008l3fczj5s0m",
          "name": "Sales Data Analyst Agent",
          "type": "DATA_ANALYSIS", // Example AgentType
          "description": "Analyzes sales data and generates reports.",
          "createdAt": "2023-01-15T10:00:00.000Z",
          "updatedAt": "2023-01-16T12:30:00.000Z"
        }
        // ... more agents
      ]
      ```
      *(The exact structure will depend on the `listAgents` service and Prisma model)*
    - **Error (500 Internal Server Error):**
      ```json
      {
        "error": "Internal Server Error"
      }
      ```
- **Notes:**
    - Requires authentication.

#### 2. Create Agent

- **Endpoint:** `POST /api/agents`
- **Description:** Creates a new AI agent.
- **Request Body:**
  ```json
  {
    "name": "New Marketing Agent",
    "type": "AUTOMATION", // Must be a valid AgentType enum value
    "description": "This agent automates marketing campaign workflows."
  }
  ```
- **Request Body Schema (Zod):**
  ```typescript
  z.object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    type: z.nativeEnum(AgentType), // AgentType from Prisma Client
    description: z.string().min(10, "Description is too short."),
  })
  ```
- **Response:**
    - **Success (201 Created):**
      ```json
      {
        "id": "clxko3abc000108l3gabcdef",
        "name": "New Marketing Agent",
        "type": "AUTOMATION",
        "description": "This agent automates marketing campaign workflows.",
        "createdAt": "2023-01-17T14:00:00.000Z",
        "updatedAt": "2023-01-17T14:00:00.000Z"
      }
      ```
    - **Error (400 Bad Request):**
      ```json
      {
        "error": "Invalid input",
        "details": { /* Zod error formatting */ }
      }
      ```
    - **Error (500 Internal Server Error):**
      ```json
      {
        "error": "Internal Server Error"
      }
      ```
- **Notes:**
    - Requires authentication.
    - `AgentType` is an enum defined in `prisma/schema.prisma`.

#### 3. Update Agent

- **Endpoint:** `PUT /api/agents?id=<agentId>`
- **Description:** Updates an existing agent's name or description.
- **Query Parameters:**
    - `id` (string, required): The ID of the agent to update.
- **Request Body:**
  ```json
  {
    "name": "Updated Agent Name", // Optional
    "description": "Updated description for the agent." // Optional
  }
  ```
- **Request Body Schema (Zod):**
  ```typescript
  z.object({
    name: z.string().min(3, "Name must be at least 3 characters long.").optional(),
    description: z.string().min(10, "Description is too short.").optional(),
  }).refine(data => data.name || data.description, {
    message: "At least one field (name or description) must be provided for an update."
  })
  ```
- **Response:**
    - **Success (200 OK):**
      ```json
      {
        "id": "clxko26no000008l3fczj5s0m",
        "name": "Updated Agent Name",
        "type": "DATA_ANALYSIS",
        "description": "Updated description for the agent.",
        "createdAt": "2023-01-15T10:00:00.000Z",
        "updatedAt": "2023-01-17T15:00:00.000Z"
      }
      ```
    - **Error (400 Bad Request):** If `agentId` is missing or input is invalid.
      ```json
      { "error": "Agent ID is required" }
      // or
      { "error": "Invalid input", "details": { /* Zod error formatting */ } }
      ```
    - **Error (403 Forbidden):** If attempting to modify the primary system agent (e.g., `id=system-beep`).
        ```json
        { "error": "The primary system agent cannot be modified." }
        ```
    - **Error (500 Internal Server Error):** If the update fails or the agent doesn't exist.
      ```json
      { "error": "Failed to update agent. It may not exist." }
      ```
- **Notes:**
    - Requires authentication.

#### 4. Delete Agent

- **Endpoint:** `DELETE /api/agents?id=<agentId>`
- **Description:** Deletes an AI agent.
- **Query Parameters:**
    - `id` (string, required): The ID of the agent to delete.
- **Response:**
    - **Success (204 No Content):** Empty response.
    - **Error (400 Bad Request):** If `agentId` is missing.
      ```json
      { "error": "Agent ID is required" }
      ```
    - **Error (403 Forbidden):** If attempting to delete the primary system agent (e.g., `id=system-beep`).
        ```json
        { "error": "The primary system agent cannot be deleted." }
        ```
    - **Error (500 Internal Server Error):**
      ```json
      { "error": "Internal Server Error" }
      ```
- **Notes:**
    - Requires authentication.

---

*(Further API sections for AI, Security, System, etc., will be added here, following the same structure. Each endpoint will be documented by inspecting its corresponding `route.ts` or `route.js` file.)*
