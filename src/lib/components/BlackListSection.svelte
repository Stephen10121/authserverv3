<script lang="ts">
    import { invalidateAll } from '$app/navigation';
	import blacklistapiclient from '$lib/functions/blacklistapiclient';
	import { notification } from '../../stores/notification';
    export let blacklist: string;
    export let token: string;
    export let name: string;

    async function blacklister() {
        const data = await blacklistapiclient(blacklist, name, token);
        console.log(data);
        notification.update((notify) => {
            notify.push({
                type: data.error ? "error" : "success",
                message: data.message
            });
            return notify
        });
        invalidateAll();
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