<script>
	export let blink = true
	export let char = '█'
	export let active = true
</script>

{#if active}
	<span class:blink>{char}</span>
{/if}

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
