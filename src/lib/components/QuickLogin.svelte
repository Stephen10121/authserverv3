<script lang="ts">
    import { ConfettiExplosion } from 'svelte-confetti-explosion';
    import { superForm } from "sveltekit-superforms/client";
	import { quickAuthSchema } from "$lib/schemas/schemas";
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
	import TinyLoading from "$lib/components/TinyLoading.svelte";

    export let quickForm: any;
    export let name: string | undefined = undefined;
    export let accessToken: string | undefined = undefined;
    export let website: string;
    export let key: string;
    export let loginStatus: "quickLogin" | "manualLogin" | "tfa";
    
    const { form, message, errors, enhance } = superForm(quickForm, { validators: quickAuthSchema });
    const redirectInstead = new URLSearchParams($page.url.search).get("type");

    $form.websiteId = website;
    $form.key = key;
    $form.type = redirectInstead;
    $form.accessToken = accessToken;

    let loading = false;

    $: {
        $page.status;
        message;
        loading = false;
    }

    $: if ($message === "tfa") {
        loginStatus = "tfa";
    }
</script>

<div class="buttons" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
    {#if name && accessToken}
        <form class="quickForm" method="POST" use:enhance action="?/auth">
            {#if $page.status===200 && $message==="success"}
                <div class="confetti">
                    <ConfettiExplosion />
                </div>
            {/if}
            {#if $errors.overall}
                <p class="error">{$errors.overall}</p>
            {/if}
            <input type="hidden" name="websiteId" value={$form.websiteId} />
            <input type="hidden" name="key" value={$form.key} />
            <input type="hidden" name="type" value={$form.type} />
            <input type="hidden" name="accessToken" value={$form.accessToken}>
            <button on:click={() => loading = true}>
                {#if loading}
                    <div class="tiny">
                        <TinyLoading />
                    </div>
                {:else}
                    {name}
                {/if}
            </button>
        </form>
    {/if}
    <button on:click={() => loginStatus="manualLogin"}>Login to a new account</button>
</div>

<style>
    @font-face {
      font-family: "George-Italic";
      src: url(/fonts/Louis-George-Cafe-Italic.ttf);
    }

    .quickForm {
        width: 100%;
    }

    .buttons {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 20px;
        gap: 20px;
    }

    .tiny {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .error {
        color: #ff0000;
    }

    button {
        width: 100%;
        height: 40px;
        background-color: #86ff86;
        border: none;
        border-radius: 5px;
        font-family: "George-Italic", sans-serif;
        font-size: 1rem;
        cursor: pointer;
    }

    button:hover {
        outline: 2px solid #86ff86;
    }

    p {
        font-family: sans-serif;
        color: #000000;
        font-size: 0.9rem;
        margin-top: 20px;
    }

    .confetti {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }
</style>