<script lang="ts">
	import Site from "./Site.svelte";

</script>

<section>
    <p>Websites</p>
    <Site name='gruzauth' link="/"/>
    <Site name='gruzauth3' link="/"/>
</section>

<style>
    section {
        box-shadow: var(--shadow);
        min-height: 200px;
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