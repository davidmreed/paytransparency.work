<script lang="ts">
	import type { Locale } from './data';

	interface Props {
		locale: Locale;
	}

	let { locale }: Props = $props();
</script>

<span style="text-decoration: none; display: inline-block;">
	<!-- We use this repetitive logic because our SVG-inlining package will not process dynamic SVG paths -->
	<!-- This ensures that paths are static at build time. -->
	{#if locale.country == 'United States'}
		<span style="font-size: 28px; position:relative; left: 15px;">🇺🇸</span>
		{#if locale.stateCode == 'AK'}
			<svg data-inline-src="AK.svg" />
		{:else if locale.stateCode == 'AL'}
			<svg data-inline-src="AL.svg" />
		{:else if locale.stateCode == 'AR'}
			<svg data-inline-src="AR.svg" />
		{:else if locale.stateCode == 'AZ'}
			<svg data-inline-src="AZ.svg" />
		{:else if locale.stateCode == 'CA'}
			<svg data-inline-src="CA.svg" />
		{:else if locale.stateCode == 'CO'}
			<svg data-inline-src="CO.svg" />
		{:else if locale.stateCode == 'CT'}
			<svg data-inline-src="CT.svg" />
		{:else if locale.stateCode == 'DC'}
			<svg data-inline-src="DC.svg" />
		{:else if locale.stateCode == 'DE'}
			<svg data-inline-src="DE.svg" />
		{:else if locale.stateCode == 'FL'}
			<svg data-inline-src="FL.svg" />
		{:else if locale.stateCode == 'GA'}
			<svg data-inline-src="GA.svg" />
		{:else if locale.stateCode == 'HI'}
			<svg data-inline-src="HI.svg" />
		{:else if locale.stateCode == 'IA'}
			<svg data-inline-src="IA.svg" />
		{:else if locale.stateCode == 'ID'}
			<svg data-inline-src="ID.svg" />
		{:else if locale.stateCode == 'IL'}
			<svg data-inline-src="IL.svg" />
		{:else if locale.stateCode == 'IN'}
			<svg data-inline-src="IN.svg" />
		{:else if locale.stateCode == 'KS'}
			<svg data-inline-src="KS.svg" />
		{:else if locale.stateCode == 'KY'}
			<svg data-inline-src="KY.svg" />
		{:else if locale.stateCode == 'LA'}
			<svg data-inline-src="LA.svg" />
		{:else if locale.stateCode == 'MA'}
			<svg data-inline-src="MA.svg" />
		{:else if locale.stateCode == 'MD'}
			<svg data-inline-src="MD.svg" />
		{:else if locale.stateCode == 'ME'}
			<svg data-inline-src="ME.svg" />
		{:else if locale.stateCode == 'MI'}
			<svg data-inline-src="MI.svg" />
		{:else if locale.stateCode == 'MN'}
			<svg data-inline-src="MN.svg" />
		{:else if locale.stateCode == 'MO'}
			<svg data-inline-src="MO.svg" />
		{:else if locale.stateCode == 'MS'}
			<svg data-inline-src="MS.svg" />
		{:else if locale.stateCode == 'MT'}
			<svg data-inline-src="MT.svg" />
		{:else if locale.stateCode == 'NC'}
			<svg data-inline-src="NC.svg" />
		{:else if locale.stateCode == 'ND'}
			<svg data-inline-src="ND.svg" />
		{:else if locale.stateCode == 'NE'}
			<svg data-inline-src="NE.svg" />
		{:else if locale.stateCode == 'NH'}
			<svg data-inline-src="NH.svg" />
		{:else if locale.stateCode == 'NJ'}
			<svg data-inline-src="NJ.svg" />
		{:else if locale.stateCode == 'NM'}
			<svg data-inline-src="NM.svg" />
		{:else if locale.stateCode == 'NV'}
			<svg data-inline-src="NV.svg" />
		{:else if locale.stateCode == 'NY'}
			<svg data-inline-src="NY.svg" />
		{:else if locale.stateCode == 'OH'}
			<svg data-inline-src="OH.svg" />
		{:else if locale.stateCode == 'OK'}
			<svg data-inline-src="OK.svg" />
		{:else if locale.stateCode == 'OR'}
			<svg data-inline-src="OR.svg" />
		{:else if locale.stateCode == 'PA'}
			<svg data-inline-src="PA.svg" />
		{:else if locale.stateCode == 'RI'}
			<svg data-inline-src="RI.svg" />
		{:else if locale.stateCode == 'SC'}
			<svg data-inline-src="SC.svg" />
		{:else if locale.stateCode == 'SD'}
			<svg data-inline-src="SD.svg" />
		{:else if locale.stateCode == 'TN'}
			<svg data-inline-src="TN.svg" />
		{:else if locale.stateCode == 'TX'}
			<svg data-inline-src="TX.svg" />
		{:else if locale.stateCode == 'UT'}
			<svg data-inline-src="UT.svg" />
		{:else if locale.stateCode == 'VA'}
			<svg data-inline-src="VA.svg" />
		{:else if locale.stateCode == 'VT'}
			<svg data-inline-src="VT.svg" />
		{:else if locale.stateCode == 'WA'}
			<svg data-inline-src="WA.svg" />
		{:else if locale.stateCode == 'WI'}
			<svg data-inline-src="WI.svg" />
		{:else if locale.stateCode == 'WV'}
			<svg data-inline-src="WV.svg" />
		{:else if locale.stateCode == 'WY'}
			<svg data-inline-src="WY.svg" />
		{/if}
	{:else if locale.country == 'Canada'}
		<span style="font-size: 28px; position:relative; left: 15px;">🇨🇦</span>
		{#if locale.stateCode == 'BC'}
			<svg data-inline-src="CA-BC.svg" />
		{:else if locale.stateCode == 'PE'}
			<svg data-inline-src="CA-PE.svg" />
		{:else if locale.stateCode == 'ON'}
			<svg data-inline-src="CA-ON.svg" />
		{/if}
	{/if}
</span>
