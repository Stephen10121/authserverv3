<script lang="ts">
	import { Temporal } from "@js-temporal/polyfill";
	import CalendarTile from "./CalendarTile.svelte";
    export let loginHistory: any;

    export let year: number;
    $: time = new Temporal.PlainDateTime(year, 1, 1);
</script>

<div class="weeks">
    {#each {length: 53} as _, t}
        <div class="week">
            {#each {length: 7} as _, h}
                <CalendarTile day={(t*7)+(h)} {time} {year} {loginHistory}/>
            {/each}
        </div>
    {/each}
</div>

<style>
    .weeks {
        display: flex;
        gap: 2px;
    }

    .week {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
</style>