<script>
	import Terminal from '$lib/Terminal/index.svelte'
	import SystemNav from '$lib/BrokenOS/Nav.svelte'
	import Interactive from '$lib/Terminal/Interactive.svelte'
	import Whoami from '$lib/BrokenOS/programs/Whoami.svelte'
</script>

<Terminal>
	<SystemNav />
	<Interactive />
	<br />
	<br />
	<br />
	<Whoami />
</Terminal>

<style global>
	.col {
		color: var(--accent-color);
	}
</style>
