<script lang="ts">
	import { info, notification } from "../../stores/notification";
	import Information from "./Information.svelte";
	import NotificationTile from './NotificationTile.svelte';
</script>

<section class="notifications">
    {#each $notification as notifiy}
        <NotificationTile message={notifiy.message} type={notifiy.type} />
    {/each}
    {#each $info as infoTile}
        <Information on:click={() => {
            info.update((infos) => {
                return infos.filter((infos2) => infos2.id !== infoTile.id);
            });
        }}>{@html infoTile.data}</Information>
    {/each}
</section>

<style>
    .notifications {
        position: fixed;
        bottom: 10px;
        right: 10px;
        display: flex;
        gap: 10px;
        flex-direction: column;
        align-items: flex-end;
    }
</style>