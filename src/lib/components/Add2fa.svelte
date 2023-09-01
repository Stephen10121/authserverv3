<script lang="ts">
    import LoginInput from "../../lib/components/LoginInput.svelte";
    import tfaname from "../../assets/tfaname.svg";
    import { fade } from 'svelte/transition';
	import Spinner from "$lib/components/Spinner.svelte";
    import { startRegistration } from '@simplewebauthn/browser';
    import { goto } from '$app/navigation';
	import { createEventDispatcher } from "svelte";

    export let redirect: null | string = null;
    export let signingUp = false;
    
    const dispatch = createEventDispatcher();
    let currentlyRegistering = false;
    let tfaKeyName: string;
    let tfaKeyNameError: string;

    async function begintfamethod() {
        currentlyRegistering = true;
        tfaKeyNameError = "";
        if (!tfaKeyName || tfaKeyName===undefined || tfaKeyName ==="") {
            tfaKeyNameError = "Name the 2fa Method.";
            return;
        }

        // GET registration options from the endpoint that calls
        // @simplewebauthn/server -> generateRegistrationOptions()
        const resp = await fetch(`/api/getRegistrationOptions`);
        const respJSON = await resp.json();

        let attResp: any;
        try {
            // Pass the options to the authenticator and wait for a response
            attResp = await startRegistration(respJSON);
            attResp.keyName = tfaKeyName;
        } catch (error) {
            //@ts-ignore
            if (error.name === 'InvalidStateError') {
                tfaKeyNameError = 'Error: Authenticator was probably already registered by user';
            } else {
                tfaKeyNameError = "Cannot create key. Check console.";
            }

            throw error;
        }

        // POST the response to the endpoint that calls
        // @simplewebauthn/server -> verifyRegistrationResponse()
        const verificationResp = await fetch('/api/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(attResp),
        });

        // Wait for the results of verification
        const verificationJSON = await verificationResp.json();
        // Show UI appropriate for the `verified` status
        
        if (!!verificationJSON) {
            if (redirect) {
                goto(redirect);
                return
            }
            dispatch("success");
            tfaKeyNameError = 'Success!';
        } else {
            tfaKeyNameError = 'Oh no, something went wrong! Check console.';
            console.log(verificationJSON);
        }
    }

    async function cancel() {
        try {
            const cancelRequest = await fetch('/api/canceltfa', { method: "POST" });

            if (cancelRequest.status !== 200) {
                tfaKeyNameError = "An error occured. Please refresh.";
                return
            }

            const cancelRequestJSON = await cancelRequest.json();
            if (!cancelRequestJSON) {
                tfaKeyNameError = "An error occured. Please refresh.";
                return;
            }
        } catch (err) {
            console.error(err);
            tfaKeyNameError = "An error occured. Please refresh.";
            return;
        }
        if (redirect) {
            goto(redirect);
            return
        }
        dispatch("cancel");
    }
</script>

<div class="tfa" out:fade={{duration: 100}} in:fade={{delay: 100, duration: 100}}>
    <h2>Setup 2 factor verification!</h2>
    <div class="tfasetup">
        {#if currentlyRegistering}
            <Spinner />
        {:else}
            <LoginInput name="tfaname" placeholder="2fa Method Name (e.g., Macbook Fingerprint.)" icon={tfaname} bind:value={tfaKeyName} bind:error={tfaKeyNameError}  />
            <button class="more-border" on:click={begintfamethod}>Begin</button>
            {#if !currentlyRegistering}
                <button class="more-border" on:click={cancel}>Cancel {signingUp ? "and Signup" : ""}</button>
            {/if}
        {/if}
    </div>
    {#if currentlyRegistering}
        <button class="more-border" on:click={cancel}>Cancel {signingUp ? "and Signup" : ""}</button>
    {:else}
        <div />
    {/if}
</div>


<style>
    @font-face {
      font-family: "George-Italic";
      src: url(/fonts/Louis-George-Cafe-Italic.ttf);
    }

    .tfasetup {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

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
        justify-content: space-between;
    }

    .more-border {
        border-radius: 100vh;
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

    h2 {
        font-family: sans-serif;
        font-weight: bold;
        color: gray;
        font-size: 1.25rem;
    }
</style>