export interface Set {
	id: string
	name: string
	flashcards: string[]
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
	question: string
	answers: Answer[]
	status: string
}
