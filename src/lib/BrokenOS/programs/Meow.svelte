<script>
	export let OS

	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Webding from '$lib/IconWebding.svelte'
	import webdingLUT from '$util/webdingLUT.js'
</script>

<TerminalLine usr={false} indent
	>{`>`} Meow <Webding>{@html webdingLUT['heart']}</Webding></TerminalLine
>
