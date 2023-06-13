<script lang="ts">
    import { ConfettiExplosion } from 'svelte-confetti-explosion';
    import { superForm } from "sveltekit-superforms/client";
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
	import TinyLoading from "$lib/components/TinyLoading.svelte";
	import { loginSchema } from '$lib/schemas/schemas';
    import LoginInput from './LoginInput.svelte';
    import person from "../../assets/person.svg";
    import shield from "../../assets/shield.svg";

    export let manualForm: any;
    export let website: string;
    export let key: string;
    export let loginStatus: "quickLogin" | "manualLogin" | "tfa";
    
    const { form, message, errors, enhance } = superForm(manualForm, { validators: loginSchema });
    const redirectInstead = new URLSearchParams($page.url.search).get("type");

    $form.websiteId = website;
    $form.key = key;
    $form.type = redirectInstead;

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


<form method="POST" action="?/login" use:enhance class="form" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
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
    <LoginInput name="username" placeholder="Username" icon={person} bind:value={$form.username} bind:error={$errors.username}  />
    <LoginInput name="password" placeholder="Password" icon={shield} type="password" bind:value={$form.password} bind:error={$errors.password} />
    <button class="more-border" on:click={() => loading=true}>
        {#if loading}
            <div class="tiny">
                <TinyLoading />
            </div>
        {:else}
            Login
        {/if}
    </button>
    <button class="more-border" type="button" on:click={() => loginStatus="quickLogin"}>Login to existing account</button>
    <p>Don't have an account? <span><a href="/signup?redirect={encodeURIComponent($page.url.pathname+$page.url.search)}">Signup here!</a></span></p>
</form>

<style>
    @font-face {
      font-family: "George-Italic";
      src: url(/fonts/Louis-George-Cafe-Italic.ttf);
    }

    .form {
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

    .more-border {
        border-radius: 100vh;
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

    a {
        font-family: "George-Italic", sans-serif;
        color: #86ff86;
        font-weight: bold;
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