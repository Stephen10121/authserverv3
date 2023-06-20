<script lang="ts">
	import Site from "./Site.svelte";
    export let sites: {
        site: string;
        blackList: string;
        name:string;
    }[];
</script>

<section>
    <p>Subscriptions</p>
    {#each sites as site}
        <Site name={site.name} link="/dashboard/site/{site.site}" blacklisted={site.blackList === "true"} />
    {/each}
</section>

<style>
    section {
        box-shadow: var(--shadow);
        /* min-height: 200px; */
        overflow-y: auto;
        max-height: 300px;
        max-width: 100%;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 25px 10px 10px 10px;
        position: relative;
    }

    p {
        font-family: "Roboto", sans-serif;
        font-size: 1rem;
        font-weight: bold;
        color: var(--nuetral-text-color);
        margin-top: 10px;
        margin-bottom: 10px;
        position: absolute;
        top: -5px;
        left: 5px;
    }
</style>