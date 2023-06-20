<script lang="ts">
    import changeName from "$lib/functions/changeName.js";
    import Prompt from "$lib/components/Prompt.svelte";
	import { notification } from "../../stores/notification";
	import { invalidateAll } from "$app/navigation";
    export let name: string;
    export let token: string;
    let nameChange = false;
</script>

{#if nameChange}
	<Prompt placeholder="New name" on:close={() => nameChange=false} on:submit={async ({ detail }) => {
		const changedName = await changeName(token, detail);
		if (changedName.success) {
			notification.set({type: "success", message: changedName.success});
            invalidateAll();
		}
		if (changedName.error) {
			notification.set({type: "error", message: changedName.error});
		}
		nameChange = false
	}}/>
{/if}
<section>
    <h3>Hello {name}</h3>
    <button on:click={() => nameChange=true}>Change</button>
</section>

<style>
    section {
        box-shadow: var(--shadow);
        min-height: 400px;
        max-width: 100%;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    h3 {
        font-family: "Roboto", sans-serif;
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--nuetral-text-color);
        margin-top: 10px;
        margin-bottom: 10px;
    }

    button {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background-color: rgb(119, 166, 194);
        border-radius: 100vh;
        cursor: pointer;
        font-size: 0.7rem;
        font-family: "Poppins", sans-serif;
        border: none;
        transition: filter 0.1s linear;
    }

    button:hover {
        filter: brightness(0.8);
    }
</style>