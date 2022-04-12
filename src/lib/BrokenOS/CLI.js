export default {
	whoami: 'Whoami',
	clear: 'Clear',
	ls: 'Ls',
	':cat:': 'Meow'
}

const newField = () => ({ LINES: [], PROGRAM: null })
const setClass = (cls, msg) => `<span class="${cls}">${msg}</span>`
const notFound = (cmd) =>
	setClass('col-alt', 'command ') + setClass(' ', `'${cmd}' `) + setClass('col-alt', 'not found')
export { newField, setClass, notFound }
