<script lang="ts">
	import type { Temporal } from "@js-temporal/polyfill";

    export let time: Temporal.PlainDateTime;
    export let day: number;
    export let year: number;
    export let loginHistory: any;

    $: time2 = time.add({days: day});

    $: logins = loginHistory[`year${time2.year}`] ? loginHistory[`year${time2.year}`][`month${time2.month}`] ? loginHistory[`year${time2.year}`][`month${time2.month}`][`day${time2.day}`] ? loginHistory[`year${time2.year}`][`month${time2.month}`][`day${time2.day}`] : 0 : 0 : 0
</script>

<div class="tile {time2.year !== year ? "hide" : ""}">
    <div class="color {logins? "blue" : ""}" style="{logins ? `filter: brightness(${(logins * 10 + 40) / 100});` : ""}" />
    <div class="extra {time2.month-1 > 8 ? "left" : time2.month-1 < 2 ? "right" : ""}">
        <p>
            <span>{logins ? logins : 0}</span>
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
        width: 3px;
        height: 3px;
        position: relative;
    }

    
    .color {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        background-color: var(--secondary-color);
    }

    .color.blue {
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
        border: 1px solid var(--base-text-color);
        border-radius: 10px;
        z-index: 500;
        transition: opacity 0.1s linear;
        white-space: nowrap;
    }

    .extra.left {
        transform: translate(-100%, calc(-100% - 10px));
    }

    .extra.right {
        transform: translate(0%, calc(-100% - 10px));
    }

    .extra p {
        font-family: "Roboto", sans-serif;
        color: var(--base-text-color);
    }

    .extra p span {
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        color: var(--base-text-color);
    }

    .tile.hide {
        display: none;
    }

    .tile:hover .extra {
        opacity: 1;
    }

    @media (min-width: 500px) {
        .tile {
            width: 5px;
            height: 5px;
        }
    }
    @media (min-width: 650px) {
        .tile {
            width: 8px;
            height: 8px;
        }
    }
    @media (min-width: 850px) {
        .tile {
            width: 11px;
            height: 11px;
        }
    }
</style>