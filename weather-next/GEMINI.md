
# GEMINI.md

## Project Overview

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The project is a web application that uses React and TypeScript. The UI is built with Tailwind CSS and a set of UI components from `src/components/ui`.

The project is configured with ESLint for linting and Prettier for code formatting.

## Building and Running

To get started with the project, run the following commands:

```bash
npm install
npm run dev
```

This will start the development server at `http://localhost:3000`.

Other available scripts:

*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts a production server.
*   `npm run lint`: Lints the codebase using ESLint.

## Development Conventions

*   **UI Components**: The project uses a set of UI components located in `src/components/ui`. These components are built using Radix UI and styled with Tailwind CSS.
*   **Styling**: The project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js` and the global styles are in `src/app/globals.css`.
*   **Linting and Formatting**: The project uses ESLint and Prettier for code quality. The configuration files are `eslint.config.mjs` and `.prettierrc`.
*   **Typescript**: The project is written in TypeScript. The configuration is in `tsconfig.json`.
