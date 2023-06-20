<script lang="ts">
    import window from "../../assets/site.svg";
    import unblacklisted from "../../assets/shield-x.svg";
    import blacklisted2 from "../../assets/shieldCheck.svg";

    export let blacklisted = false;
    export let name: string;
    export let link: string;
</script>

<div class="site {blacklisted ? "blacklist" : ""}">
    <div>
        <img class="window" src={window} alt="Website window">
        <a href={link}>{name}</a>
    </div>
    <div>
        {#if blacklisted}
            <p class="blacklisted">Blacklisted</p>
        {/if}
        <button title="{blacklisted ? "Unb" : "B"}lacklist site.">
            <img src={blacklisted ? blacklisted2 : unblacklisted} alt="{blacklisted ? "Un" : ""}blacklist site.">
        </button>
    </div>
</div>

<style>
    .site {
        margin: 0;
        box-sizing: border-box;
        text-decoration: none;
        list-style: none;
        transition: color 0.25s linear, background-color 0.25s linear;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: rgb(119, 166, 194);
        border-radius: 5px;
        padding: 5px;
        position: relative;
    }

    .site div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 100%;
    }

    .window {
        height: 70%;
        user-drag: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .site.blacklist {
        outline: 2px solid red;
    }

    .blacklisted {
        color: red;
        font-size: 1rem;
        font-family: "Roboto", sans-serif;
        font-weight: bold;
    }
    
    a {
        font-family: "Poppins", sans-serif;
        font-size: 1rem;
        text-decoration: underline;
        color: black;
    }

    button {
        height: 100%;
        cursor: pointer;
        background: none;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        transition: filter 0.1s linear;
    }

    button:hover {
        filter: invert(0.5);
    }

    button img {
        height:  80%;
        user-drag: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>