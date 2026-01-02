# Architecture: Stores and Composables Pattern

## Core Principle

**Pinia stores manage state (framework-agnostic), composables provide Vue/Nuxt integration (context-aware).**

## Pattern Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURAL LAYERS                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  Components  │────────▶│  Composables │                  │
│  │  (Vue/Nuxt)  │         │  (Vue/Nuxt)  │                  │
│  └──────────────┘         └──────┬───────┘                  │
│                                    │                          │
│                                    │ wraps                    │
│                                    ▼                          │
│                           ┌──────────────┐                   │
│                           │ Pinia Stores │                   │
│                           │ (Framework   │                   │
│                           │  Agnostic)   │                   │
│                           └──────────────┘                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Rules

### 1. Pinia Stores (State Management)

**Location:** `app/stores/*.ts`

**Purpose:** Framework-agnostic state management that works everywhere.

**Rules:**

- ✅ Store all application state
- ✅ Define actions that modify state
- ✅ Can be called from anywhere (stores, components, plugins, middleware)
- ✅ No Nuxt-specific composables (`useState`, `useSupabaseClient`, etc.)
- ✅ Use `useSupabaseClient()` only when wrapped in client-side checks
- ✅ Export types and interfaces

**Example:**

```typescript
// stores/toast.ts
export const useToastStore = defineStore('toast', {
	state: () => ({
		toasts: [] as Toast[],
	}),
	actions: {
		showToast(message: string, type: ToastType) {
			this.toasts.push({ id: crypto.randomUUID(), message, type })
		},
	},
})
```

### 2. Composables (Vue/Nuxt Integration)

**Location:** `app/composables/*.ts`

**Purpose:** Thin wrappers around stores that provide Vue reactivity and Nuxt features.

**Rules:**

- ✅ Wrap Pinia stores for Vue reactivity
- ✅ Can use Nuxt composables (`useState`, `useRouter`, etc.) ONLY when called from valid contexts
- ✅ Provide computed properties for reactive access
- ✅ Export types for components
- ✅ Keep thin - delegate to stores

**Example:**

```typescript
// composables/useToast.ts
export const useToast = () => {
	const toastStore = useToastStore()

	return {
		toasts: computed(() => toastStore.toasts),
		showToast: toastStore.showToast,
		success: (msg: string) => toastStore.showToast(msg, 'success'),
	}
}
```

### 3. Store Actions (Business Logic)

**Location:** Inside Pinia store `actions`

**Rules:**

- ✅ Can call other stores
- ✅ Can call composables that wrap stores (like `useLoader()`)
- ✅ Use `useSupabaseClient()` only with client-side checks
- ✅ Handle errors appropriately
- ✅ Use loading states via `useLoader()` composable

**Example:**

```typescript
async fetchSets() {
  const { startLoading, stopLoading } = useLoader()

  startLoading('fetch')
  try {
    if (import.meta.server) return

    const supabase = useSupabaseClient()
    // ... fetch logic
  } finally {
    stopLoading()
  }
}
```

### 4. Components (UI Layer)

**Location:** `app/components/*.vue`, `app/pages/*.vue`

**Rules:**

- ✅ Use composables, not stores directly
- ✅ Composables provide reactive access to store state
- ✅ Can use Nuxt composables freely (always in valid context)

**Example:**

```typescript
const { toasts, success } = useToast()
const { isLoading } = useLoader()
```

## Migration Checklist

When creating new state management:

1. ✅ Create Pinia store first
2. ✅ Define state and actions in store
3. ✅ Create composable wrapper
4. ✅ Use composable in components
5. ✅ Never use `useState` for application state (only for SSR-specific needs)

## Anti-Patterns (Don't Do This)

❌ **Using `useState` in composables for application state**

```typescript
// ❌ BAD - useState requires Nuxt context
export const useToast = () => {
	const toasts = useState('toasts', () => [])
}
```

✅ **Using Pinia store instead**

```typescript
// ✅ GOOD - Pinia works everywhere
export const useToastStore = defineStore('toast', {
	state: () => ({ toasts: [] }),
})
```

❌ **Calling Nuxt composables in store actions without checks**

```typescript
// ❌ BAD - May fail without context
async fetchData() {
  const supabase = useSupabaseClient() // May fail!
}
```

✅ **Adding client-side checks**

```typescript
// ✅ GOOD - Safe context check
async fetchData() {
  if (import.meta.server) return
  const supabase = useSupabaseClient()
}
```

## When to Use `useState`

Only use `useState` for:

- SSR-specific state that needs hydration
- Request-scoped state
- Nuxt framework internals

**Never use `useState` for:**

- Application state (use Pinia)
- UI state (use Pinia)
- User data (use Pinia)

## File Structure

```
app/
├── stores/              # Pinia stores (framework-agnostic)
│   ├── loader.ts
│   ├── toast.ts
│   ├── modal.ts
│   └── ...
├── composables/         # Vue/Nuxt wrappers
│   ├── useLoader.ts     # Wraps loader store
│   ├── useToast.ts      # Wraps toast store
│   ├── useModal.ts      # Wraps modal store
│   └── ...
└── components/          # Vue components
    └── ...
```

## Benefits

1. **Consistency:** All state follows the same pattern
2. **Reliability:** Stores work everywhere (no context issues)
3. **Testability:** Stores can be tested independently
4. **Type Safety:** Clear type boundaries
5. **Maintainability:** Clear separation of concerns
