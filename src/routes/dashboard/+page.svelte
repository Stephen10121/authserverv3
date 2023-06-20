<script lang="ts">
	import Name from "$lib/components/Name.svelte";
	import Notification from "$lib/components/Notification.svelte";
	import Stats from "$lib/components/Stats.svelte";
	import { onDestroy } from "svelte";
	import { notification } from "../../stores/notification.js";
	export let data;
	
	let setNotification: null | {type: "error" | "success", message: string} = null;
	const notificationUnsubscribe = notification.subscribe((data) => setNotification = data);

	onDestroy(() => {
		notificationUnsubscribe();
	});
</script>

{#if setNotification}
	<Notification type={setNotification.type} message={setNotification.message} />
{/if}
<section>
	<div class="one">
		<Name name={data.info.userData.user} token={data.accessToken} />
	</div>
	<div class="two">
		<Stats attempted={data.info.attemptedLogins} failed={data.info.failedLogins} subscriptions={data.info.sites.length} popular={data.info.mostPopular} />
	</div>
	<div class="three">
		<!-- <Name name={data.info.userData.user} /> -->
	</div>
	<div class="four">
		<!-- <Name name={data.info.userData.user} /> -->
	</div>
</section>

<style>
	section {
		width: 100%;
		padding: 20px;
		display: grid;
		column-gap: 10px;
		row-gap: 10px;
		grid-template-areas: 'one two two two two' 'three three three four four';
	}

	.one {
		grid-area: one;
	}

	.two {
		grid-area: two;
	}
	.three {
		grid-area: three;
	}
	.four {
		grid-area: four;
	}
</style>