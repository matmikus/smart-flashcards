import type { User as SupabaseJsUser } from '@supabase/supabase-js'

// Type that accepts both User object and JWT payload
// Uses union type to avoid index signature conflicts
export type SupabaseUser =
	| SupabaseJsUser // Full User object from session.user
	| {
			sub: string // JWT payload from useSupabaseUser()
			email?: string | null
			id?: string
			user_metadata?: Record<string, unknown>
			app_metadata?: Record<string, unknown>
			[key: string]: unknown
	  }

export interface UserKey {
	id?: string
	user_id: string
	api_key: string | null
	created_at?: string | null
	updated_at?: string | null
}

export interface Set {
	id: string
	name: string
	topics: string[]
	color: number
}

export interface User {
	id: string | null
	name: string | null
	key: string | null
}

export interface Answer {
	id: string
	text: string
	isCorrect: boolean
}

export interface Flashcard {
	id: string
	topic: string
	question?: string
	answers?: Answer[]
	status: 'success' | 'failure' | 'waiting'
}

export interface SetData extends Set {
	flashcards: Flashcard[]
}
