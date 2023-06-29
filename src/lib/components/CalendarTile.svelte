<script lang="ts">
	import type { Temporal } from "@js-temporal/polyfill";

    export let time: Temporal.PlainDateTime;
    export let day: number;
    export let year: number;
    export let loginHistory: any;

    $: time2 = time.add({days: day});

    $: logins = loginHistory[`year${time2.year}`] ? loginHistory[`year${time2.year}`][`month${time2.month}`] ? loginHistory[`year${time2.year}`][`month${time2.month}`][`day${time2.day}`] ? loginHistory[`year${time2.year}`][`month${time2.month}`][`day${time2.day}`] : 0 : 0 : 0
</script>

<div class="tile {logins? "blue" : ""} {time2.year !== year ? "hide" : ""}">
    <div class="extra">
        <p>
            {#if logins}
                <span>{logins}</span>
            {:else}
                No
            {/if}
            login{logins!==1?"s ":" "}on
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][time2.dayOfWeek-1]},
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][time2.month-1]}
            {time2.day},
            {time2.year}
        </p>
    </div>
</div>

<style>
    .tile {
        border-radius: 2px;
        width: 11px;
        height: 11px;
        background-color: var(--secondary-color);
        position: relative;
    }

    .tile.blue {
        background-color: var(--accent-color);
    }

    .extra {
        opacity: 0;
        pointer-events: none;
        padding: 10px;
        left: 50%;
        top: 0;
        transform: translate(-50%, calc(-100% - 10px));
        position: absolute;
        background-color: var(--base-color);
        border: 1px solid #000000;
        border-radius: 10px;
        z-index: 500;
        transition: opacity 0.1s linear;
        white-space: nowrap;
    }

    .extra p {
        font-family: "Roboto", sans-serif;
    }

    .extra p span {
        font-family: "Poppins", sans-serif;
        font-weight: bold;
    }

    .tile.hide {
        display: none;
    }

    .tile:hover .extra {
        opacity: 1;
    }
</style>