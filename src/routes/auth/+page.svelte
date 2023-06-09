<script lang="ts">
    import LoginInput from "../../lib/components/LoginInput.svelte";
    import { ConfettiExplosion } from 'svelte-confetti-explosion';
    import { superForm } from "sveltekit-superforms/client";
	import { loginSchema, quickAuthSchema } from "$lib/schemas/schemas";
    import person from "../../assets/person.svg";
    import shield from "../../assets/shield.svg";
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
	import Spinner from "$lib/components/Spinner.svelte";
	import TinyLoading from "$lib/components/TinyLoading.svelte";
	import { onDestroy } from "svelte";
	import { startAuthentication } from "@simplewebauthn/browser";
	import { goto } from "$app/navigation";

    export let data;
    
    const loginForm = superForm(data.form, { validators: loginSchema });
    const quickAuthForm = superForm(data.quickForm, { validators: quickAuthSchema });

    let message: string;
    let errors: any;
    let form: any;
    
    let message2: string;
    let errors2: any;
    let form2: any;

    const loginFormMessageUnsubscribe = loginForm.message.subscribe((value) => message=value);
    const loginFormErrorsUnsubscribe = loginForm.errors.subscribe((value) => errors=value);
    const loginFormFormUnsubscribe = loginForm.form.subscribe((value) => form=value);

    const loginFormMessage2Unsubscribe = quickAuthForm.message.subscribe((value) => message2=value);
    const loginFormErrors2Unsubscribe = quickAuthForm.errors.subscribe((value) => errors2=value);
    const loginFormForm2Unsubscribe = quickAuthForm.form.subscribe((value) => form2=value);

    form.website = data.website;
    form.key = data.key;

    form2.website = data.website;
    form2.key = data.key;
    form2.accessToken = data.accessToken;

    let loading = false;
    let loading2 = false;

    $: {
        console.log({status: $page.status, message, message2})
        $page.status;
        message;
        message2;
        loading2 = false;
        loading = false;
    }

    let loginStatus: "quickLogin" | "manualLogin" | "tfa" = "quickLogin";

    $: if (message === "tfa" || message2 === "tfa") {
        loginStatus = "tfa";
        tfaSend();
    }

    onDestroy(() => {
        loginFormMessageUnsubscribe();
        loginFormErrorsUnsubscribe();
        loginFormFormUnsubscribe();
        loginFormMessage2Unsubscribe();
        loginFormErrors2Unsubscribe();
        loginFormForm2Unsubscribe();
    });

    let tfaerror = "";

    async function tfaSend() {
        const resp = await fetch('/api/getAuthenticationOptions');

        let asseResp;
        try {
            // Pass the options to the authenticator and wait for a response
            asseResp = await startAuthentication(await resp.json());
        } catch (error) {
            // Some basic error handling
            tfaerror = error as string;
            console.error(error);
        }

        // POST the response to the endpoint that calls
        // @simplewebauthn/server -> verifyAuthenticationResponse()
        const verificationResp = await fetch('/api/startAuthentication', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({asseResp, userData: {
                key: data.key,
                website: data.website
            }}),
        });

        // Wait for the results of verification
        let verificationJSON: any;
        try {
            verificationJSON = await verificationResp.json();
        } catch(_err) {
            console.log(await verificationResp.text());
        }

        if (!verificationJSON) {
            console.log("no verification response")
        }
        
        if (verificationJSON.blacklist) {
            tfaerror = "BlackListed";
            return;
        }

        if (verificationJSON.msg === "success") {
            window.close();
            goto("/");
        } else {
            tfaerror = 'Oh no, something went wrong! Check console.';
            console.log(verificationJSON);
        }
    }
</script>

<svelte:head>
    <title>Authenticate</title>
</svelte:head>

<main>
    <section>
        {#if loginStatus==="quickLogin"}
            <div class="buttons" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
                {#if data.name && data.accessToken}
                    <form class="quickForm" method="POST" use:quickAuthForm.enhance action="?/auth">
                        {#if $page.status===200 && message2==="success"}
                            <div class="confetti">
                                <ConfettiExplosion />
                            </div>
                        {/if}
                        {#if errors2.overall}
                            <p class="error">{errors2.overall}</p>
                        {/if}
                        <input type="hidden" name="website" value={form2.website} />
                        <input type="hidden" name="key" value={form2.key} />
                        <input type="hidden" name="accessToken" value={form2.accessToken}>
                        <button on:click={() => loading2 = true}>
                            {#if loading2}
                                <div class="tiny">
                                    <TinyLoading />
                                </div>
                            {:else}
                                {data.name}
                            {/if}
                        </button>
                    </form>
                {/if}
                <button on:click={() => loginStatus="manualLogin"}>Login to a new account</button>
            </div>
        {:else if loginStatus==="tfa"}
            <div class="tfa" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
                <h2>2 factor verification is enabled!</h2>
                {#if tfaerror}
                    <p>{tfaerror}</p>
                {/if}
                <Spinner />
                <button class="bordered">Not starting? Click here</button>
            </div>
        {:else}
            <form method="POST" action="?/login" use:loginForm.enhance class="form" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
                {#if $page.status===200 && message==="success"}
                    <div class="confetti">
                        <ConfettiExplosion />
                    </div>
                {/if}
                {#if errors.overall}
                    <p class="error">{errors.overall}</p>
                {/if}
                <input type="hidden" name="website" value={form.website} />
                <input type="hidden" name="key" value={form.key} />
                <LoginInput name="username" placeholder="Username" icon={person} bind:value={form.username} bind:error={errors.username}  />
                <LoginInput name="password" placeholder="Password" icon={shield} type="password" bind:value={form.password} bind:error={errors.password} />
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