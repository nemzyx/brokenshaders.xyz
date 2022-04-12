export default {
	whoami: '../lib/BrokenOS/programs/Whoami.svelte',
	clear: '../lib/BrokenOS/programs/Clear.svelte',
	ls: '../lib/BrokenOS/programs/Ls.svelte'
}

const newField = () => ({ LINES: [], PROGRAM: null })
const setClass = (cls, msg) => `<span class="${cls}">${msg}</span>`
const notFound = (cmd) =>
	setClass('col-alt', 'command ') + setClass(' ', `'${cmd}' `) + setClass('col-alt', 'not found')
export { newField, setClass, notFound }
