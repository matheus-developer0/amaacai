# AI Rules for Açaíria Project

This document outlines the core technologies used in this project and provides guidelines for their appropriate usage.

## Tech Stack Overview

*   **Vite**: A fast build tool that provides an instant development server and optimized builds.
*   **TypeScript**: A superset of JavaScript that adds static type definitions, improving code quality and maintainability.
*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS, providing a consistent and accessible UI.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **React Router DOM**: The standard library for routing in React applications, enabling navigation between different views.
*   **Supabase**: An open-source Firebase alternative providing a PostgreSQL database, authentication, instant APIs, and more.
*   **TanStack Query (React Query)**: A powerful library for managing, caching, and synchronizing server state in React applications.
*   **Sonner**: A modern, accessible, and customizable toast notification library.
*   **Lucide React**: A collection of beautiful and consistent open-source icons.
*   **React Hook Form & Zod**: Libraries for efficient form management and schema-based validation.

## Library Usage Guidelines

To maintain consistency and leverage the strengths of each library, please adhere to the following rules:

*   **UI Components**: Always prioritize `shadcn/ui` components for building the user interface. If a specific component is not available in `shadcn/ui` or requires significant custom logic, create a new component in `src/components/` and style it using Tailwind CSS. **Do NOT modify files within `src/components/ui/`**.
*   **Styling**: Use **Tailwind CSS exclusively** for all styling. Custom CSS should be minimal and reserved only for global styles or keyframes defined in `src/index.css`.
*   **Routing**: All client-side routing must be handled using `react-router-dom`. Define routes within `src/App.tsx`.
*   **State Management & Data Fetching**:
    *   For server state (data fetched from an API), use `TanStack Query` for fetching, caching, and synchronization.
    *   For local component state, use React's built-in `useState` and `useReducer` hooks.
*   **Authentication & Backend**: All backend interactions, including user authentication, database operations, and file storage, should be performed using `Supabase`.
*   **Form Handling**: Use `react-hook-form` for managing form state, validation, and submission. Pair it with `zod` for defining robust validation schemas.
*   **Notifications**: Implement all toast notifications using the `sonner` library.
*   **Icons**: Use icons from the `lucide-react` library.
*   **Utility Functions**: General utility functions (e.g., for combining Tailwind classes like `cn`) should be placed in `src/lib/utils.ts`.
*   **Date Manipulation**: For any operations involving dates (formatting, parsing, calculations), use `date-fns`.