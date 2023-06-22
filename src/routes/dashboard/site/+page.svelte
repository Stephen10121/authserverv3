<script lang="ts">
	import SecureSubs from "$lib/components/SecureSubs.svelte";
import Sites from "$lib/components/Sites.svelte";
	export let data;
	console.log(data);
</script>

<svelte:head>
	<title>Sites</title>
	<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
</svelte:head>

<section>
	<Sites sites={data.info.sites} />
    <SecureSubs secureSubs={data.info.https} subscriptions={data.info.sites.length}/>
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
		/* column-gap: 10px;
		row-gap: 10px;
		grid-template-areas: 'one two two two two' 'three three three four four'; */
	}
</style>