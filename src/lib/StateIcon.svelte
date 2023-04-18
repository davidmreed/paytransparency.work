<script lang="ts">
	import { inlineSvg } from '@svelte-put/inline-svg';
	import type { Locale } from './data';

	export let locale: Locale;
	const svgPath = `/svgs/${locale.stateCode}.svg`;
</script>

<!-- We use this repetitive logic because our SVG-inlining package will not process dynamic SVG paths -->
<!-- This ensures that paths are static at build time. -->

{#if stateCode == 'AK'}
<svg use:inlineSvg={"/svgs/AK.svg"} />
{:else if stateCode == 'AL'}
<svg use:inlineSvg={"/svgs/AL.svg"} />
{:else if stateCode == 'AR'}
<svg use:inlineSvg={"/svgs/AR.svg"} />
{:else if stateCode == 'AZ'}
<svg use:inlineSvg={"/svgs/AZ.svg"} />
{:else if stateCode == 'CA'}
<svg use:inlineSvg={"/svgs/CA.svg"} />
{:else if stateCode == 'CO'}
<svg use:inlineSvg={"/svgs/CO.svg"} />
{:else if stateCode == 'CT'}
<svg use:inlineSvg={"/svgs/CT.svg"} />
{:else if stateCode == 'DC'}
<svg use:inlineSvg={"/svgs/DC.svg"} />
{:else if stateCode == 'DE'}
<svg use:inlineSvg={"/svgs/DE.svg"} />
{:else if stateCode == 'FL'}
<svg use:inlineSvg={"/svgs/FL.svg"} />
{:else if stateCode == 'GA'}
<svg use:inlineSvg={"/svgs/GA.svg"} />
{:else if stateCode == 'HI'}
<svg use:inlineSvg={"/svgs/HI.svg"} />
{:else if stateCode == 'IA'}
<svg use:inlineSvg={"/svgs/IA.svg"} />
{:else if stateCode == 'ID'}
<svg use:inlineSvg={"/svgs/ID.svg"} />
{:else if stateCode == 'IL'}
<svg use:inlineSvg={"/svgs/IN.svg"} />
{:else if stateCode == 'KS'}
<svg use:inlineSvg={"/svgs/KS.svg"} />
{:else if stateCode == 'KY'}
<svg use:inlineSvg={"/svgs/KY.svg"} />
{:else if stateCode == 'LA'}
<svg use:inlineSvg={"/svgs/LA.svg"} />
{:else if stateCode == 'MA'}
<svg use:inlineSvg={"/svgs/MA.svg"} />
{:else if stateCode == 'MD'}
<svg use:inlineSvg={"/svgs/MD.svg"} />
{:else if stateCode == 'ME'}
<svg use:inlineSvg={"/svgs/ME.svg"} />
{:else if stateCode == 'MI'}
<svg use:inlineSvg={"/svgs/MI.svg"} />
{:else if stateCode == 'MN'}
<svg use:inlineSvg={"/svgs/MN.svg"} />
{:else if stateCode == 'MO'}
<svg use:inlineSvg={"/svgs/MO.svg"} />
{:else if stateCode == 'MS'}
<svg use:inlineSvg={"/svgs/MS.svg"} />
{:else if stateCode == 'MT'}
<svg use:inlineSvg={"/svgs/MT.svg"} />
{:else if stateCode == 'NC'}
<svg use:inlineSvg={"/svgs/NC.svg"} />
{:else if stateCode == 'ND'}
<svg use:inlineSvg={"/svgs/ND.svg"} />
{:else if stateCode == 'NE'}
<svg use:inlineSvg={"/svgs/NE.svg"} />
{:else if stateCode == 'NH'}
<svg use:inlineSvg={"/svgs/NH.svg"} />
{:else if stateCode == 'NJ'}
<svg use:inlineSvg={"/svgs/NJ.svg"} />
{:else if stateCode == 'NM'}
<svg use:inlineSvg={"/svgs/NM.svg"} />
{:else if stateCode == 'NV'}
<svg use:inlineSvg={"/svgs/NV.svg"} />
{:else if stateCode == 'NY'}
<svg use:inlineSvg={"/svgs/NY.svg"} />
{:else if stateCode == 'OH'}
<svg use:inlineSvg={"/svgs/OH.svg"} />
{:else if stateCode == 'OK'}
<svg use:inlineSvg={"/svgs/OK.svg"} />
{:else if stateCode == 'OR'}
<svg use:inlineSvg={"/svgs/OR.svg"} />
{:else if stateCode == 'PA'}
<svg use:inlineSvg={"/svgs/PA.svg"} />
{:else if stateCode == 'RI'}
<svg use:inlineSvg={"/svgs/RI.svg"} />
{:else if stateCode == 'SC'}
<svg use:inlineSvg={"/svgs/SC.svg"} />
{:else if stateCode == 'SD'}
<svg use:inlineSvg={"/svgs/SD.svg"} />
{:else if stateCode == 'TN'}
<svg use:inlineSvg={"/svgs/TN.svg"} />
{:else if stateCode == 'TX'}
<svg use:inlineSvg={"/svgs/TX.svg"} />
{:else if stateCode == 'UT'}
<svg use:inlineSvg={"/svgs/UT.svg"} />
{:else if stateCode == 'VA'}
<svg use:inlineSvg={"/svgs/VA.svg"} />
{:else if stateCode == 'VT'}
<svg use:inlineSvg={"/svgs/VT.svg"} />
{:else if stateCode == 'WA'}
<svg use:inlineSvg={"/svgs/WA.svg"} />
{:else if stateCode == 'WI'}
<svg use:inlineSvg={"/svgs/WI.svg"} />
{:else if stateCode == 'WV'}
<svg use:inlineSvg={"/svgs/WV.svg"} />
{:else if stateCode == 'WY'}
<svg use:inlineSvg={"/svgs/WY.svg"} />
{:else}
{/if}