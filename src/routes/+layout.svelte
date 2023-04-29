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
			class="w-10/12 md:w-2/3 max-w-screen-lg bg-white rounded-xl p-3 pl-6 pr-6 md:p-6 md:pl-10 md:pr-10 bg-zinc-100 shadow-md shadow-black"
		>
			<slot />
		</div>
	</div>
</main>
<footer>
	<div class="flex flex-row justify-center items-center">
		<div class="bg-gray-700 mb-4 text-center mt-4 w-1/2">
			<nav class="p-2 text-white">
				<a class="text-white" href="/">Home</a> |
				<a class="text-white" href="/about">About</a> |
				<a class="text-white" href="/find-your-rights">Find Your Transparency Rights</a> |
				<a class="text-white" href="https://github.com/davidmreed/paytransparency.work">GitHub</a> |
				<a class="text-white" href="https://ktema.org">by David Reed</a>
			</nav>
		</div>
	</div>
</footer>
