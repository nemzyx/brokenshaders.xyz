<script>
	import Terminal from '$lib/Terminal/index.svelte'
	import SystemNav from '$lib/BrokenOS/Nav.svelte'
	import Interactive from '$lib/Terminal/Interactive.svelte'
	import Whoami from '$lib/BrokenOS/programs/Whoami.svelte'
	import CLI from '$lib/BrokenOS/CLI.js'
</script>

<Terminal>
	<SystemNav />
	<Interactive {CLI} />
	<!-- <br />
	<br />
	<br /> -->
	<Whoami />
</Terminal>

<style global>
	.col {
		color: var(--accent-color);
	}
</style>
