function getCursorPos(input) {
	if ('selectionStart' in input && document.activeElement == input) {
		return {
			start: input.selectionStart,
			end: input.selectionEnd
		}
	} else if (input.createTextRange) {
		var sel = document.selection.createRange()
		if (sel.parentElement() === input) {
			var rng = input.createTextRange()
			rng.moveToBookmark(sel.getBookmark())
			for (var len = 0; rng.compareEndPoints('EndToStart', rng) > 0; rng.moveEnd('character', -1)) {
				len++
			}
			rng.setEndPoint('StartToStart', input.createTextRange())
			for (
				var pos = { start: 0, end: len };
				rng.compareEndPoints('EndToStart', rng) > 0;
				rng.moveEnd('character', -1)
			) {
				pos.start++
				pos.end++
			}
			return pos
		}
	}
	return -1
}

function setCursorPos(input, start, end) {
	if (arguments.length < 3) end = start
	if ('selectionStart' in input) {
		setTimeout(function () {
			input.selectionStart = start
			input.selectionEnd = end
		}, 1)
	} else if (input.createTextRange) {
		var rng = input.createTextRange()
		rng.moveStart('character', start)
		rng.collapse()
		rng.moveEnd('character', end - start)
		rng.select()
	}
}

const wordSeps = [' ', '&nbsp;']
const notInWordSeps = (x) => !wordSeps.some((y) => y === x)

function getCurrentWord(input, start) {
	let word = ''
	let word_start
	let word_end
	const str = input.value
	let ptr = start // current letter
	if (str[ptr] != ' ') {
		while (notInWordSeps(str[ptr - 1]) && ptr > 0) {
			ptr--
		}
		word_start = ptr
		while (notInWordSeps(str[ptr]) && ptr < str.length) {
			ptr++
		}
		word_end = ptr
		word = str.slice(word_start, word_end)
	}
	return {
		word,
		start: word_start,
		end: word_end
	}
}

function replaceAt(input, replaceStr, ogStr, start) {
	const str = input.value
	const mut = str.slice(0, start) + replaceStr + str.slice(start + ogStr.length, str.length)
	input.value = mut
}

export { getCursorPos, setCursorPos, getCurrentWord, replaceAt }
