<script lang="ts">
	import { Situation } from '$lib/data';
	import GreenCheckIcon from './GreenCheckIcon.svelte';
	export let situation: { situation: Situation; requestRequired?: boolean };
</script>

{#if situation}
	<GreenCheckIcon />
	{#if situation.situation === Situation.Interested}
		in the <strong>job posting</strong>
	{:else if situation.situation === Situation.Application}
		on <strong>request from applicant</strong>
	{:else if situation.situation === Situation.Interview}
		after the <strong>first interview</strong>
	{:else if situation.situation === Situation.Offer}
		upon <strong>making an offer</strong>
	{:else if situation.situation === Situation.Hire}
		at <strong>time of hire</strong>
	{:else if situation.situation === Situation.Employed}
		on <strong>request from a current employee</strong>
	{/if}
	{#if situation.requestRequired}
		... but an explicit request is required.
	{/if}
{/if}
