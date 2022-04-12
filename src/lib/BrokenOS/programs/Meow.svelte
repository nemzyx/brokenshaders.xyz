<script>
	export let OS

	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Webding from '$lib/IconWebding.svelte'
	import webdingLUT from '$util/webdingLUT.js'

	import { onMount } from 'svelte'
	import delay from '$util/delay.js'
	onMount(async () => {
		OS.HALT = true
		await delay(500)
		OS.HALT = false
	})
</script>

<TerminalLine usr={false} indent
	>{`>`} Meow <Webding>{@html webdingLUT['heart']}</Webding></TerminalLine
>
