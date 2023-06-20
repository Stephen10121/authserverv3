<script lang="ts">
	import ThemeSetter from "$lib/components/ThemeSetter.svelte";
	import { onDestroy } from "svelte";
	import { testTheme } from "../../stores/theme.js";
	import Hamburger from "$lib/components/Hamburger.svelte";
	import Selector from "$lib/components/Selector.svelte";
	import { page } from "$app/stores";

    export let data;
    
    testTheme.set(data.theme);
    let theme = "";
    const testThemeUnsubscribe = testTheme.subscribe(value => theme = value);

    let customThemes = [
        {id: "custom1", themeClass: "myCustomTheme"},
        {id: "custom2", themeClass: "myCustomTheme2"},
        {id: "nothing", themeClass: "nothing"},
        {id: "testerTheme", themeClass: "testerTheme"}
    ]

    let showSlideDown = false;

    $: {
        $page.url.pathname;
        showSlideDown = false;
    }

    async function setTheme() {
        fetch("/api/theme", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({"theme": theme})
        });
    }

    onDestroy(() => {
        testThemeUnsubscribe();
    });
</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<ThemeSetter {theme} {customThemes}>
    <header>
        <nav class="{showSlideDown ? "show" : ""}">
            <Selector bind:value={$testTheme} on:change={setTheme} title="Choose Theme">
                <option value="dark" selected={theme==="dark"}>Dark</option>
                <option value="light" selected={theme==="light"}>Light</option>
                <option value="custom1" selected={theme==="custom1"}>Custom 1</option>
                <option value="custom2" selected={theme==="custom2"}>Custom 2</option>
                <option value="nothing" selected={theme==="nothing"}>Nothing</option>
                <option value="system" selected={theme==="system"}>System</option>
                <option value="testerTheme" selected={theme==="testerTheme"}>Do it yourself</option>
            </Selector>
            <a href="/dashboard">Home</a>
            <a href="/dashboard/site">Sites</a>
            <a href="/dashboard/dev">Developer</a>
            <a href="/logout">Logout</a>
        </nav>
        <h1>Auth Dashboard</h1>
        <Hamburger colorVar="--nuetral-text-color" on:click={() => showSlideDown=!showSlideDown} active={showSlideDown} />
    </header>
    <main>
        <slot />
    </main>
</ThemeSetter>

<style>
    header {
        height: 70px;
        width: 100%;
        background-color: var(--nuetral-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        position: relative;
        isolation: isolate;
        z-index: 200;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }

    h1 {
        font-family: 'Poppins', sans-serif;
        font-size: 2rem;
        font-weight: 600;
        color: var(--nuetral-text-color);
    }

    main {
        height: calc(100% - 70px);
        width: 100%;
        z-index: -1;
        isolation: isolate;
    }

    nav {
        position: absolute;
        top: 100%;
        left: 0;
        width: 300px;
        height: calc(100vh - 70px);
        padding: 15px;
        display: flex;
        gap: 10px;
        flex-direction: column;
        /* height: 100px; */
        transform: translateX(-100%);
        background-color: var(--nuetral-color);
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px inset;
        transition: transform 0.15s linear, background-color 0.15s linear;
    }

    nav.show {
        transform: translateX(0);
    }

    nav a {
        width: 100%;
        height: 30px;
        background-color: var(--nuetral-text-color);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 10px;
        text-decoration: none;
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        color: var(--nuetral-color);
        transition: filter 0.1s linear;
    }

    nav a:hover {
        filter: brightness(0.8);
    }
</style>