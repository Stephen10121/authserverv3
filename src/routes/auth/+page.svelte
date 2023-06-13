<script lang="ts">
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
	import Spinner from "$lib/components/Spinner.svelte";
	import { startAuthentication } from "@simplewebauthn/browser";
	import { goto } from "$app/navigation";
	import QuickLogin from "$lib/components/QuickLogin.svelte";
	import Login from "$lib/components/Login.svelte";

    export let data;
    
    const redirectInstead = new URLSearchParams($page.url.search).get("type");

    $: {
        if (loginStatus==='tfa') {
            tfaSend();
        }
    }

    let loginStatus: "quickLogin" | "manualLogin" | "tfa" = "quickLogin";
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
                website: data.website,
                type: redirectInstead
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

        if (verificationJSON.redirect) {
            const redirectData: {
                data: string,
                key: string,
                name: string,
                email: string,
                username: string,
                where: string
            } = verificationJSON.redirect;
            
            const newLocation = new URL(redirectData.where);
            newLocation.searchParams.append("data", redirectData.data);
            newLocation.searchParams.append("key", redirectData.key);
            newLocation.searchParams.append("name", redirectData.name);
            newLocation.searchParams.append("email", redirectData.email);
            newLocation.searchParams.append("username", redirectData.username);
            window.location.href=newLocation.href;
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
            <QuickLogin bind:loginStatus quickForm={data.quickForm} name={data.name} accessToken={data.accessToken} website={data.website} key={data.key} />
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
            <Login bind:loginStatus manualForm={data.form} website={data.website} key={data.key} />
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