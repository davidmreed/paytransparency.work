<script lang="ts">
	import '../app.css';
</script>

<div class="bg-gray-600 pb-8 text-white text-center">
	<nav class="p-2">
		<a class="text-white" href="/">Home</a>
		<a class="text-white" href="/about">About</a>
	</nav>
	<aside class="font-light text-xs italic ">
		This site does not provide legal advice. Please consult an attorney or official government
		resources.
	</aside>
</div>
<main>
	<div class="pt-12 flex flex-row justify-center items-center">
		<div class="w-2/3 bg-white rounded-xl p-6 pl-10 pr-10 bg-zinc-100 shadow-md shadow-black">
			<slot />
		</div>
	</div>
</main>
