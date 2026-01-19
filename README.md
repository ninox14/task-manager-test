# TOdo

Task manager test application

## Technology Stack

- **Vite** - Next-generation frontend build tool for fast development
- **React + TypeScript** - Component-based UI library with type safety
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - Re-usable component library built on Radix UI primitives
- **Redux Toolkit (RTK) + RTK Query** - State management and data fetching
- **React Hook Form + Yup** - Form handling with validation schemas
- **date-fns** - Modern date utility library
- **React Day Picker** - Accessible date picker component
- **Lucide React** - Beautiful & consistent icon library

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd task-manager-test
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables (if needed):
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

## How to Run the Project

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

### Lint Code

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Project Structure

```
📁 Source Files (33):
├── src/
│   ├── main.tsx
│   ├── App.tsx             # Root application component
│   ├── index.css           # Global CSS styles
│   ├── store.ts            # Main Redux store configuration
│   ├── lib/
│   │   └── utils.ts        # Global utility functions
│   ├── hooks/
│   │   └── useDebounce.ts  # Custom hook for debouncing
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── button.tsx
│   │   |   ├── ...
│   │   └── Pagination/     # Reusable omponents which contain business logic
│   │       ├── index.tsx
│   │       └── usePagination.tsx
│   ├── features/
│   │   └── tasks/          # Task management feature
│   │       ├── Task.tsx           # Task list item component
│   │       ├── TaskFilters.tsx    # Task filtering component
│   │       ├── TaskModal.tsx      # Create/Edit task modal
│   │       ├── taskService.ts     # API service layer
│   │       ├── TaskSkeleton.tsx   # Loading skeleton
│   │       └── types.ts           # TypeScript types
│   └── mock/               # Mock data and API
│       ├── api.ts
│       ├── config.ts
│       └── utils.ts
```

### Structure Decisions

- **Feature-based Organization**: The `features/*` directory contains components with logic separated by features that could be nested to achieve more separation/decomposition, promoting modularity and separation of concerns
- **Component Library**: Reusable UI components are in `components/ui/` following shadcn/ui conventions. `components/*` directory contains global reusable components which contain some logic and built using components from `components/ui/`
- **Custom Hooks**: Shared logic extracted into reusable hooks in `hooks/`
- **Mocks**: `mock/`Contains mocked backend

## Development Decisions

- **Code style and separation**: Some parts of the code could be further decomposed / abstracted, but they are not, due to the small scale of the project. The `components/Pagination` component is an example of how it could look.

## Other

You can use this [Paste.sh](https://paste.sh/Z6jtKH53#gMcZDfZuYQX-cD8a9GaNCsJx) with generated tasks to test pagination. Put it as value into only key in local storage `tasks`.
