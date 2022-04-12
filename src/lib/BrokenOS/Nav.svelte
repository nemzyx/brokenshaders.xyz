<script>
	export let running = false
	import Webding from '$lib/IconWebding.svelte'
</script>

<nav>
	<ul>
		<li class="icon" class:running>
			<Webding>&#xe903;</Webding>
		</li>
		<li>
			<a href="/">&nbsp;{`« `}ESC&nbsp;</a>
		</li>
		<li>
			<span style="display: inline-block; width: 55px" />
		</li>
		<span class="desktop info">
			<li>BROKEN-OS ~ 0.1</li>
			<li>
				<span style="display: inline-block" />
			</li>
			<li>2038 NULL</li>
		</span>
		<span class="mobile">
			<span style="float:right">
				<li>BROKEN-OS ~ 0.1</li>
			</span>
			<div class="info">
				<div>
					<li>2038 NULL</li>
				</div>
			</div>
		</span>
	</ul>
</nav>

<style>
	nav {
		/* user-select: none; */
		background: var(--accent-color-alt);
		color: var(--tertiary-color);
		margin-bottom: 10px;

		position: sticky;
		top: 10px;
		z-index: 10;
	}

	li {
		display: inline;
	}

	a:hover {
		text-decoration: none;
	}

	a {
		color: white;
		background: var(--accent-color);
		display: inline-block;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg) translate(6px, 0);
		}
		25% {
			transform: rotate(90deg) translate(0.5px, -6.5px);
		}
		50% {
			transform: rotate(180deg) translate(-6px, -1px);
		}
		75% {
			transform: rotate(270deg) translate(-0.5px, 5.5px);
		}
		100% {
			transform: rotate(360deg) translate(6px, 0);
		}
	}

	:global(.icon.running span) {
		/* background: red; */
		animation: 700ms spin steps(2) infinite;
	}

	:global(.icon span) {
		width: 19px !important;
		transform: translate(6px, 0);
	}

	.mobile .info {
		background: var(--accent-color-alt);
		text-align: right;
	}

	.desktop {
		display: initial;
	}
	.mobile {
		display: none;
	}
	@media (max-width: 450px) {
		.desktop {
			display: none;
		}
		.mobile {
			display: initial;
		}
	}
</style>
