<script>
	export let OS

	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Caret from '$lib/Terminal/Caret.svelte'
	import typewriter from '$transitions/typewriter.js'

	import delay from '$util/delay.js'
	import { onMount } from 'svelte'

	const s = 3

	let LINE = 0
	let blnk = false

	let changeOnMount = {}
	onMount(async () => {
		OS.HALT = true

		changeOnMount = {}
		await delay(600)
		blnk = true
		await delay(100)
		blnk = false
		await delay(1200)
		blnk = true
		await delay(200)
		LINE = 1
		await delay(1200)
		blnk = false
		await delay(1000)
		blnk = true
		await delay(2200)
		blnk = false
		await delay(800)
		blnk = true
		await delay(700)
		LINE = 2
		await delay(2200)
		LINE = 3
		await delay(400)
		blnk = false
		await delay(1100)
		blnk = true
		await delay(200)
		blnk = false
		await delay(1500)
		blnk = true
		await delay(3000)
		LINE = 4
		await delay(200)
		LINE = 5
		await delay(1000)
		blnk = false
		await delay(1000)
		blnk = true
		await delay(400)
		LINE = 6
		await delay(500)
		blnk = false
		await delay(900)
		blnk = true

		OS.HALT = false
	})
</script>

{#key changeOnMount}
	{#if LINE >= 0}
		<TerminalLine>
			<span in:typewriter={{ speed: s, delay: 200 }}>Hello world.</span>
			<span in:typewriter={{ speed: s / 1.5, delay: 900 }}>My name is</span>
			<span in:typewriter={{ speed: s / 1.2, delay: 1400 }}>Jonathan.</span>{#if LINE == 0}<Caret
					blink={blnk}
					active={OS.HALT}
				/>{/if}
		</TerminalLine>
	{/if}
	{#if LINE >= 1}
		<TerminalLine>
			<span in:typewriter={{ speed: s, delay: 1200 }}>I'm a computer PROGRAMMER</span>
			<span in:typewriter={{ speed: s / 3, delay: 4200 }}>/ [nerd]</span>{#if LINE == 1}<Caret
					blink={blnk}
					active={OS.HALT}
				/>{/if}
		</TerminalLine>
	{/if}
	{#if LINE >= 2}
		<TerminalLine>
			{#if LINE == 2} <Caret blink={blnk} active={OS.HALT} /> {/if}
		</TerminalLine>
	{/if}
	{#if LINE >= 3}
		<TerminalLine>
			<span in:typewriter={{ speed: s / 2, delay: 400 }}>This is </span><span
				class="col"
				in:typewriter={{ speed: s / 2, delay: 1000 }}>broken</span
			>{#await delay(2400)}<span in:typewriter={{ speed: s / 1.6, delay: 1750 }}>:xtal:</span
				>{/await}<span />{#await delay(2400) then}<span class="webding">{` `}&#xe921;</span
				>{/await}<span class="col" in:typewriter={{ speed: s / 1, delay: 2600 }}
				>shaders
			</span>{#if LINE == 3}<Caret blink={blnk} active={OS.HALT} />{/if}
		</TerminalLine>
	{/if}
	{#if LINE >= 4}
		<TerminalLine>
			{#if LINE == 4} <Caret blink={blnk} active={OS.HALT} /> {/if}
		</TerminalLine>
	{/if}
	{#if LINE >= 5}
		<TerminalLine>
			<span in:typewriter={{ speed: s / 10, delay: 700 }}>BIO</span>{#if LINE == 5}
				<Caret blink={blnk} active={OS.HALT} />
			{/if}
		</TerminalLine>
	{/if}
	{#if LINE >= 6}
		<TerminalLine>
			<span in:typewriter={{ speed: s / 1.3, delay: 500 }}>I was born in 1999.</span>{#if LINE == 6}
				<Caret blink={blnk} active={OS.HALT} />
			{/if}
		</TerminalLine>
	{/if}
	{#if LINE >= 7}
		<TerminalLine>
			{#if LINE == 7} <Caret blink={blnk} active={OS.HALT} /> {/if}
		</TerminalLine>
	{/if}
{/key}
