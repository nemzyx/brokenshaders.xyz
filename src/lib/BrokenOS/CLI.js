export default {
	whoami: '../lib/BrokenOS/programs/Whoami.svelte',
	clear: '../lib/BrokenOS/programs/Clear.svelte',
	ls: '../lib/BrokenOS/programs/Ls.svelte'
}

const newField = () => ({ LINES: [], PROGRAM: null })
export { newField }
