<script lang="ts">
	import type { LocalityData } from '$lib/data';

	export let data: LocalityData;

	let locale = data.city ? `${data.city}, ${data.stateCode}` : data.state;
	let svgPath = `/svgs/${data.stateCode}.svg`;
</script>

<svelte:head>
	<title>Pay Transparency in {locale}</title>
</svelte:head>
<h1>
	<img alt={locale} src={svgPath} class="float-right" />
	Pay Transparency in {locale}
</h1>
<p>
	{locale}'s <strong>{data.strength}</strong> pay transparency law applies when:
</p>
<ul class="pb-2 indent">
	{#if data.who.minEmployees}
		<li>the employer <strong>has {data.who.minEmployees} employees or more</strong></li>
	{/if}
	{#if data.who.minEmployeesInLocale}
		<li>
			the employer <strong
				>has {data.who.minEmployeesInLocale} employee{#if data.who.minEmployeesInLocale > 1}s{/if} or
				more</strong
			>
			in {locale}
		</li>
	{/if}
	{#if data.who.officeInLocale}<li>
			the employer <strong>has a presence in {locale}</strong>
			<br /><span class="italic text-xs"
				>Note that this criterion is often poorly defined by the locale.</span
			>
		</li>{/if}
	{#if data.who.canHireInLocale}
		<li>the role <strong>can be hired in {locale}</strong> (including remote)</li>{/if}
</ul>
<p>The employer must disclose:</p>
<ul class="pb-2 indent">
	{#if data.what.salary}
		<li>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6 fill-green-900"
			>
				<path
					d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z"
				/>
				<path
					fill-rule="evenodd"
					d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
					clip-rule="evenodd"
				/>
			</svg>
			the <strong>pay range</strong>
		</li>
	{/if}
	{#if data.what.benefits}
		<li>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6 fill-orange-700"
			>
				<path
					fill-rule="evenodd"
					d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
					clip-rule="evenodd"
				/>
			</svg>
			the <strong>benefits</strong>
		</li>
	{/if}
</ul>
<p>Disclosure must happen:</p>
<ul class="pb-2 indent">
	{#if data.when.inPosting}
		<li>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6 mr-1 fill-green-900"
			>
				<path
					fill-rule="evenodd"
					d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
					clip-rule="evenodd"
				/>
			</svg>in the <strong>job posting</strong>
		</li>
	{/if}
	{#if data.when.afterInterview}
		<li>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6 mr-1 fill-green-900"
			>
				<path
					fill-rule="evenodd"
					d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
					clip-rule="evenodd"
				/>
			</svg>after the <strong>first interview</strong>
		</li>
	{/if}
	{#if data.when.onApplicantRequest}<li>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6 mr-1 fill-green-900"
			>
				<path
					fill-rule="evenodd"
					d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
					clip-rule="evenodd"
				/>
			</svg>on <strong>request from applicant</strong>
		</li>{/if}
	{#if data.when.onOffer}<li>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6 mr-1 fill-green-900"
			>
				<path
					fill-rule="evenodd"
					d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
					clip-rule="evenodd"
				/>
			</svg>upon <strong>making an offer</strong>
		</li>{/if}
	{#if data.when.onHire}<li>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6 mr-1 fill-green-900"
			>
				<path
					fill-rule="evenodd"
					d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
					clip-rule="evenodd"
				/>
			</svg>at <strong>time of hire</strong>
		</li>{/if}
	{#if data.when.onExistingEmployeeRequest}<li>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6 mr-1 fill-green-900"
			>
				<path
					fill-rule="evenodd"
					d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
					clip-rule="evenodd"
				/>
			</svg>on <strong>request from a current employee</strong>
		</li>{/if}
</ul>
{#if data.when.requestRequired}
	<p>... but the applicant must explicitly request disclosure</p>
{/if}
<hr class="color-gray-900 p-1" />
<p>
	{#if data.referenceUrl && data.referenceSource}Learn more at <a href={data.referenceUrl}
			>{data.referenceSource}</a
		>.{/if}
	{#if data.legalUrl}Review the <a href={data.legalUrl}>legislation</a>.{/if}
</p>
{#if data.reportViolationProcess || data.reportViolationUrl}
	<p>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="w-6 h-6 fill-red-900"
		>
			<path
				d="M16.881 4.346A23.112 23.112 0 018.25 6H7.5a5.25 5.25 0 00-.88 10.427 21.593 21.593 0 001.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.592.772-2.468a17.116 17.116 0 01-.628-1.607c1.918.258 3.76.75 5.5 1.446A21.727 21.727 0 0018 11.25c0-2.413-.393-4.735-1.119-6.904zM18.26 3.74a23.22 23.22 0 011.24 7.51 23.22 23.22 0 01-1.24 7.51c-.055.161-.111.322-.17.482a.75.75 0 101.409.516 24.555 24.555 0 001.415-6.43 2.992 2.992 0 00.836-2.078c0-.806-.319-1.54-.836-2.078a24.65 24.65 0 00-1.415-6.43.75.75 0 10-1.409.516c.059.16.116.321.17.483z"
			/>
		</svg>
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

<style lang="postcss">
	.indent {
		@apply pl-6;
	}
</style>
