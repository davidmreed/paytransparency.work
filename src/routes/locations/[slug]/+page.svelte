<script lang="ts">
	import type { Locale } from '$lib/data';
	import GreenCheckIcon from '$lib/GreenCheckIcon.svelte';
	import RedPlusIcon from '$lib/RedPlusIcon.svelte';
	import BullhornIcon from '$lib/BullhornIcon.svelte';
	import SituationDescription from '$lib/SituationDescription.svelte';
	import StateIcon from '$lib/StateIcon.svelte';

	export let locale: Locale;
</script>

<svelte:head>
	<title>Pay Transparency in {locale.name}</title>
</svelte:head>
<h1>
	Pay Transparency in {locale.name}
	<span class="float-right"><StateIcon {locale} /></span>
</h1>
<p>
	{locale}'s <strong>{locale.strength}</strong> pay transparency law applies when:
</p>
<ul class="pb-2 indent">
	{#if locale.who.minEmployees}
		<li>the employer <strong>has {locale.who.minEmployees} employees or more</strong>;</li>
	{/if}
	{#if locale.who.minEmployeesInLocale}
		<li>
			the employer <strong
				>has {locale.who.minEmployeesInLocale} employee{#if locale.who.minEmployeesInLocale > 1}s{/if}
				or more</strong
			>
			in {locale};
		</li>
	{/if}
	{#if locale.who.officeInLocale}<li>
			the employer <strong>has a presence in {locale};</strong>
			<br /><span class="italic text-xs"
				>Note that this criterion is often poorly defined by the locale.</span
			>
		</li>{/if}
	{#if locale.who.canHireInLocale}
		<li>the role <strong>can be hired in {locale}</strong> (including remote);</li>{/if}
</ul>
<p>The employer must disclose:</p>
<ul class="pb-2 indent">
	{#if locale.what.salary}
		<li>
			<GreenCheckIcon />
			the <strong>pay range</strong>
		</li>
	{/if}
	{#if locale.what.benefits}
		<li>
			<RedPlusIcon />
			the <strong>benefits</strong>
		</li>
	{/if}
</ul>
<p>Disclosure must happen:</p>
<ul class="pb-2 indent">
	{#each locale.when as situation (situation.situation)}
		<li><SituationDescription {situation} /></li>
	{/each}
</ul>
<hr class="color-gray-900 p-1" />
<p>
	{#if locale.referenceUrl && locale.referenceSource}Learn more at <a href={locale.referenceUrl}
			>{locale.referenceSource}</a
		>.{/if}
	{#if locale.legalUrl}Review the <a href={locale.legalUrl}>legislation</a>.{/if}
</p>
{#if locale.reportViolationProcess || locale.reportViolationUrl}
	<p>
		<BullhornIcon />
		Report a violation
		{#if locale.reportViolationUrl}
			<a href={locale.reportViolationUrl}>{locale.reportViolationProcess || 'here'}</a>.
		{:else if locale.reportViolationProcess}
			{locale.reportViolationProcess}.
		{/if}
	</p>
{/if}
{#if locale.penalty}
	<p>
		The penalty for violations is {locale.penalty}.
	</p>
{/if}
<p class="text-xs italic text-center pt-2">
	This summary may not capture all nuances of the legislation. Review guidance from {locale}
	to confirm compliance.
</p>
