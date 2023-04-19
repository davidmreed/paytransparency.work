<script lang="ts">
	import { inlineSvg } from '@svelte-put/inline-svg/preprocess';
	import type { Locale } from './data';

	export let locale: Locale;
	const svgPath = `${locale.stateCode}.svg`;
	const stateCode = locale.stateCode;
</script>

<!-- We use this repetitive logic because our SVG-inlining package will not process dynamic SVG paths -->
<!-- This ensures that paths are static at build time. -->

{#if stateCode == 'AK'}
<svg inline-src={"AK.svg"} />
{:else if stateCode == 'AL'}
<svg inline-src={"AL.svg"} />
{:else if stateCode == 'AR'}
<svg inline-src={"AR.svg"} />
{:else if stateCode == 'AZ'}
<svg inline-src={"AZ.svg"} />
{:else if stateCode == 'CA'}
<svg inline-src={"CA.svg"} />
{:else if stateCode == 'CO'}
<svg inline-src={"CO.svg"} />
{:else if stateCode == 'CT'}
<svg inline-src={"CT.svg"} />
{:else if stateCode == 'DC'}
<svg inline-src={"DC.svg"} />
{:else if stateCode == 'DE'}
<svg inline-src={"DE.svg"} />
{:else if stateCode == 'FL'}
<svg inline-src={"FL.svg"} />
{:else if stateCode == 'GA'}
<svg inline-src={"GA.svg"} />
{:else if stateCode == 'HI'}
<svg inline-src={"HI.svg"} />
{:else if stateCode == 'IA'}
<svg inline-src={"IA.svg"} />
{:else if stateCode == 'ID'}
<svg inline-src={"ID.svg"} />
{:else if stateCode == 'IL'}
<svg inline-src={"IN.svg"} />
{:else if stateCode == 'KS'}
<svg inline-src={"KS.svg"} />
{:else if stateCode == 'KY'}
<svg inline-src={"KY.svg"} />
{:else if stateCode == 'LA'}
<svg inline-src={"LA.svg"} />
{:else if stateCode == 'MA'}
<svg inline-src={"MA.svg"} />
{:else if stateCode == 'MD'}
<svg inline-src={"MD.svg"} />
{:else if stateCode == 'ME'}
<svg inline-src={"ME.svg"} />
{:else if stateCode == 'MI'}
<svg inline-src={"MI.svg"} />
{:else if stateCode == 'MN'}
<svg inline-src={"MN.svg"} />
{:else if stateCode == 'MO'}
<svg inline-src={"MO.svg"} />
{:else if stateCode == 'MS'}
<svg inline-src={"MS.svg"} />
{:else if stateCode == 'MT'}
<svg inline-src={"MT.svg"} />
{:else if stateCode == 'NC'}
<svg inline-src={"NC.svg"} />
{:else if stateCode == 'ND'}
<svg inline-src={"ND.svg"} />
{:else if stateCode == 'NE'}
<svg inline-src={"NE.svg"} />
{:else if stateCode == 'NH'}
<svg inline-src={"NH.svg"} />
{:else if stateCode == 'NJ'}
<svg inline-src={"NJ.svg"} />
{:else if stateCode == 'NM'}
<svg inline-src={"NM.svg"} />
{:else if stateCode == 'NV'}
<svg inline-src={"NV.svg"} />
{:else if stateCode == 'NY'}
<svg inline-src={"NY.svg"} />
{:else if stateCode == 'OH'}
<svg inline-src={"OH.svg"} />
{:else if stateCode == 'OK'}
<svg inline-src={"OK.svg"} />
{:else if stateCode == 'OR'}
<svg inline-src={"OR.svg"} />
{:else if stateCode == 'PA'}
<svg inline-src={"PA.svg"} />
{:else if stateCode == 'RI'}
<svg inline-src={"RI.svg"} />
{:else if stateCode == 'SC'}
<svg inline-src={"SC.svg"} />
{:else if stateCode == 'SD'}
<svg inline-src={"SD.svg"} />
{:else if stateCode == 'TN'}
<svg inline-src={"TN.svg"} />
{:else if stateCode == 'TX'}
<svg inline-src={"TX.svg"} />
{:else if stateCode == 'UT'}
<svg inline-src={"UT.svg"} />
{:else if stateCode == 'VA'}
<svg inline-src={"VA.svg"} />
{:else if stateCode == 'VT'}
<svg inline-src={"VT.svg"} />
{:else if stateCode == 'WA'}
<svg inline-src={"WA.svg"} />
{:else if stateCode == 'WI'}
<svg inline-src={"WI.svg"} />
{:else if stateCode == 'WV'}
<svg inline-src={"WV.svg"} />
{:else if stateCode == 'WY'}
<svg inline-src={"WY.svg"} />
{/if}