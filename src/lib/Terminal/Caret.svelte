<script>
	export let blink = true
	export let char = '█'
</script>

<span class:blink>{char}</span>

<style>
	@keyframes blink {
		0% {
			opacity: 0%;
		}
		30% {
			opacity: 75%;
		}
		100% {
			opacity: 75%;
		}
	}

	.blink {
		animation: 800ms blink steps(1) infinite;
	}

	span {
		user-select: none;
		opacity: 75%;
		letter-spacing: -2px;
	}
</style>
