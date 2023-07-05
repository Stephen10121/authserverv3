<script lang="ts">
	import { onMount } from "svelte";

    export let delayMs = 0;
    export let value: number;
    export let color = "var(--base-text-color)";
    export let trackColor = "#ff9785";
    export let progressColor = "#ff6347";

    let circleprogress: SVGSVGElement;
    let circleTitle: HTMLElement;
    let progressLine: SVGCircleElement;
    onMount(() => {
        let circleSvgH = circleprogress.clientHeight;
        let circleTitleH = circleTitle.clientHeight;
        let circleTitleW = circleTitle.clientWidth;
        
        circleTitle.style.top = (circleSvgH / 2) - (circleTitleH / 2) + 'px';
        circleTitle.style.left = (circleSvgH / 2) - (circleTitleW / 2) + 'px';

        progressLine.style.strokeDashoffset = (100 - value).toString();
    });
</script>

<div class="skills__list_item">
    <div class="skill">
        <svg bind:this={circleprogress} class="skill__circle" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 34 34">
            <circle class="skill__circle_background" style="stroke: {trackColor};" cx="16" cy="16" r="15.9155"></circle>
            <circle class="skill__circle_progress" bind:this={progressLine} cx="16" cy="16" r="15.9155" style="stroke: {progressColor};transition-delay: {delayMs}ms;"></circle>
        </svg>
        <div class="skill__circle_title" bind:this={circleTitle}>
            <p style="color: {color};">{value}</p>
        </div>
    </div>
</div>

<style>
    .skills__list_item {
        display: inline-block;
        margin: 7px 13px;
    }
    .skill {
        display: block;
        position: relative;
        text-align: center;
    }
    .skill__circle {
        height: 150px;
        width: 150px;
        transform: rotate(-90deg);
    }
    .skill__circle_background {
        fill: none;
        stroke-width: 0.7;
        stroke-opacity: 0.45;
    }
    .skill__circle_progress {
        fill: none;
        stroke-dasharray: 100 100;
        stroke-dashoffset: 100;
        stroke-linecap: round;
        stroke-width: 1.7;
        transition: stroke-dashoffset 1s ease-in-out;
    }
    .skill__circle_title {
        position: absolute;
        height: 45px;
        width: 45px;
        top: 52.5px;
        left: 52.5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .skill__circle_title p {
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        font-size: 1.5rem;
    }
</style>