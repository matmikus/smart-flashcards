<template>
	<div class="min-h-screen flex flex-col">
		<header class="bg-indigo-600 text-white p-4 z-20 flex items-center">
			<h1 class="font-bbh-bartle text-2xl mr-8">
				SMART&nbsp;&nbsp;FLASHCARDS
			</h1>
			<p>Your AI-powered flashcard learning companion</p>
			<div
				class="flex-1 flex justify-end text-4xl m-[-8px] px-2 cursor-pointer"
			>
				👨🏻‍💼
			</div>
		</header>
		<main
			class="text-indigo-200 p-4 flex justify-center items-center flex-1"
		>
			<div>
				<slot />
			</div>
		</main>
		<AppModalContainer />
	</div>
</template>
