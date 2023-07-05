<script lang="ts">
    import { fly } from 'svelte/transition';
	import { onMount } from "svelte";
	import { notification } from "../../stores/notification";

    export let type: "error" | "success";
    export let message: string;
    
    onMount(() => {
        setTimeout(() => {
            notification.update((notifications) => {
                notifications.shift()
                return notifications
            });
        }, 5000);
    });
</script>

<section class="notification" transition:fly="{{ x: 200, duration: 200 }}">
    <p>{message}</p>
    <div class="timer">
        <div class="bigger {type==="error"?"red":"green"}"></div>
    </div>
</section>

<style>
    
    .notification {
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
        position: relative;
    }

    p {
        font-family: "Poppins", sans-serif;
        font-weight: 600;
        color: var(--nuetral-text-color);;
    }

    .timer {
        position: absolute;
        width: 100%;
        height: 5px;
        background-color: #dfdfdf;
        left: 0;
        bottom: 0;
    }

    .bigger {
        height: 100%;
        width: 100%;
        /* animation: bigg 5s linear forwards; */
    }

    @keyframes bigg {
        0% {
            width: 0%;
        }
        100% {
            width: 100%;
        }
    }

    .red {
        background-color: red;
    }

    .green {
        background-color: rgb(11, 231, 11);
    }
</style>