Smart Flashcards – AI-Powered Learning App

Smart Flashcards – Fullstack Roadmap (with Database Integration)

Goal: Build an app where users can create or generate flashcard sets, answer AI-generated multiple-choice questions, receive AI explanations, and track progress.

Tech Stack: Nuxt 3, TypeScript, TailwindCSS, Pinia, Node.js, PostgreSQL + Prisma, OpenAI API, Playwright/Vitest for testing

Estimated Total Hours: ~110–125 hours

⸻

Week 1: Project Setup, Pages, Layouts, Routing

√ Task 1 – Project Setup
• Description: Initialize Nuxt 4 project with TypeScript, TailwindCSS, ESLint, Prettier, Husky. Configure Vite, .env for API keys (AI, backend), VS Code recommended extensions.
• Estimation: 2–3 hours
• Concepts: Modern tooling, TypeScript setup, project scaffolding

√ Task 2 – Pages & Routing
• Description: Create pages: Dashboard (all sets), Login/Register, Flashcard Set Detail (/sets/[id]), Learning Mode, Stats. Use dynamic & nested routes, feature-based structure (features/sets, features/auth).
• Estimation: 4 hours
• Concepts: Nuxt routing, feature-based architecture, dynamic routes

Task 3 – Layouts & Slots
• Description: Dashboard layout: header, sidebar (sets list), main content. Login layout simpler. Use slots for modals, AI explanation panels, quiz UI.
• Estimation: 2 hours
• Concepts: Layouts, slots, reusable UI, responsive design

⸻

Week 2: Frontend Components, State, SSR

Task 4 – Reusable UI Components
• Description: Build components: Flashcard, Button, Modal, InputField, RadioGroup (multiple-choice), ProgressBar. TypeScript props and emits, scoped slots.
• Estimation: 4 hours
• Concepts: Component design, TypeScript props/emits, reusable UI

Task 5 – Smart Components
• Description: FlashcardSetDashboard, LearningMode, StatsPanel. Fetch data via composables and Pinia stores. Handle AI responses and post-submission explanations.
• Estimation: 5 hours
• Concepts: Composition API, smart/dumb components, reactive state, TypeScript

Task 6 – Composables
• Description: useAuth(), useSets(), useFlashcards(), useAI(), useProgress(). Handle async API calls, AI generation, filtering, sorting.
• Estimation: 5 hours
• Concepts: Composables, reusable logic, async handling, AI integration

Task 7 – Pinia Stores
• Description: Create stores for user, flashcard sets, flashcards, AI answers, and progress tracking. Include computed getters (learned/unlearned, progress percentage).
• Estimation: 4 hours
• Concepts: State management, computed properties, async actions, TypeScript

Task 8 – SSR & Data Fetching
• Description: Fetch flashcard sets, user data, progress stats. Implement loading states, error handling, caching.
• Estimation: 3–4 hours
• Concepts: SSR, async data fetching, reactive updates

⸻

Week 3: Backend, AI, Database Integration

Task 9 – Database Setup
• Description: Install PostgreSQL (or SQLite for dev), configure Prisma ORM. Define schema: Users, Flashcard Sets, Flashcards, User Progress, AI Cache. Generate Prisma client.
• Estimation: 2 hours
• Concepts: Database setup, schema design, type-safe ORM

Task 10 – User Authentication
• Description: Implement signup/login API endpoints. Hash passwords, generate JWTs. Connect frontend forms.
• Estimation: 3–4 hours
• Concepts: Authentication, secure storage, database CRUD, JWT

Task 11 – CRUD Flashcard Sets
• Description: API endpoints for creating, reading, updating, deleting sets. Connect frontend dashboard.
• Estimation: 3 hours
• Concepts: CRUD, relational modeling (user → sets), backend integration

Task 12 – CRUD Flashcards
• Description: API endpoints to manage flashcards within sets. Store AI answers & explanations. Connect frontend forms and composables.
• Estimation: 3 hours
• Concepts: CRUD, relational modeling (set → flashcards), backend + frontend integration

Task 13 – Track User Progress
• Description: API endpoints to update progress per flashcard (correct/incorrect). Aggregate stats per set. Connect to Pinia store for reactive frontend updates.
• Estimation: 2–3 hours
• Concepts: Async DB updates, relational joins, analytics, reactive UI

Task 14 – AI Integration
• Description: Generate multiple-choice answers per key-word (1 correct + distractors). After submission, provide AI-generated explanation. Cache responses in DB.
• Estimation: 6 hours
• Concepts: AI API integration, prompting, async handling, caching, reactive updates

Task 15 – Teleport & Suspense
• Description: Teleport for modals (AI explanations). Suspense for async AI content with fallback UI.
• Estimation: 2 hours
• Concepts: Teleport, Suspense, async UI handling

Task 16 – Performance Optimization
• Description: Lazy-load flashcards, memoize filtered/sorted sets, virtual scrolling for large sets. Optimize reactivity (shallowRef, markRaw).
• Estimation: 4 hours
• Concepts: Performance optimization, lazy-loading, reactivity caveats

Task 17 – CSS / Tailwind / Accessibility
• Description: Fully responsive UI, transitions, conditional classes. Keyboard navigation, semantic HTML, screen reader support.
• Estimation: 5 hours
• Concepts: Responsive design, accessibility, Tailwind, UX consistency

⸻

Week 4: Testing, CI/CD, Polish

Task 18 – Unit & Integration Testing
• Description: Test components (Flashcard, FlashcardSetDashboard, AI explanation modal). Test composables (useAI(), useFlashcards(), useProgress()).
• Estimation: 4 hours
• Concepts: Unit testing, integration testing, maintainable code

Task 19 – E2E Testing
• Description: Test learning flow: show card, select multiple-choice answer, AI explanation, track progress. Test CRUD flow for sets/flashcards.
• Estimation: 3 hours
• Concepts: E2E testing, async workflows, QA practices

Task 20 – Refactoring & Architecture Review
• Description: Refactor for modularity, clear separation between frontend/backend/AI, maintainable and scalable code.
• Estimation: 3–4 hours
• Concepts: Staff-level architecture, enterprise readiness, maintainability

Task 21 – CI/CD & Git Workflow
• Description: Feature branches, PRs, merge strategies. CI/CD pipeline: lint, test, build.
• Estimation: 3–4 hours
• Concepts: Git workflow, collaboration, automated delivery

Task 22 – Polish & Debugging
• Description: Fix remaining layout or UX issues, review TypeScript types, ensure accessibility, optimize performance.
• Estimation: 4 hours
• Concepts: Debugging, UX, performance, accessibility, architecture awareness

⸻

✅ Total Estimated Hours: ~110–125 hours

This roadmap now fully integrates database tasks, AI, backend, frontend architecture, state management, testing, performance, accessibility, and Staff/Principal-level thinking.
