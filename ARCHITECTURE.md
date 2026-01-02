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
- ✅ Define actions that modify state (mutations)
- ✅ Can be called from anywhere (stores, components, plugins, middleware)
- ✅ **DO NOT** use Nuxt-specific composables (`useState`, `useSupabaseClient`, etc.)
- ✅ **DO NOT** handle data fetching that requires SSR (move to composables)
- ✅ Mutations (add/update/delete) can use composables like `useLoader()` and `useToast()`
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
- ✅ Can use Nuxt composables (`useState`, `useRouter`, `useSupabaseClient`, etc.) ONLY when called from valid contexts
- ✅ Handle data fetching that requires Nuxt context (SSR support)
- ✅ Provide computed properties for reactive access
- ✅ Export types for components
- ✅ Keep thin - delegate to stores for state management

**Example - Simple Wrapper:**

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

**Example - Data Fetching Composable:**

```typescript
// composables/useSets.ts
export const useSets = () => {
	const setsStore = useSetsStore()
	const { startLoading, stopLoading } = useLoader()

	const fetchSets = async () => {
		if (setsStore.sets.length > 0) return

		if (import.meta.client) {
			startLoading('fetch')
		}

		try {
			// useSupabaseClient() works here (composable has Nuxt context)
			const supabase = useSupabaseClient()
			const { data } = await supabase.from('user_set').select('set_data')
			setsStore.sets = data?.map((set) => set.set_data) ?? []
		} finally {
			if (import.meta.client) {
				stopLoading()
			}
		}
	}

	return {
		sets: computed(() => setsStore.sets),
		fetchSets,
		addSet: setsStore.addSet, // Mutations can stay in store
	}
}
```

### 3. Store Actions (Business Logic)

**Location:** Inside Pinia store `actions`

**Rules:**

- ✅ Can call other stores
- ✅ Can call composables that wrap stores (like `useLoader()`)
- ✅ **DO NOT** call `useSupabaseClient()` directly in stores (use composables instead)
- ✅ Handle errors appropriately
- ✅ Use loading states via `useLoader()` composable
- ✅ Keep stores framework-agnostic - no Nuxt-specific composables

**Example:**

```typescript
// ❌ BAD - Don't call Supabase in stores
async fetchSets() {
  const supabase = useSupabaseClient() // Requires Nuxt context!
}

// ✅ GOOD - Data fetching in composables
// composables/useSets.ts
export const useSets = () => {
  const setsStore = useSetsStore()

  const fetchSets = async () => {
    const supabase = useSupabaseClient() // Works in composable context
    // ... fetch logic, update store
  }

  return { fetchSets, sets: computed(() => setsStore.sets) }
}
```

**For SSR Data Fetching:**

Data fetching that needs SSR support should be in composables, not stores:

```typescript
// composables/useSets.ts
export const useSets = () => {
	const setsStore = useSetsStore()

	const fetchSets = async () => {
		// useSupabaseClient() works here (composable has Nuxt context)
		const supabase = useSupabaseClient()
		const { data } = await supabase.from('user_set').select('set_data')
		setsStore.sets = data?.map((set) => set.set_data) ?? []
	}

	return { fetchSets, sets: computed(() => setsStore.sets) }
}

// pages/index.vue
const { sets, fetchSets } = useSets()
await useAsyncData('sets', async () => {
	await fetchSets() // Works on both server and client
})
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

❌ **Calling Nuxt composables in store actions**

```typescript
// ❌ BAD - Stores don't have Nuxt context
async fetchData() {
  const supabase = useSupabaseClient() // Fails on SSR!
}
```

✅ **Move data fetching to composables**

```typescript
// ✅ GOOD - Composables have Nuxt context
// composables/useData.ts
export const useData = () => {
	const dataStore = useDataStore()

	const fetchData = async () => {
		const supabase = useSupabaseClient() // Works in composable!
		const { data } = await supabase.from('table').select()
		dataStore.items = data
	}

	return { fetchData, items: computed(() => dataStore.items) }
}

// pages/index.vue
const { items, fetchData } = useData()
await useAsyncData('data', async () => {
	await fetchData() // Works on both server and client!
})
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
│   ├── loader.ts        # State only, no Nuxt composables
│   ├── toast.ts         # State only, no Nuxt composables
│   ├── modal.ts         # State only, no Nuxt composables
│   ├── sets.ts          # State + mutations (client-side only)
│   └── ...
├── composables/         # Vue/Nuxt wrappers
│   ├── useLoader.ts     # Wraps loader store
│   ├── useToast.ts      # Wraps toast store
│   ├── useModal.ts      # Wraps modal store
│   ├── useSets.ts       # Wraps sets store + handles SSR fetching
│   └── ...
└── components/          # Vue components
    └── ...
```

## SSR Data Fetching Pattern

**For data that needs SSR support:**

1. ✅ Keep state in Pinia store (framework-agnostic)
2. ✅ Move fetching logic to composable (has Nuxt context)
3. ✅ Use `useAsyncData` in pages to fetch during SSR
4. ✅ Composables can call `useSupabaseClient()` safely

**Example:**

```typescript
// stores/sets.ts - State only
export const useSetsStore = defineStore('sets', {
	state: () => ({ sets: [] }),
	actions: {
		addSet(set) {
			this.sets.push(set)
		}, // Mutations OK
	},
})

// composables/useSets.ts - Fetching logic
export const useSets = () => {
	const setsStore = useSetsStore()

	const fetchSets = async () => {
		const supabase = useSupabaseClient() // ✅ Works here
		const { data } = await supabase.from('user_set').select()
		setsStore.sets = data
	}

	return { sets: computed(() => setsStore.sets), fetchSets }
}

// pages/index.vue
const { sets, fetchSets } = useSets()
await useAsyncData('sets', async () => {
	await fetchSets() // ✅ Works on server and client
})
```

## Benefits

1. **Consistency:** All state follows the same pattern
2. **Reliability:** Stores work everywhere (no context issues)
3. **Testability:** Stores can be tested independently
4. **Type Safety:** Clear type boundaries
5. **Maintainability:** Clear separation of concerns
