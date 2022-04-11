<script>
	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Caret from '$lib/Terminal/Caret.svelte'

	import webdingLUT from '$util/webdingLUT.js'
	const webdings = Object.keys(webdingLUT)

	import { getCursorPos, setCursorPos } from '$util/textarea.js'
	import { onMount } from 'svelte'

	// &#xe921;
	const renderWebding = (char) => `<span class="webding">&nbsp;${char}</span>`

	const PATTERN = /(?<=:)([A-z]{1,25})(?=:)/g

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
			// SEARCH LOCATIONS OF WEBDINGS
			const search = []
			let match = null
			while ((match = PATTERN.exec(_input.value))) {
				const start = match.index
				const end = PATTERN.lastIndex
				if (webdings.some((x) => x === match[0])) {
					search.push({ start, end, length: end - start })
				}
			}
			// REPLACE ALL WEBDINGS IN RENDERING
			const webdingMatches = _input.value.match(PATTERN)
			content = _input.value.replaceAll(' ', '&nbsp;')
			for (let i = 0; i < webdingMatches?.length; i++) {
				const webding = webdingMatches[i]
				if (webdings.some((x) => x === webding)) {
					content = content.replace(`:${webding}:`, renderWebding(webdingLUT[webding]))
				}
			}

			cursor_pos = getCursorPos(_input)
			//SET CURSOR, IF INSIDE REGISTERED WEBDING
			for (let i = 0; i < search.length; i++) {
				const s = search[i]
				if (cursor_pos.start == s.start || cursor_pos.end == s.start) {
					setCursorPos(_input, s.end + 1, s.end + 1)
					cursor_pos.end = s.end + 1
					cursor_pos.start = s.end + 1
				}
				if (cursor_pos.start == s.end || cursor_pos.end == s.end) {
					setCursorPos(_input, s.start - 1, s.start - 1)
					cursor_pos.end = s.start - 1
					cursor_pos.start = s.start - 1
				}
				console.log(cursor_pos.start, s.start, s.end)
			}

			// SUM OF WEBDING LENGTHS
			const webding_compensation = search
				.filter((x) => x.start <= cursor_pos.start)
				.reduce((acc, curr) => acc + curr.length - 1, 0)

			cursor_max = _input.value.length
			cursor_padding = ''
			for (let i = 0; i < cursor_pos.start - webding_compensation; i++) {
				cursor_padding += '&nbsp;'
			}
			cursor_char = '█'
			for (let i = 0; i < cursor_pos.end - cursor_pos.start; i++) {
				cursor_char += '█'
			}
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

<TerminalLine>Interactive mode! (beta)</TerminalLine>

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
