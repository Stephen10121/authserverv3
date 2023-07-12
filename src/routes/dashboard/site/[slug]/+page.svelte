<script lang="ts">
	import BlackListSection from "$lib/components/BlackListSection.svelte";
    import CalendarChart from "$lib/components/CalendarChart.svelte";
	import CircleData from "$lib/components/CircleData.svelte";
	import { Temporal } from "@js-temporal/polyfill";
	import { info } from "../../../../stores/notification.js";
	import { onDestroy } from "svelte";
    import Selector from "$lib/components/Selector.svelte";
	import ExtraInfo from "$lib/components/ExtraInfo.svelte";
    export let data;

    if (data.siteData.owner) {
        info.update((infos) => {
            infos.push({ data: `Looks like you're the owner of "${data.siteData.name}". <a style="color:#000000;opacity:0.7;" href="/">Owner Page</a>`, id: "isownerpopup" });
            return infos
        });
    }

    let loginHistory = JSON.parse(data.siteData.loginHistory);
    const now = Temporal.Now.plainDateTimeISO();
    let year = now.year;
    // loginHistory[`year${now.year+1}`] = loginHistory[`year${now.year}`] ? loginHistory[`year${now.year}`] : {};
    // loginHistory[`year${now.year+1}`][`month${now.month}`] = loginHistory[`year${now.year}`][`month${now.month}`] ? loginHistory[`year${now.year}`][`month${now.month}`] : {};
    // loginHistory[`year${now.year+1}`][`month${now.month}`][`day${now.day}`] = loginHistory[`year${now.year}`][`month${now.month}`][`day${now.day}`] ? loginHistory[`year${now.year}`][`month${now.month}`][`day${now.day}`] + 1 : 1;
    let selectedTheme = data.siteData.currentTheme;
    onDestroy(() => {
        if (data.siteData.owner) {
            info.update((infos) => {
                return infos.filter((infos2) => infos2.id !== "isownerpopup");
            });
        }
    });
</script>

<svelte:head>
    <title>{data.siteData.name} | Sites</title>
</svelte:head>

<section>
    <div class="box-bundle">
        <div class="box centered">
            <h3>Name</h3>
            <p id="logins">{data.siteData.name}</p>
        </div>
        <div class="box centered">
            <h3>Logins</h3>
            <CircleData delayMs={300} value={data.siteData.logins} />
            <!-- <p id="logins">{data.siteData.logins}</p> -->
        </div>
        <div class="box centered column red">
            <h3>Blacklist</h3>
            <BlackListSection blacklist={data.siteData.blacklist} name={data.siteData.uniqueName} token={data.accessToken} />
        </div>
    </div>
    <div class="box centered column">
        <h3>Login History</h3>
        <div class="chart">
            <div class="labels">
                <p>Sun</p>
                <p>Mon</p>
                <p>Tue</p>
                <p>Wed</p>
                <p>Thu</p>
                <p>Fri</p>
                <p>Sat</p>
            </div>
            <CalendarChart year={year} {loginHistory} />
        </div>
        <div class="yearselector">
            {#each Object.keys(loginHistory).reverse() as years}
                <input class="yearselect sr-only" bind:group={year} id={years} type="radio" name="year" value={parseInt(years.substring(4, 8))} />
                <label class="year" for={years}>{years.substring(4, 8)}</label>
            {/each}
        </div>
    </div>
    <div class="box-bundle">
        <div class="box centered">
            <h3>Secure</h3>
            <ExtraInfo>A secure website uses the https protocol. Not secure websites use the http protocol.</ExtraInfo>
            <p id="logins">This site is {data.siteData.secure ? "" : "not"} secure.</p>
        </div>
        <div class="box ownerinfo">
            <h3>Owner information</h3>
            <p>Name: {data.siteData.ownerName}</p>
            <p>Email: <a href="mailto:{data.siteData.ownerEmail}">{data.siteData.ownerEmail}</a></p>
        </div>
        <div class="box centered spread">
            <h3>Theme</h3>
            <Selector bind:value={selectedTheme} title="Choose Theme" on:change={() => console.log(selectedTheme)}>
                {#each JSON.parse(data.siteData.themeOptions) as themes}
                    <option value={themes} selected={selectedTheme === themes}>{themes}</option>
                {/each}
            </Selector>
        </div>
    </div>
</section>

<style>
	section {
        width: 100%;
        height: 100%;
		padding: 20px;
		display: grid;
		flex-direction: column;
		gap: 10px;
        overflow-y: auto;
        overflow-x: hidden;
		/* width: 100%; */
		/* height: 100%; */
		/* padding: 20px; */
		/* display: grid; */
		/* column-gap: 10px; */
        /* row-gap: 10px; */
        grid-template-rows: 1fr 1fr 1fr;
        /* grid-template-columns: 1fr 1fr 2fr; */
	}

    .box-bundle {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .box {
        width: 100%;
        height: 100%;
        min-height: 250px;
        box-shadow: var(--shadow);
        border-radius: 10px;
        position: relative;
        display: flex;
        padding: 20px;
    }

    .box.centered {
        align-items: center;
        justify-content: center;
    }

    .box.spread {
        justify-content: space-evenly;
    }

    .box.red {
        border: 2px solid #ff0000;
    }

    .box.red h3 {
        color: #ff0000;
        opacity: 1;
    }

    .box h3 {
        font-family: "Roboto", sans-serif;
        font-size: 1rem;
        font-weight: bold;
        color: var(--nuetral-text-color);
        top: 10px;
        left: 10px;
        opacity: 0.7;
        position: absolute;
    }

    .box p {
        font-family: "Poppins", sans-serif;
        /* font-size: 2rem; */
        font-weight: bold;
        color: var(--nuetral-text-color);
        font-size: clamp(1rem, -1.5rem + 8vw, 2rem);
    }

    .box.ownerinfo {
        padding-top: 35px;
        flex-direction: column;
        gap: 5px;
    }

    .box.box.ownerinfo p {
        font-size: 1rem;
    }

    .box.box.ownerinfo p a {
        font-size: inherit;
        color: inherit;
    }

    .chart {
        display: flex;
        align-items: center;
        height: 89px;
        gap: 5px;
    }
    .labels {
        display: none;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-end;
        height: 100%;
    }
    .labels p {
        font-size: 0.6rem;
        margin-top: 2px;
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        color: var(--nuetral-text-color);
    }
    .sr-only {
        clip: rect(0 0 0 0);
        clip-path: inset(100%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap; 
        width: 1px;
    }

    .yearselector {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 150px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .year {
        background-color: var(--nuetral-color);
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        font-size: 1rem;
        padding: 10px;
        width: 100%;
        text-align: center;
        cursor: pointer;
        border-radius: 10px;
        color: var(--nuetral-text-color);
        transition: filter 0.1s linear;
    }

    .year:hover {
        filter: brightness(0.95);
    }

    .yearselect:checked + label {
        filter: brightness(0.82);
    }

    .column {
        flex-direction: column
    }

    @media (min-width: 850px) {
        .labels {
            display: flex;
        }
    }

    @media (min-width: 1400px) {
        .box-bundle {
            flex-direction: row;
        }
    }
</style>