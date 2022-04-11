<script>
	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Caret from '$lib/Terminal/Caret.svelte'

	import webdingLUT from '$util/webdingLUT.js'
	const webdings = Object.keys(webdingLUT)

	import { getCursorPos, setCursorPos, getCurrentWord, replaceAt } from '$util/textarea.js'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'

	const renderWebding = (char) => `<span class="webding">&nbsp;${char}</span>`

	const webdings_query = Object.keys(webdingLUT).map((x) => ({
		display: `:${x}: ${renderWebding(webdingLUT[x])}`,
		value: `:${x}:`
	}))

	let complete = null //autocompletion list
	let completeSelected = -1
	const setCompleteSelected = (tab, max) => {
		if (tab == 'next') {
			if (completeSelected < max - 1) {
				completeSelected++
			} else {
				completeSelected = 0
			}
		}
		if (tab == 'back') {
			if (completeSelected > 0) {
				completeSelected--
			} else {
				completeSelected = max - 1
			}
		}
	}

	const PATTERN = /(?<=:)([A-z]{1,25})(?=:)/g

	let _input
	let cursor_pos
	let cursor_padding = ''
	let cursor_char = '█'
	let content = ''
	const update = (e) => {
		let t = 0
		if (e.metaKey || e.ctrlKey) {
			t = 10
		}
		let tab = false
		let ent = false
		if (e.key === 'Tab') {
			e.preventDefault()
			if (e.shiftKey) {
				tab = 'back'
			} else {
				tab = 'next'
			}
		}
		if (e.key === 'Enter') {
			e.preventDefault()
			ent = true
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
			}

			// SUM OF WEBDING LENGTHS
			const webding_compensation = search
				.filter((x) => x.start <= cursor_pos.start)
				.reduce((acc, curr) => acc + curr.length - 1, 0)

			cursor_padding = ''
			for (let i = 0; i < cursor_pos.start - webding_compensation; i++) {
				cursor_padding += '&nbsp;'
			}
			cursor_char = '█'
			for (let i = 0; i < cursor_pos.end - cursor_pos.start; i++) {
				cursor_char += '█'
			}

			//CURRENT WORD
			const word_obj = getCurrentWord(_input, cursor_pos.start)
			const { word } = word_obj
			if (word == '') {
				completeSelected = -1
			}
			if (word[0] == ':') {
				const FIL = webdings_query.filter(({ value }) => value != word && value.includes(word))
				setCompleteSelected(tab, FIL.length)
				complete = FIL.map((x, i) => {
					const selected = i == completeSelected
					if (selected) {
						if (ent) {
							console.log(`REPLACE WITH ${x.value}`)
							replaceAt(_input, x.value, word, word_obj.start)
							const fakeEvent = {
								...e,
								get: (target, prop) => {
									if (prop === 'key') {
										return null
									}
									return target[prop]
								}
							}
							update(fakeEvent)
						}
					}
					return {
						display: x.display,
						value: x.value,
						selected
					}
				})
				console.log(completeSelected)
			} else {
				complete = null
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
</div>
<div class="interactive" on:click={focus}>
	<TerminalLine>
		{@html content}<span class="caret-overlay"
			>&nbsp;&nbsp;&nbsp;&nbsp;{@html cursor_padding}<Caret
				blink={false}
				char={cursor_char}
			/></span
		>
		{#if complete}
			<div class="completeContainer">
				&nbsp;&nbsp;&nbsp;{@html cursor_padding}
				<ul class="autocomplete">
					{#each complete as { selected, display, value }}
						<li class:selected>{@html display}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</TerminalLine>
</div>

<!-- <TerminalLine>Interactive mode! (beta)</TerminalLine> -->
<style lang="scss">
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
		cursor: text;
	}

	.completeContainer {
		display: block;
		position: absolute;
		z-index: 1;
	}

	.autocomplete {
		display: inline-block;
		position: relative;
		top: 1.5px;
		left: -0.3px;

		li {
			background: var(--tertiary-color);
			&.selected {
				background: var(--accent-color);
			}
		}
	}

	:global(.autocomplete .webding) {
		letter-spacing: 0px;
		float: left;
	}
</style>
