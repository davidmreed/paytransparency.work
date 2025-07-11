<script lang="ts">
	import type { Locale } from './data';

	interface Props {
		locale: Locale;
	}

	let { locale }: Props = $props();
	const stateCode = locale.stateCode;
	const country = locale.country;
</script>

<span style="text-decoration: none; display: inline-block;">
	<!-- We use this repetitive logic because our SVG-inlining package will not process dynamic SVG paths -->
	<!-- This ensures that paths are static at build time. -->
	{#if country == 'United States'}
		<span style="font-size: 28px; position:relative; left: 15px;">🇺🇸</span>
		{#if stateCode == 'AK'}
			<svg data-inline-src="AK.svg" />
		{:else if stateCode == 'AL'}
			<svg data-inline-src="AL.svg" />
		{:else if stateCode == 'AR'}
			<svg data-inline-src="AR.svg" />
		{:else if stateCode == 'AZ'}
			<svg data-inline-src="AZ.svg" />
		{:else if stateCode == 'CA'}
			<svg data-inline-src="CA.svg" />
		{:else if stateCode == 'CO'}
			<svg data-inline-src="CO.svg" />
		{:else if stateCode == 'CT'}
			<svg data-inline-src="CT.svg" />
		{:else if stateCode == 'DC'}
			<svg data-inline-src="DC.svg" />
		{:else if stateCode == 'DE'}
			<svg data-inline-src="DE.svg" />
		{:else if stateCode == 'FL'}
			<svg data-inline-src="FL.svg" />
		{:else if stateCode == 'GA'}
			<svg data-inline-src="GA.svg" />
		{:else if stateCode == 'HI'}
			<svg data-inline-src="HI.svg" />
		{:else if stateCode == 'IA'}
			<svg data-inline-src="IA.svg" />
		{:else if stateCode == 'ID'}
			<svg data-inline-src="ID.svg" />
		{:else if stateCode == 'IL'}
			<svg data-inline-src="IL.svg" />
		{:else if stateCode == 'IN'}
			<svg data-inline-src="IN.svg" />
		{:else if stateCode == 'KS'}
			<svg data-inline-src="KS.svg" />
		{:else if stateCode == 'KY'}
			<svg data-inline-src="KY.svg" />
		{:else if stateCode == 'LA'}
			<svg data-inline-src="LA.svg" />
		{:else if stateCode == 'MA'}
			<svg data-inline-src="MA.svg" />
		{:else if stateCode == 'MD'}
			<svg data-inline-src="MD.svg" />
		{:else if stateCode == 'ME'}
			<svg data-inline-src="ME.svg" />
		{:else if stateCode == 'MI'}
			<svg data-inline-src="MI.svg" />
		{:else if stateCode == 'MN'}
			<svg data-inline-src="MN.svg" />
		{:else if stateCode == 'MO'}
			<svg data-inline-src="MO.svg" />
		{:else if stateCode == 'MS'}
			<svg data-inline-src="MS.svg" />
		{:else if stateCode == 'MT'}
			<svg data-inline-src="MT.svg" />
		{:else if stateCode == 'NC'}
			<svg data-inline-src="NC.svg" />
		{:else if stateCode == 'ND'}
			<svg data-inline-src="ND.svg" />
		{:else if stateCode == 'NE'}
			<svg data-inline-src="NE.svg" />
		{:else if stateCode == 'NH'}
			<svg data-inline-src="NH.svg" />
		{:else if stateCode == 'NJ'}
			<svg data-inline-src="NJ.svg" />
		{:else if stateCode == 'NM'}
			<svg data-inline-src="NM.svg" />
		{:else if stateCode == 'NV'}
			<svg data-inline-src="NV.svg" />
		{:else if stateCode == 'NY'}
			<svg data-inline-src="NY.svg" />
		{:else if stateCode == 'OH'}
			<svg data-inline-src="OH.svg" />
		{:else if stateCode == 'OK'}
			<svg data-inline-src="OK.svg" />
		{:else if stateCode == 'OR'}
			<svg data-inline-src="OR.svg" />
		{:else if stateCode == 'PA'}
			<svg data-inline-src="PA.svg" />
		{:else if stateCode == 'RI'}
			<svg data-inline-src="RI.svg" />
		{:else if stateCode == 'SC'}
			<svg data-inline-src="SC.svg" />
		{:else if stateCode == 'SD'}
			<svg data-inline-src="SD.svg" />
		{:else if stateCode == 'TN'}
			<svg data-inline-src="TN.svg" />
		{:else if stateCode == 'TX'}
			<svg data-inline-src="TX.svg" />
		{:else if stateCode == 'UT'}
			<svg data-inline-src="UT.svg" />
		{:else if stateCode == 'VA'}
			<svg data-inline-src="VA.svg" />
		{:else if stateCode == 'VT'}
			<svg data-inline-src="VT.svg" />
		{:else if stateCode == 'WA'}
			<svg data-inline-src="WA.svg" />
		{:else if stateCode == 'WI'}
			<svg data-inline-src="WI.svg" />
		{:else if stateCode == 'WV'}
			<svg data-inline-src="WV.svg" />
		{:else if stateCode == 'WY'}
			<svg data-inline-src="WY.svg" />
		{/if}
	{:else if country == 'Canada'}
		<span style="font-size: 28px; position:relative; left: 15px;">🇨🇦</span>
		{#if stateCode == 'BC'}
			<svg data-inline-src="CA-BC.svg" />
		{:else if stateCode == 'PE'}
			<svg data-inline-src="CA-PE.svg" />
		{/if}
	{/if}
</span>
