<script lang="ts">
	import Name from "$lib/components/Name.svelte";
	import Stats from "$lib/components/Stats.svelte";
	import { onMount } from "svelte";
	import Sites from "$lib/components/Sites.svelte";
	import osDetector from "$lib/functions/osDetector.js";
	export let data;

	onMount(() => {
		console.log(navigator.userAgentData)
		// Opera 8.0+
		var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

		// Firefox 1.0+
		var isFirefox = typeof InstallTrigger !== 'undefined';

		// Safari 3.0+ "[object HTMLElementConstructor]" 
		var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

		// Internet Explorer 6-11
		var isIE = /*@cc_on!@*/false || !!document.documentMode;

		// Edge 20+
		var isEdge = !isIE && !!window.StyleMedia;

		// Chrome 1 - 79
		var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

		// Edge (based on chromium) detection
		var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

		// Blink engine detection
		var isBlink = (isChrome || isOpera) && !!window.CSS;


		var output = {
			isFirefox,
			isChrome,
			isSafari,
			isOpera,
			isIE,
			isEdge,
			isEdgeChromium,
			isBlink
		}
		console.log(output)
		console.log(osDetector(navigator, window));
	});
</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<section>
	<Name name={data.info.userData.user} token={data.accessToken} />
	<Stats attempted={data.info.attemptedLogins} failed={data.info.failedLogins} subscriptions={data.info.sites.length} popular={data.info.mostPopular.name} popularId={data.info.mostPopular.id} />
	<Sites sites={data.info.sites} token={data.accessToken} />
</section>

<style>
	section {
		width: 100%;
		height: 100%;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
	}
</style>