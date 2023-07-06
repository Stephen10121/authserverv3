<script lang="ts">
	import blacklistapiclient from '$lib/functions/blacklistapiclient';
    import unblacklisted from "../../assets/shield-x.svg";
    import blacklisted2 from "../../assets/shieldCheck.svg";
	import ExtraInfo from './ExtraInfo.svelte';

    export let blacklist: string;
    export let token: string;
    export let name: string;

    async function blacklister() {
        await blacklistapiclient(blacklist, name, token);
    }
</script>

<ExtraInfo>By blacklisting this site, you are not allowing your account to login to their service.</ExtraInfo>
<p id="logins">This site is {blacklist === "true" ? "" : "not"} blacklisted.</p>
<button title="{blacklist ? "B" : "Unb"}lacklist site." on:click={blacklister}>
    <img src={blacklist ? unblacklisted : blacklisted2} alt="{blacklist ? "" : "Un"}blacklist site.">
</button>

<style>
    p {
        font-family: "Poppins", sans-serif;
        /* font-size: 2rem; */
        font-weight: bold;
        color: var(--nuetral-text-color);
        font-size: clamp(1rem, -1.5rem + 8vw, 1.5rem);
        margin-top: 20px;
    }
    button {
        margin-top: 40px;
        height: 50px;
        cursor: pointer;
        background: none;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        transition: filter 0.1s linear;
    }

    button:hover {
        opacity: 0.8;
    }

    button img {
        height:  80%;
        user-drag: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        /* filter: invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%); */
        /* filter: invert(19%) sepia(96%) saturate(5069%) hue-rotate(355deg) brightness(98%) contrast(123%); Red Color */
    }
</style>