<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    
    export let question = "Are you sure?";
</script>

<section>
    <div class="box">
        <p>{question}</p>
        <div class="buttons">
            <button class="yes" on:click={() => dispatch("answer")}>&#x2713;</button>
            <button class="no" on:click={() => dispatch("close")}>✖</button>
        </div>
    </div>
</section>

<style>
    section {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        top: 0;
        padding: 0 5px;
        left: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .box {
        width: 100%;
        max-width: 800px;
        height: 60px;
        background-color: var(--nuetral-color);
        border-radius: 10px;
        display: flex;
        align-items: center;
        padding: 0 0 0 10px;
        gap: 10px;
        justify-content: space-between;
    }

    .buttons {
        display: flex;
    }

    .yes {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        text-decoration: none;
        list-style: none;
        width: 60px;
        height: 60px;
        border: none;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        font-size: 1rem;
        cursor: pointer;
        background-color: rgb(14, 228, 14);
        transition: background-color 0.25s linear;
    }

    .yes:hover {
        background-color: rgb(15, 204, 15);
    }

    .no {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        text-decoration: none;
        list-style: none;
        width: 60px;
        height: 60px;
        border: none;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        font-size: 1rem;
        cursor: pointer;
        background-color: rgb(245, 184, 184);
        transition: background-color 0.25s linear;
    }

    .no:hover {
        background-color: rgb(240, 133, 133);
    }

    input {
        width: 100%;
        height: 40px;
        border: 1px solid var(--nuetral-text-color);
        border-radius: 5px;
        font-family: "Roboto", sans-serif;
        padding: 0 5px;
        background-color: var(--nuetral-color);
        color: var(--nuetral-text-color);
    }

    input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: var(--nuetral-text-color);
        opacity: 1; /* Firefox */
    }

    input:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: var(--nuetral-text-color);
    }

    input::-ms-input-placeholder { /* Microsoft Edge */
        color: var(--nuetral-text-color);
    }
</style>