<script lang="ts">
	import { inlineSvg } from '@svelte-put/inline-svg/preprocess';
	import type { Locale } from './data';

	export let locale: Locale;
	const svgPath = `/svgs/${locale.stateCode}.svg`;
	const stateCode = locale.stateCode;
</script>

<!-- We use this repetitive logic because our SVG-inlining package will not process dynamic SVG paths -->
<!-- This ensures that paths are static at build time. -->

{#if stateCode == 'AK'}
<svg inline-src={"/svgs/AK.svg"} />
{:else if stateCode == 'AL'}
<svg inline-src={"/svgs/AL.svg"} />
{:else if stateCode == 'AR'}
<svg inline-src={"/svgs/AR.svg"} />
{:else if stateCode == 'AZ'}
<svg inline-src={"/svgs/AZ.svg"} />
{:else if stateCode == 'CA'}
<svg inline-src={"/svgs/CA.svg"} />
{:else if stateCode == 'CO'}
<svg inline-src={"/svgs/CO.svg"} />
{:else if stateCode == 'CT'}
<svg inline-src={"/svgs/CT.svg"} />
{:else if stateCode == 'DC'}
<svg inline-src={"/svgs/DC.svg"} />
{:else if stateCode == 'DE'}
<svg inline-src={"/svgs/DE.svg"} />
{:else if stateCode == 'FL'}
<svg inline-src={"/svgs/FL.svg"} />
{:else if stateCode == 'GA'}
<svg inline-src={"/svgs/GA.svg"} />
{:else if stateCode == 'HI'}
<svg inline-src={"/svgs/HI.svg"} />
{:else if stateCode == 'IA'}
<svg inline-src={"/svgs/IA.svg"} />
{:else if stateCode == 'ID'}
<svg inline-src={"/svgs/ID.svg"} />
{:else if stateCode == 'IL'}
<svg inline-src={"/svgs/IN.svg"} />
{:else if stateCode == 'KS'}
<svg inline-src={"/svgs/KS.svg"} />
{:else if stateCode == 'KY'}
<svg inline-src={"/svgs/KY.svg"} />
{:else if stateCode == 'LA'}
<svg inline-src={"/svgs/LA.svg"} />
{:else if stateCode == 'MA'}
<svg inline-src={"/svgs/MA.svg"} />
{:else if stateCode == 'MD'}
<svg inline-src={"/svgs/MD.svg"} />
{:else if stateCode == 'ME'}
<svg inline-src={"/svgs/ME.svg"} />
{:else if stateCode == 'MI'}
<svg inline-src={"/svgs/MI.svg"} />
{:else if stateCode == 'MN'}
<svg inline-src={"/svgs/MN.svg"} />
{:else if stateCode == 'MO'}
<svg inline-src={"/svgs/MO.svg"} />
{:else if stateCode == 'MS'}
<svg inline-src={"/svgs/MS.svg"} />
{:else if stateCode == 'MT'}
<svg inline-src={"/svgs/MT.svg"} />
{:else if stateCode == 'NC'}
<svg inline-src={"/svgs/NC.svg"} />
{:else if stateCode == 'ND'}
<svg inline-src={"/svgs/ND.svg"} />
{:else if stateCode == 'NE'}
<svg inline-src={"/svgs/NE.svg"} />
{:else if stateCode == 'NH'}
<svg inline-src={"/svgs/NH.svg"} />
{:else if stateCode == 'NJ'}
<svg inline-src={"/svgs/NJ.svg"} />
{:else if stateCode == 'NM'}
<svg inline-src={"/svgs/NM.svg"} />
{:else if stateCode == 'NV'}
<svg inline-src={"/svgs/NV.svg"} />
{:else if stateCode == 'NY'}
<svg inline-src={"/svgs/NY.svg"} />
{:else if stateCode == 'OH'}
<svg inline-src={"/svgs/OH.svg"} />
{:else if stateCode == 'OK'}
<svg inline-src={"/svgs/OK.svg"} />
{:else if stateCode == 'OR'}
<svg inline-src={"/svgs/OR.svg"} />
{:else if stateCode == 'PA'}
<svg inline-src={"/svgs/PA.svg"} />
{:else if stateCode == 'RI'}
<svg inline-src={"/svgs/RI.svg"} />
{:else if stateCode == 'SC'}
<svg inline-src={"/svgs/SC.svg"} />
{:else if stateCode == 'SD'}
<svg inline-src={"/svgs/SD.svg"} />
{:else if stateCode == 'TN'}
<svg inline-src={"/svgs/TN.svg"} />
{:else if stateCode == 'TX'}
<svg inline-src={"/svgs/TX.svg"} />
{:else if stateCode == 'UT'}
<svg inline-src={"/svgs/UT.svg"} />
{:else if stateCode == 'VA'}
<svg inline-src={"/svgs/VA.svg"} />
{:else if stateCode == 'VT'}
<svg inline-src={"/svgs/VT.svg"} />
{:else if stateCode == 'WA'}
<svg inline-src={"/svgs/WA.svg"} />
{:else if stateCode == 'WI'}
<svg inline-src={"/svgs/WI.svg"} />
{:else if stateCode == 'WV'}
<svg inline-src={"/svgs/WV.svg"} />
{:else if stateCode == 'WY'}
<svg inline-src={"/svgs/WY.svg"} />
{/if}