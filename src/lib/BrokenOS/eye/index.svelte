<script>
	import getArt from './art.js'
	import TerminalLine from '$lib/Terminal/Line.svelte'
	import delay from '$util/delay.js'
	import { onMount } from 'svelte'

	let art = getArt()

	const RND = () => Math.floor(Math.random() * art.length)

	let animate = false
	let float = false
	let idx = 0

	const sysChars = ['&', 'n', 'b', 's', 'p', ';', '<', 'r', '>']
	const inSys = (c) => sysChars.some((x) => x === c)

	onMount(async () => {
		const loop = () => {
			if (idx >= art.length) return
			else idx += 50

			requestAnimationFrame(loop)
		}
		loop()
		await delay(10500)
		animate = true
		await delay(300)
		let CNT = 0
		const disolve = () => {
			for (let i = 0; i < 30; i++) {
				let lim = 0
				let rnd = RND()
				if (CNT < 40) {
					while (inSys(art[rnd]) && lim < 20) {
						rnd = RND()
						lim++
					}
				}
				while (inSys(art[rnd]) && lim < 20) {
					rnd = RND()
					lim++
				}
				if (CNT > 50) {
					float = true
					art = art.slice(0, art.length - 10)
				} else {
					art = art.slice(0, rnd - 1) + art.slice(rnd, art.length)
				}
			}
			console.log(art.length)
			CNT++
			requestAnimationFrame(disolve)
		}
		disolve()
	})
</script>

<TerminalLine usr={false}>
	<div class="art" class:animate class:float>
		{@html art.slice(0, idx)}
	</div>
</TerminalLine>

<style>
	@keyframes shake {
		0% {
			left: 10vw;
		}
		4% {
			left: 10vw;
		}
		5% {
			left: calc(10vw + 1px);
		}
		6% {
			left: 10vw;
		}
		69% {
			left: 10vw;
		}
		70% {
			left: calc(10vw + 2px);
		}
		71% {
			left: 10vw;
		}
		82% {
			left: calc(10vw - 2px);
		}
		83% {
			left: 10vw;
		}
		98% {
			left: 10vw;
		}
		99% {
			left: calc(10vw + 1px);
		}
		100% {
			left: 10vw;
		}
	}

	.art {
		font-family: var(--font-mono);
		color: var(--accent-color);
		position: relative;
		left: 10vw;
		animation: 2s shake steps(1) infinite;
	}

	@keyframes flicker {
		0% {
			opacity: 1;
		}
		4% {
			opacity: 0.9;
		}
		8% {
			opacity: 0.95;
		}
		12% {
			opacity: 0.8;
		}
		16% {
			opacity: 0.85;
		}
		20% {
			opacity: 0.4;
		}
		24% {
			opacity: 0.6;
		}
		28% {
			opacity: 0.5;
		}
		32% {
			opacity: 0.55;
		}
		36% {
			opacity: 0.45;
		}
		40% {
			opacity: 0.4;
		}
		44% {
			opacity: 0.3;
		}
		48% {
			opacity: 0.4;
		}
		52% {
			opacity: 0.35;
		}
		56% {
			opacity: 0.3;
		}
		60% {
			opacity: 0.35;
		}
		64% {
			opacity: 0.4;
		}
		68% {
			opacity: 0.3;
		}
		72% {
			opacity: 0.2;
		}
		76% {
			opacity: 0.34;
		}
		80% {
			opacity: 0.2;
		}
		84% {
			opacity: 0.4;
		}
		88% {
			opacity: 0.23;
		}
		92% {
			opacity: 0.1;
		}
		96% {
			opacity: 0.25;
		}
		100% {
			opacity: 0.1;
		}
	}

	.animate {
		animation: 250ms flicker steps(1) infinite;
	}

	.float {
		float: right;
	}
</style>
