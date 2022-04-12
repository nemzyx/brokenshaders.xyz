<script>
	import BootArt from '$lib/BrokenOS/boot/index.svelte'
	import delay from '$util/delay.js'

	import Terminal from '$lib/Terminal/index.svelte'
	import SystemNav from '$lib/BrokenOS/Nav.svelte'
	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Interactive from '$lib/Terminal/Interactive.svelte'
	import CLI, { newField } from '$lib/BrokenOS/CLI.js'

	let OS = { FIELDS: [newField()] }

	const handlePrompt = async (e) => {
		const { HTML, value } = e.detail
		const response = CLI[value]
		if (response) {
			const PROG = (await import(response)).default
			OS.FIELDS[OS.FIELDS.length - 1].PROGRAM = PROG
			OS.FIELDS[OS.FIELDS.length - 1].LINES.push(HTML)
			OS.FIELDS.push(newField())
		} else {
			OS.FIELDS[OS.FIELDS.length - 1].LINES.push(HTML)
		}
		// UPDATE OBJECT
		OS = OS
	}

	$: console.log(OS)
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
	{#each OS.FIELDS as { LINES, PROGRAM }}
		{#each LINES as markup}
			<TerminalLine>{@html markup}</TerminalLine>
		{/each}
		{#if PROGRAM}
			<svelte:component this={PROGRAM} bind:OS />
		{/if}
	{/each}
	<Interactive {CLI} on:prompt={handlePrompt} active forcedFocus />
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
