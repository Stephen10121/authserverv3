<script lang="ts">
	import CalendarChart from "$lib/components/CalendarChart.svelte";
import DatesVisited from "$lib/components/DatesVisited.svelte";
	import { Temporal } from "@js-temporal/polyfill";

    export let data;

    let loginHistory = JSON.parse(data.siteData.loginHistory);
    console.log(loginHistory)
    // const now = Temporal.Now.plainDateTimeISO();
    // loginHistory[`year${now.year+1}`] = loginHistory[`year${now.year}`] ? loginHistory[`year${now.year}`] : {};
    // loginHistory[`year${now.year+1}`][`month${now.month}`] = loginHistory[`year${now.year}`][`month${now.month}`] ? loginHistory[`year${now.year}`][`month${now.month}`] : {};
    // loginHistory[`year${now.year+1}`][`month${now.month}`][`day${now.day}`] = loginHistory[`year${now.year}`][`month${now.month}`][`day${now.day}`] ? loginHistory[`year${now.year}`][`month${now.month}`][`day${now.day}`] + 1 : 1;
</script>

<svelte:head>
    <title>{data.siteData.name} | Sites</title>
</svelte:head>

<section>
    <div class="box">
        <h3>Logins</h3>
        <p>{data.siteData.logins}</p>
    </div>
    <div class="box">
        <ul>
            {#each Object.keys(loginHistory) as years}
                <li>
                    <button>{years}</button>
                    <ul>
                        {#each Object.keys(loginHistory[years]) as months}
                            <li>
                                <button>{months}</button>
                                <ul>
                                    {#each Object.keys(loginHistory[years][months]) as days}
                                        <li>{days}: {loginHistory[years][months][days]}</li>
                                    {/each}
                                </ul>
                            </li>
                        {/each}
                    </ul>
                </li>
            {/each}
        </ul>
    </div>
    <div class="box">
        <!-- <DatesVisited /> -->
        <CalendarChart {loginHistory} />
    </div>
</section>

<style>
	section {
		width: 100%;
		height: 100%;
		padding: 20px;
		display: grid;
		column-gap: 10px;
        row-gap: 10px;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr 2fr;
	}

    .box {
        width: 100%;
        height: 100%;
        box-shadow: var(--shadow);
        border-radius: 10px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .box ul {
        padding-left: 10px;
    }

    .box h3 {
        font-family: "Poppins", sans-serif;
        font-size: 1.5rem;
        top: 10px;
        left: 20px;
        opacity: 0.7;
        font-weight: bold;
        color: var(--nuetral-text-color);
        margin-top: 10px;
        margin-bottom: 10px;
        position: absolute;
    }

    .box p {
        font-family: "Poppins", sans-serif;
        font-size: 2rem;
        font-weight: bold;
        color: var(--nuetral-text-color);
    }
</style>