# Aegis Nexus

Aegis Nexus is a sophisticated, minimalist General Insurance Administration platform designed for operational excellence and a superior user experience. Built on a serverless Cloudflare architecture, it provides a lightning-fast, secure, and scalable solution for managing the entire insurance lifecycle. The application is structured around a central dashboard providing key insights, and dedicated modules for comprehensive Policy Management, streamlined Claims Processing, in-depth Customer Relationship Management (CRM), and powerful Reporting. The design philosophy emphasizes clarity, simplicity, and efficiency, using generous white space, a refined color palette, and intuitive workflows to reduce cognitive load and empower administrators.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/AegisNexus-20251005-031959)

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## Key Features

-   **Policy Management**: Automated issuance, updates, cancellations, and renewals.
-   **Claims Processing**: User-friendly submission, automated verification, and workflow-driven adjudication.
-   **Underwriting Support**: AI-powered risk assessment tools and automated quoting.
-   **Customer Relationship Management (CRM)**: Centralized customer profiles, policy history, and a self-service portal.
-   **Data Analytics & Reporting**: Real-time dashboards and custom report generation.
-   **Compliance Management**: Automated checks and secure document management.
-   **Mobile-First Design**: A fully responsive interface for seamless access on any device.
-   **Robust Security**: End-to-end data encryption and multi-factor authentication.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui, Radix UI
-   **Backend**: Hono on Cloudflare Workers
-   **State Management**: Zustand
-   **Data Persistence**: Cloudflare Durable Objects
-   **Styling & Animation**: Framer Motion, Lucide Icons
-   **Forms**: React Hook Form with Zod for validation
-   **Data Visualization**: Recharts

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

```bash
bun install -g wrangler
wrangler login
```

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/your-username/aegis_nexus.git
    cd aegis_nexus
    ```
2.  Install the project dependencies using Bun:
    ```bash
    bun install
    ```

## Development

To start the local development server, which includes both the Vite frontend and the Hono backend on the Cloudflare Worker, run the following command:

```bash
bun dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will automatically reload on changes, and the worker will be updated as you modify the backend code.

## Deployment

Deploying the application to Cloudflare is a straightforward process.

1.  Build the application for production:
    ```bash
    bun run build
    ```
2.  Deploy the application using Wrangler:
    ```bash
    bun run deploy
    ```

This command will build the frontend, bundle the worker, and deploy both to your Cloudflare account.

Alternatively, you can deploy directly from your GitHub repository using the button below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/AegisNexus-20251005-031959)

## Project Structure

The project is organized into three main directories:

-   `src/`: Contains the frontend React application, including pages, components, hooks, and utility functions.
-   `worker/`: Contains the backend Hono application that runs on Cloudflare Workers, including API routes and entity definitions for the Durable Object.
-   `shared/`: Contains TypeScript types and mock data that are shared between the frontend and the backend to ensure type safety and consistency.