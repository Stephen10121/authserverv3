<script lang="ts">
    import LoginInput from "../../lib/components/LoginInput.svelte";
    import { ConfettiExplosion } from 'svelte-confetti-explosion';
    import { superForm } from "sveltekit-superforms/client";
	import { signupSchema } from "$lib/schemas/schemas";
    import tag from "../../assets/tag.svg";
    import shieldCheck from "../../assets/shieldCheck.svg";
    import mailbox from "../../assets/mailbox.svg";
    import badge from "../../assets/badge.svg";
    import shield from "../../assets/shield.svg";
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
	import TinyLoading from "$lib/components/TinyLoading.svelte";
	import CheckBox from "$lib/components/CheckBox.svelte";
	import Add2fa from "$lib/components/Add2fa.svelte";

    export let data;

    const { form, errors, enhance, message } = superForm(data.form, {
        validators: signupSchema
    });

    let loading = false;

    $: {
        $page.status;
        $message;
        loading = false;
    }

    let pageStatus: "signup" | "tfa" = "signup";

    $: if ($message === "tfa") pageStatus = "tfa";
</script>

<svelte:head>
    <title>Signup</title>
</svelte:head>

<main>
    <section>
        {#if pageStatus==="tfa"}
            <Add2fa signingUp redirect={data.redirect}/>
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
                <LoginInput name="name" placeholder="Name" icon={tag} bind:value={$form.name} bind:error={$errors.name}  />
                <LoginInput name="email" placeholder="Email" icon={mailbox} type="email" bind:value={$form.email} bind:error={$errors.email}  />
                <LoginInput name="username" placeholder="Username" icon={badge} bind:value={$form.username} bind:error={$errors.username}  />
                <LoginInput name="password" placeholder="Password" icon={shield} type="password" bind:value={$form.password} bind:error={$errors.password} />
                <LoginInput name="passwordRepeat" placeholder="Repeat Password" icon={shieldCheck} type="password" bind:value={$form.passwordRepeat} bind:error={$errors.passwordRepeat} />
                <label class="usetfa" for="usetfa">
                    <p>Allow 2 factor authentication.</p>
                    <CheckBox name="tfa" id="usetfa" bind:checked={$form.tfa} />
                </label>
                <button class="more-border" on:click={() => loading=true}>
                    {#if loading}
                        <div class="tiny">
                            <TinyLoading />
                        </div>
                    {:else if $form.tfa}
                        Next
                    {:else}
                        Signup
                    {/if}
                </button>
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
        overflow: hidden;
    }

    section {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        overflow: hidden;
        box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
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

    .more-border {
        border-radius: 100vh;
    }

    .usetfa {
        display: flex;
        width: 100%;
        min-height: 40px;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #808080;
        border-radius: 5px;
        padding: 0 10px;
    }

    .usetfa p {
        font-family: "George-Italic", sans-serif;
        font-size: 1rem;
        margin-top: 0;
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