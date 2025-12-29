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
