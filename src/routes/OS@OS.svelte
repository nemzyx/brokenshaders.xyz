<script>
	import BootArt from '$lib/BrokenOS/boot/index.svelte'
	import delay from '$util/delay.js'

	import Terminal from '$lib/Terminal/index.svelte'
	import SystemNav from '$lib/BrokenOS/Nav.svelte'
	import Interactive from '$lib/Terminal/Interactive.svelte'
	import CLI from '$lib/BrokenOS/CLI.js'

	let OS = { LINES: [true], PROGRAM: null, PROPS: {} }

	const handlePrompt = async (e) => {
		const { value } = e.detail
		const response = CLI[value]
		if (response) {
			OS.PROGRAM = (await import(response)).default
			return
		} else {
			OS.PROGRAM = null
		}
		OS.LINES[OS.LINES.length - 1] = false
		OS.LINES.push(true)
	}

	$: console.log(OS.LINES)
</script>

<Terminal>
	<!-- {#await delay(4000) then}
		<SystemNav />
	{/await}
	<div style="position: absolute;width:100%">
		<BootArt />
	</div>
	{#await delay(3000) then}
		{#if OS.PROGRAM}
			<svelte:component this={OS.PROGRAM} {...OS.PROPS} bind:OS />
		{/if}
		{#each OS.LINES as line}
			<Interactive {CLI} on:prompt={handlePrompt} active={line} forcedFocus />
		{/each}
		<div class="autoscroll-spacer" />
	{/await} -->

	<SystemNav />
	{#if OS.PROGRAM}
		<svelte:component this={OS.PROGRAM} {...OS.PROPS} bind:OS />
	{/if}
	{#each OS.LINES as line}
		<Interactive {CLI} on:prompt={handlePrompt} active={line} forcedFocus />
	{/each}
	<div class="autoscroll-spacer" />
</Terminal>

<style global>
	.col {
		color: var(--accent-color);
	}

	.autoscroll-spacer {
		height: 200px;
		height: 20vh;
	}
</style>
