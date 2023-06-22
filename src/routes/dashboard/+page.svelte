<script lang="ts">
	import Name from "$lib/components/Name.svelte";
	import Notification from "$lib/components/Notification.svelte";
	import Stats from "$lib/components/Stats.svelte";
	import { onDestroy } from "svelte";
	import { notification } from "../../stores/notification.js";
	import Sites from "$lib/components/Sites.svelte";
	export let data;
	console.log(data);
	
	let setNotification: null | {type: "error" | "success", message: string} = null;
	const notificationUnsubscribe = notification.subscribe((data) => setNotification = data);

	onDestroy(() => {
		notificationUnsubscribe();
	});
</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

{#if setNotification}
	<Notification type={setNotification.type} message={setNotification.message} />
{/if}
<section>
	<Name name={data.info.userData.user} token={data.accessToken} />
	<Stats attempted={data.info.attemptedLogins} failed={data.info.failedLogins} subscriptions={data.info.sites.length} popular={data.info.mostPopular.name} popularId={data.info.mostPopular.id} />
	<Sites sites={data.info.sites} />
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