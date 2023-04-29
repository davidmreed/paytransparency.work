<script lang="ts">
	import type { Locale } from '$lib/data';
	import GreenCheckIcon from '$lib/GreenCheckIcon.svelte';
	import RedPlusIcon from '$lib/RedPlusIcon.svelte';
	import BullhornIcon from '$lib/BullhornIcon.svelte';
	import SituationDescription from '$lib/SituationDescription.svelte';
	import StateIcon from '$lib/StateIcon.svelte';
	import ScaleIcon from '$lib/ScaleIcon.svelte';
	import BookIcon from '$lib/BookIcon.svelte';
	import DollarIcon from '$lib/DollarIcon.svelte';

	export let data: { locale: Locale };
</script>

<svelte:head>
	<title>Pay Transparency in {data.locale.name}</title>
</svelte:head>
<h1>
	Pay Transparency in {data.locale.name}
	<span class="float-right"><StateIcon locale={data.locale} /></span>
</h1>
<p>
	{data.locale.name}'s <strong>{data.locale.strength}</strong> pay transparency law applies when:
</p>
<ul class="pb-2 indent">
	{#if data.locale.who.minEmployees}
		<li>the employer <strong>has {data.locale.who.minEmployees} employees or more</strong>;</li>
	{/if}
	{#if data.locale.who.minEmployeesInLocale}
		<li>
			the employer <strong
				>has {data.locale.who.minEmployeesInLocale} employee{#if data.locale.who.minEmployeesInLocale > 1}s{/if}
				or more</strong
			>
			in {data.locale.name};
		</li>
	{/if}
	{#if data.locale.who.officeInLocale}<li>
			the employer <strong>has a presence in {data.locale.name};</strong>
			<br /><span class="italic text-xs"
				>Note that this criterion is often poorly defined by the locale.</span
			>
		</li>{/if}
	{#if data.locale.who.canHireInLocale}
		<li>
			the role <strong>can be hired in {data.locale.name}</strong> (including remote);
		</li>{/if}
</ul>
<p>The employer must disclose:</p>
<ul class="pb-2 indent">
	{#if data.locale.what.salary}
		<li>
			<DollarIcon />
			the <strong>pay range</strong>
		</li>
	{/if}
	{#if data.locale.what.benefits}
		<li>
			<RedPlusIcon />
			the <strong>benefits</strong>
		</li>
	{/if}
</ul>
<p>Disclosure must happen:</p>
<ul class="pb-2 indent">
	{#each data.locale.when as situation (situation.situation)}
		<li><SituationDescription {situation} /></li>
	{/each}
</ul>
<hr class="color-gray-900 p-1" />
<p>
	{#if (data.locale.referenceUrl && data.locale.referenceSource) || data.locale.legalUrl}<BookIcon
		/>{/if}
	{#if data.locale.referenceUrl && data.locale.referenceSource}Learn more at <a
			href={data.locale.referenceUrl}>{data.locale.referenceSource}</a
		>.{/if}
	{#if data.locale.legalUrl}Review the <a href={data.locale.legalUrl}>legislation</a>.{/if}
</p>
{#if data.locale.reportViolationProcess || data.locale.reportViolationUrl}
	<p>
		<BullhornIcon />
		Report a violation
		{#if data.locale.reportViolationUrl}
			<a href={data.locale.reportViolationUrl}>{data.locale.reportViolationProcess || 'here'}</a>.
		{:else if data.locale.reportViolationProcess}
			{data.locale.reportViolationProcess}.
		{/if}
	</p>
{/if}
{#if data.locale.penalty}
	<p>
		<ScaleIcon />
		The penalty for violations is {data.locale.penalty}.
	</p>
{/if}
<p class="text-xs italic text-center pt-2">
	This summary may not capture all nuances of the legislation. Review guidance from
	{data.locale.name} to confirm compliance.
</p>
