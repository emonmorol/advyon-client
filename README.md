# Advyon Client

## Project Overview
**Advyon Client** is a modern, production-ready frontend application built for the Advyon Legal Platform. It is designed as a **Single Page Application (SPA)** using a **Component-Based Architecture** with a **Feature-Driven Modular Structure**.

This architecture ensures scalability, maintainability, and a clear separation of concerns, making it easy to manage complex business logic (like Case Management or Authentication) alongside UI components.

---

## Architecture

### 1. Component-Based SPA
The application is built using **React**, where the UI is decomposed into independent, reusable pieces called "components".
- **Client-Side Rendering (CSR):** The browser handles routing and UI logic, providing a seamless, app-like experience without page reloads.
- **Routing:** Managed by `react-router-dom`, allowing for dynamic navigation and nested layouts.

### 2. Feature-Driven Modular Architecture
Instead of grouping files by type (e.g., all controllers together), code is organized by **Business Domain** (Feature).
- **`src/features/`**: Contains self-contained modules (e.g., `auth`, `cases`). Each feature folder holds its own components, API hooks, and state, keeping high cohesion and low coupling.
- **`src/components/`**: Reserved for shared, atomic UI components (buttons, inputs, cards) that are used across multiple features.

---

## Technology Stack

### Core
- **[Vite](https://vitejs.dev/):** Next-generation frontend tooling for instant server start and lightning-fast HMR (Hot Module Replacement).
- **[React 19](https://react.dev/):** The library for web and native user interfaces.
- **[JavaScript (ES Modules)]:** Modern JavaScript standards.

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
- **[Radix UI](https://www.radix-ui.com/):** Unstyled, accessible components for building high-quality design systems.
- **[Lucide React](https://lucide.dev/):** Beautiful & consistent icons.
- **`clsx` & `tailwind-merge`:** Utilities for constructing dynamic class strings conditionally.

### State Management & Data Fetching
- **[Zustand](https://github.com/pmndrs/zustand):** A small, fast, and scalable bearbones state-management solution for global client state.
- **[TanStack Query (React Query)](https://tanstack.com/query/latest):** Powerful asynchronous state management for server-state (fetching, caching, synchronizing and updating server state).

### Routing & Forms
- **[React Router DOM v7](https://reactrouter.com/):** Declarative routing for React web applications.
- **[React Hook Form](https://react-hook-form.com/):** Performant, flexible and extensible forms with easy-to-use validation.
- **[Zod](https://zod.dev/):** TypeScript-first schema declaration and validation library.

---

## Project Structure

```bash
src/
├── assets/        # Static assets (images, fonts, global icons)
├── components/    # Shared atomic UI components (Buttons, Inputs, Modals)
├── features/      # Feature-based modules (Auth, Cases, Dashboard)
│   └── [feature]/ # e.g., auth/
│       ├── components/ # Components specific to this feature
│       ├── api/        # API hooks and services for this feature
│       └── types/      # TypeScript types for this feature (if applicable)
├── layouts/       # Page wrappers (AppLayout, AuthLayout)
├── lib/           # Global utilities and configurations (axios, utils)
├── pages/         # Route views that assemble feature components
├── routes/        # Centralized router configuration
├── store/         # Global Zustand stores
└── main.jsx       # Application entry point
```

---

## Getting Started

### Prerequisites
Ensure you have **Node.js** installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Development

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for Production

Build the application for deployment:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## Code Quality
- **ESLint:** For identifying and reporting on patterns found in ECMAScript/JavaScript code.
- **Prettier:** An opinionated code formatter to ensure consistent style.
