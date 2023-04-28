<script lang="ts">
	import '../app.css';
</script>

<header>
	<div class="flex flex-row justify-center items-center">
		<div class="bg-gray-700 mb-4 text-white text-center mt-4 w-3/4 md:w-1/2">
			<aside class="font-light text-s italic p-2">
				This site does not provide legal advice and is not reviewed by an attorney.
			</aside>
		</div>
	</div>
</header>
<main>
	<div class="pt-6 pb-6 flex flex-row justify-center items-center">
		<div
			class="w-3/4 md:w-2/3 max-w-screen-lg bg-white rounded-xl p-6 pl-10 pr-10 bg-zinc-100 shadow-md shadow-black"
		>
			<slot />
		</div>
	</div>
</main>
<footer>
	<div class="flex flex-row justify-center items-center">
		<div class="bg-gray-700 mb-4 text-center mt-4 w-1/2">
			<nav class="p-2 text-white">
				<a href="/">Home</a> |
				<a href="/about">About</a> |
				<a href="/find-your-rights">Find Your Transparency Rights</a> |
				<a href="https://github.com/davidmreed/paytransparency.work">GitHub</a> |
				<a href="https://ktema.org">by David Reed</a>
			</nav>
		</div>
	</div>
</footer>
