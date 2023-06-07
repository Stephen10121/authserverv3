<script lang="ts">
    import LoginInput from "../../lib/components/LoginInput.svelte";
    import { ConfettiExplosion } from 'svelte-confetti-explosion';
    import { superForm } from "sveltekit-superforms/client";
	import { loginSchema } from "$lib/schemas/schemas";
    import person from "../../assets/person.svg";
    import shield from "../../assets/shield.svg";
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';

    export let data;
    const { form, errors, enhance, message } = superForm(data.form, {
        validators: loginSchema
    });

    let loginStatus: "quickLogin" | "manualLogin" | "tfa" = "quickLogin";

    // $: if (loginStatus !== "manualLogin") $message = undefined;

    $: if ($message === "tfa") loginStatus = "tfa";
</script>

<svelte:head>
    <title>Authenticate</title>
</svelte:head>

<main>
    <section>
        {#if loginStatus==="quickLogin"}
            <div class="buttons" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
                <button>Stephen</button>
                <button on:click={() => loginStatus="manualLogin"}>Login to a new account</button>
            </div>
        {:else if loginStatus==="tfa"}
            <div class="tfa" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
                <h2>2 factor verification is enabled!</h2>
            </div>
        {:else}
            <form method="POST" use:enhance class="form" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
                {#if $page.status===200 && $message==="success"}
                    <div class="confetti">
                        <ConfettiExplosion />
                    </div>
                {/if}
                {#if $errors.overall}
                    <p class="error">{$errors.overall}</p>
                {/if}
                <LoginInput name="username" placeholder="Username" icon={person} bind:value={$form.username} bind:error={$errors.username}  />
                <LoginInput name="password" placeholder="Password" icon={shield} type="password" bind:value={$form.password} bind:error={$errors.password} />
                <button class="more-border">Login</button>
                <button class="more-border" type="button" on:click={() => loginStatus="quickLogin"}>Login to existing account</button>
                <p>Don't have an account? <span><a href="/signup">Signup here!</a></span></p>
            </form>
        {/if}
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
    }

    section {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        overflow: hidden;
        box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
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

    .tfa {
        justify-content: flex-start;
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

    h2 {
        font-family: sans-serif;
        font-weight: bold;
        color: gray;
        font-size: 1.25rem;
    }

    @media (min-width: 700px) {
        section {
            width: 50%;
            height: 50%;
            max-width: 700px;
            border-radius: 10px;
        }
    }
</style>