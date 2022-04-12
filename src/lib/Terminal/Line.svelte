<script>
	export let usr = true
	export let indent = false
</script>

<div>
	{#if usr}
		<span>~ %</span>
	{/if}
	{#if indent}
		&nbsp;&nbsp;&nbsp;
	{/if}
	<slot />
</div>

<style>
	div {
		color: var(--secondary-color);
		position: relative;
	}

	span {
		color: var(--tertiary-color);
		opacity: 0.75;
		user-select: none;
	}
</style>
