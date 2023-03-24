<script lang="ts">
	import { getFormattedLocale, type LocalityData } from '$lib/data';
	import GreenCheckIcon from '$lib/GreenCheckIcon.svelte';
	import RedPlusIcon from '$lib/RedPlusIcon.svelte';
	import BullhornIcon from '$lib/BullhornIcon.svelte';
	import Situation from '$lib/Situation.svelte';
	import StateIcon from '$lib/StateIcon.svelte';

	export let data: LocalityData;

	let locale = getFormattedLocale(data);
</script>

<svelte:head>
	<title>Pay Transparency in {locale}</title>
</svelte:head>
<h1>
	Pay Transparency in {locale}
	<span class="float-right"><StateIcon locale={data} /></span>
</h1>
<p>
	{locale}'s <strong>{data.strength}</strong> pay transparency law applies when:
</p>
<ul class="pb-2 indent">
	{#if data.who.minEmployees}
		<li>the employer <strong>has {data.who.minEmployees} employees or more</strong>;</li>
	{/if}
	{#if data.who.minEmployeesInLocale}
		<li>
			the employer <strong
				>has {data.who.minEmployeesInLocale} employee{#if data.who.minEmployeesInLocale > 1}s{/if} or
				more</strong
			>
			in {locale};
		</li>
	{/if}
	{#if data.who.officeInLocale}<li>
			the employer <strong>has a presence in {locale};</strong>
			<br /><span class="italic text-xs"
				>Note that this criterion is often poorly defined by the locale.</span
			>
		</li>{/if}
	{#if data.who.canHireInLocale}
		<li>the role <strong>can be hired in {locale}</strong> (including remote);</li>{/if}
</ul>
<p>The employer must disclose:</p>
<ul class="pb-2 indent">
	{#if data.what.salary}
		<li>
			<GreenCheckIcon />
			the <strong>pay range</strong>
		</li>
	{/if}
	{#if data.what.benefits}
		<li>
			<RedPlusIcon />
			the <strong>benefits</strong>
		</li>
	{/if}
</ul>
<p>Disclosure must happen:</p>
<ul class="pb-2 indent">
	{#each data.when as situation (situation.situation)}
		<li><Situation {situation} /></li>
	{/each}
</ul>
<hr class="color-gray-900 p-1" />
<p>
	{#if data.referenceUrl && data.referenceSource}Learn more at <a href={data.referenceUrl}
			>{data.referenceSource}</a
		>.{/if}
	{#if data.legalUrl}Review the <a href={data.legalUrl}>legislation</a>.{/if}
</p>
{#if data.reportViolationProcess || data.reportViolationUrl}
	<p>
		<BullhornIcon />
		Report a violation
		{#if data.reportViolationUrl}
			<a href={data.reportViolationUrl}>{data.reportViolationProcess || 'here'}</a>.
		{:else if data.reportViolationProcess}
			{data.reportViolationProcess}.
		{/if}
	</p>
{/if}
{#if data.penalty}
	<p>
		The penalty for violations is {data.penalty}.
	</p>
{/if}
<p class="text-xs italic text-center pt-2">
	This summary may not capture all nuances of the legislation. Review guidance from {locale}
	to confirm compliance.
</p>
