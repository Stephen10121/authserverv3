<script lang="ts">
    import { page } from '$app/stores';
</script>

<section>
    <h1>{$page.status} | {$page.error?.message}</h1>
</section>

<style>
    section {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
</style>