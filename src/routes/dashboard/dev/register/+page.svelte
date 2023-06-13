<script lang="ts">
	import { page } from '$app/stores';
	import TinyLoading from '$lib/components/TinyLoading.svelte';
	import { registerWebsite } from '$lib/schemas/schemas.js';
	import { ConfettiExplosion } from 'svelte-confetti-explosion';
	import { superForm } from 'sveltekit-superforms/client';
    import LoginInput from '$lib/components/LoginInput.svelte';
    import tfaname from "../../../../assets/tfaname.svg";

    export let data;
    let loading = false;

    $: {
        $page.status;
        message;
        loading = false;
    }
    
    const { message, errors, form, enhance } = superForm(data.form, { validators: registerWebsite });
</script>
<main>
    <section>
        <form class="quickForm" method="POST" use:enhance>
            {#if $page.status===200 && $message==="success"}
                <div class="confetti">
                    <ConfettiExplosion />
                </div>
            {/if}
            {#if $errors.overall}
                <p class="error">{$errors.overall}</p>
            {/if}
            <LoginInput name="name" placeholder="Website name" icon={tfaname} bind:value={$form.name} bind:error={$errors.name}  />
            <LoginInput name="url" placeholder="Website url (e.g., https://auth.gruzservices/com/myAuth.)" icon={tfaname} bind:value={$form.url} bind:error={$errors.url}  />
            <LoginInput name="unique" placeholder="Unique id" icon={tfaname} bind:value={$form.unique} bind:error={$errors.unique}  />
            <button on:click={() => loading = true}>
                {#if loading}
                    <div class="tiny">
                        <TinyLoading />
                    </div>
                {:else}
                    Register
                {/if}
            </button>
        </form>
    </section>
</main>

<style>
    @font-face {
      font-family: "George-Italic";
      src: url(/fonts/Louis-George-Cafe-Italic.ttf);
    }

    main {
        width: 100%;
        height: 100%;
        background-color: #dfdfdf;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    section {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        overflow: hidden;
        box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
    }

    .quickForm {
        width: 100%;
    }

    .form,
    .buttons,
    .tfa {
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

    .tfa {
        justify-content: space-between;
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

    .bordered {
        background: none;
        border: 1px solid #86ff86;
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

    h2 {
        font-family: sans-serif;
        font-weight: bold;
        color: gray;
        font-size: 1.25rem;
    }

    @media (min-width: 700px) {
        section {
            min-height: 450px;
            height: 70%;
            width: 70%;
            max-width: 700px;
            border-radius: 10px;
        }
    }
</style>