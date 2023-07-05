<script lang="ts">
	import blacklistapiclient from '$lib/functions/blacklistapiclient';
    export let blacklist: string;
    export let token: string;
    export let name: string;

    async function blacklister() {
        await blacklistapiclient(blacklist, name, token);
    }
</script>

<p id="logins">This site is {blacklist === "true" ? "" : "not"} blacklisted.</p>
<button on:click={blacklister}>{blacklist === "true" ? "Unb" : "B"}lacklist</button>

<style>
    p {
        font-family: "Poppins", sans-serif;
        /* font-size: 2rem; */
        font-weight: bold;
        color: var(--nuetral-text-color);
        font-size: clamp(1rem, -1.5rem + 8vw, 2rem);
    }
</style>