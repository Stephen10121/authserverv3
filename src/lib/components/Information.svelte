<script lang="ts">
    import { fly } from 'svelte/transition';
</script>

<section transition:fly="{{ x: 200, duration: 200 }}">
    <p><slot /></p>
    <button on:click title="Close Popup">&#10005;</button>
</section>

<style>
    section {
        position: relative;
        height: 50px;
        background-color: var(--nuetral-color);
        min-width: 150px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        box-shadow: var(--shadow);
        overflow: hidden;
        gap: 10px;
    }

    p {
        font-family: "Poppins", sans-serif;
        font-weight: 600;
        color: var(--nuetral-text-color);
    }

    button {
        border: none;
        background: none;
        font-family: "Poppins", sans-serif;
        font-weight: 600;
        font-size: 1.15rem;
        color: var(--nuetral-text-color);
        cursor: pointer;
        transition: opacity 0.1s linear;
    }

    button:hover {
        opacity: 0.8;
    }

    @keyframes bigg {
        0% {
            width: 0%;
        }
        100% {
            width: 100%;
        }
    }
</style>