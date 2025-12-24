const clickOutsideHandlers = new WeakMap<
	HTMLElement,
	(event: MouseEvent) => void
>()

export default defineNuxtPlugin((nuxtApp) => {
	// Override the SSR stub with the full client-side implementation
	nuxtApp.vueApp.directive('click-outside', {
		mounted(el: HTMLElement, binding) {
			const handler = (event: MouseEvent) => {
				if (
					!(el === event.target || el.contains(event.target as Node))
				) {
					binding.value(event)
				}
			}
			clickOutsideHandlers.set(el, handler)
			document.addEventListener('click', handler)
		},
		unmounted(el: HTMLElement) {
			const handler = clickOutsideHandlers.get(el)
			if (handler) {
				document.removeEventListener('click', handler)
				clickOutsideHandlers.delete(el)
			}
		},
		getSSRProps() {
			// Return empty props for SSR since this directive is client-only
			return {}
		},
	})
})
