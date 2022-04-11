<script>
	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Caret from '$lib/Terminal/Caret.svelte'

	import { getCursorPos } from '$util/textarea.js'
	import { onMount } from 'svelte'

	let _input
	let cursor_pos
	let cursor_max
	let cursor_padding = ''
	let cursor_char = '█'
	let content = ''
	const update = (e) => {
		let t = 0
		if (e.type === 'keydown') {
			if (e.metaKey || e.ctrlKey) {
				t = 10
			}
		}
		setTimeout(() => {
			cursor_pos = getCursorPos(_input)
			cursor_max = _input.value.length
			cursor_padding = ''
			for (let i = 0; i < cursor_pos.start; i++) {
				cursor_padding += '&nbsp;'
			}
			cursor_char = '█'
			for (let i = 0; i < cursor_pos.end - cursor_pos.start; i++) {
				cursor_char += '█'
			}
			content = _input.value.replaceAll(' ', '&nbsp;')
		}, t)
	}

	const focus = () => {
		_input.focus()
	}

	onMount(focus)
</script>

<!-- <input bind:this={inp} on:input={setPos} /> -->
<div class="hide">
	<input bind:this={_input} on:keydown={update} />
	<TerminalLine>
		{cursor_pos?.start}
		{cursor_pos?.end}
	</TerminalLine>
</div>
<div class="interactive" on:click={focus}>
	<!-- <TerminalLine>
		{@html content}<span
			style={`left:${-(cursor_max - cursor_pos?.end) * 9.38}px;position:relative`}><Caret /></span
		>
	</TerminalLine> -->
	<TerminalLine>
		{@html content}<span class="caret-overlay"
			>&nbsp;&nbsp;&nbsp;&nbsp;{@html cursor_padding}<Caret
				blink={false}
				char={cursor_char}
			/></span
		>
	</TerminalLine>
</div>
<TerminalLine>Hello there!</TerminalLine>

<style>
	.caret-overlay {
		position: absolute;
		left: 0;
	}

	.hide {
		/* width: 0;
		height: 0;
		opacity: 0;
		user-select: none; */
	}

	.interactive {
		/* background: red; */
		display: inherit;
		cursor: text;
	}
</style>
