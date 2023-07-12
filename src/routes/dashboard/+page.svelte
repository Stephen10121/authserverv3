<script lang="ts">
	import Name from "$lib/components/Name.svelte";
	import Stats from "$lib/components/Stats.svelte";
	import { onMount } from "svelte";
	import Sites from "$lib/components/Sites.svelte";
	import osDetector from "$lib/functions/osDetector.js";
	export let data;

	onMount(() => {
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