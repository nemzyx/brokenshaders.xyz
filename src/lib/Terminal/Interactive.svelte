<script>
	//Get CLI for autocompletion purposes ONLY
	export let CLI

	export let forcedFocus = false

	import TerminalLine from '$lib/Terminal/Line.svelte'
	import Caret from '$lib/Terminal/Caret.svelte'
	let BLNK = true
	let blnkTimer = null
	const startBlnkTimer = () => {
		blnkTimer = setTimeout(() => {
			BLNK = true
		}, 300)
	}

	import webdingLUT from '$util/webdingLUT.js'
	const webdings = Object.keys(webdingLUT)

	const fakeEvent = {
		get: (target, prop) => {
			return null
		}
	}

	import { getCursorPos, setCursorPos, getCurrentWord, replaceAt } from '$util/textarea.js'
	import { onMount, createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
	const PROMPT = () => {
		dispatch('prompt', {
			value: _input?.value,
			HTML: content
		})
		_input.value = ''
		update(fakeEvent)
		// blur and focus to autoscroll
		_input.blur()
		focus()
	}

	const renderWebding = (char) => `<span class="webding">&nbsp;${char}</span>`

	const cli_query = Object.keys(CLI)
		.filter((x) => x[0] != ':')
		.map((x) => ({
			display: `${x}`,
			value: `${x}`
		}))
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
	let suggest = false

	const PATTERN = /([A-z]{1,25})(?=:)/g

	let _input
	let cursor_pos
	let cursor_padding = ''
	let cursor_char = '█'
	let content = ''
	let prevWord = ''
	const update = (e) => {
		BLNK = false
		clearTimeout(blnkTimer)
		startBlnkTimer()

		let t = 0
		if (e.metaKey || e.ctrlKey) {
			t = 10
		}
		let tab = null
		let ent = false
		let esc = false
		let bck = false
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
		if (e.key === 'Backspace') bck = true
		if (e.key === 'Escape') esc = true
		setTimeout(() => {
			let cancel_prompt = false
			// SEARCH INDEXES OF WEBDINGS
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

			if (tab) {
				suggest = true
			}

			const resetSuggestion = () => {
				suggest = false
				completeSelected = -1
			}

			if (word[0] == ':' || suggest) {
				let FIL = null
				if (word[0] == ':') {
					if (word == '') resetSuggestion()
					//Webding filtering
					FIL = webdings_query.filter(({ value }) => value != word && value.includes(word))
				} else {
					if (word != prevWord) resetSuggestion()
					//CMD filtering
					FIL = cli_query.filter(({ value }) => value != word && value.includes(word))
				}
				if (esc || bck) {
					resetSuggestion()
					update(fakeEvent)
				}
				setCompleteSelected(tab, FIL.length)
				complete = FIL.map((x, i) => {
					const selected = i == completeSelected
					if (selected) {
						if (ent) {
							cancel_prompt = true
							replaceAt(_input, x.value, word, word_obj.start)
							update(fakeEvent)
						}
					}
					return {
						display: x.display,
						value: x.value,
						selected
					}
				})
			} else {
				complete = null
			}

			if (ent && !cancel_prompt) {
				PROMPT()
				resetSuggestion()
			}
			prevWord = word
		}, t)
	}

	const focus = () => {
		_input.focus()
	}

	const blurHandler = () => {
		if (forcedFocus) _input.focus()
	}

	onMount(focus)
</script>

<div class="hide">
	<input bind:this={_input} on:keydown={update} on:input={update} on:blur={blurHandler} />
</div>
<div class="interactive" on:click={focus}>
	<TerminalLine>
		{@html content}<span class="caret-overlay"
			>&nbsp;&nbsp;&nbsp;&nbsp;{@html cursor_padding}<Caret blink={BLNK} char={cursor_char} /></span
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
		/* height: 0; */
		width: 0;
		opacity: 0;
		user-select: none;
		position: absolute;
		bottom: 0;
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
		padding-right: 5px;
	}
</style>
