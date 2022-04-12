<script>
	import BootArt from '$lib/BrokenOS/boot/index.svelte'
	import delay from '$util/delay.js'

	import Terminal from '$lib/Terminal/index.svelte'
	import SystemNav from '$lib/BrokenOS/Nav.svelte'
	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Interactive from '$lib/Terminal/Interactive.svelte'
	import CLI, { newField, setClass, notFound } from '$lib/BrokenOS/CLI.js'

	let OS = { FIELDS: [newField()] }

	const handlePrompt = async (e) => {
		const { HTML, value } = e.detail
		const response = CLI[value]
		if (response) {
			OS.FIELDS[OS.FIELDS.length - 1].LINES.push({ data: setClass('col', HTML) })
			OS = OS
			const PROG = (await import(`./programs/${response}.svelte`)).default
			OS.FIELDS[OS.FIELDS.length - 1].PROGRAM = PROG
			OS.FIELDS.push(newField())
		} else {
			OS.FIELDS[OS.FIELDS.length - 1].LINES.push({ data: HTML })
			if (value !== '') {
				OS.FIELDS[OS.FIELDS.length - 1].LINES.push({
					data: notFound(HTML),
					props: { usr: false, indent: false }
				})
			}
		}
		// UPDATE OBJECT
		OS = OS
	}

	// $: console.log(OS)
</script>

<Terminal>
	<!-- {#await delay(4000) then}
		<SystemNav />
	{/await} -->
	<SystemNav />
	<!-- <div style="position: absolute;width:100%">
		<BootArt />
	</div> -->
	{#each OS.FIELDS as { LINES, PROGRAM }}
		{#each LINES as { props, data: markup }}
			<TerminalLine {...props}>{@html markup}</TerminalLine>
		{/each}
		{#if PROGRAM}
			<svelte:component this={PROGRAM} bind:OS />
		{/if}
	{/each}
	<!-- {#await delay(3000) then}
		<Interactive {CLI} on:prompt={handlePrompt} active forcedFocus />
	{/await} -->
	<Interactive {CLI} on:prompt={handlePrompt} active forcedFocus />
	<div class="autoscroll-spacer" />
</Terminal>

<style global>
	.col {
		color: var(--accent-color);
	}

	.col-alt {
		color: var(--accent-color-alt);
	}

	.autoscroll-spacer {
		padding-top: 200px;
	}
</style>
