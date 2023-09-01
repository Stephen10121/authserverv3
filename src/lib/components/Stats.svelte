<script lang="ts">
    import shieldLock from "../../assets/shield.svg";
    import shieldCross from "../../assets/shield-x.svg";
    import shieldCheck from "../../assets/shieldCheck.svg";
    import chart from "../../assets/chart.svg";
    export let attempted: number;
    export let failed: number;
    export let subscriptions: number;
    export let popular: string;
    export let popularId: string;
</script>

<section>
    <p id="name">Statistics</p>
    <div class="box" id="box1">
        <div class="imgCover" style="--color:rgba(79, 0, 153, 0.7);">
            <img src={shieldLock} alt="Attempted Logins" />
        </div>
        <div class="text">
            <h4>Attempted Logins</h4>
            <p>{attempted}</p>
        </div>
    </div>
    <div class="box" id="box2">
        <div class="imgCover" style="--color:rgba(0, 82, 195, 0.7);">
            <img src={shieldCross} alt="Failed Logins" />
        </div>
        <div class="text">
            <h4>Failed Logins</h4>
            <p>{failed}</p>
        </div>
    </div>
    <div class="box" id="box3">
        <div class="imgCover" style="--color:rgba(195, 0, 40, 0.7);">
            <img src={shieldCheck} alt="Subscriptions" />
        </div>
        <div class="text">
            <h4>Subscriptions</h4>
            <a href="/dashboard/site">{subscriptions}</a>
        </div>
    </div>
    <div class="box" id="box4">
        <div class="imgCover" style="--color:rgba(116, 233, 36, 0.7);">
            <img src={chart} alt="Most Popular" />
        </div>
        <div class="text">
            <h4>Most Popular</h4>
            <a href="/dashboard/site/{popularId}">{popular}</a>
        </div>
    </div>
</section>

<style>
    section {
        box-shadow: var(--shadow);
        min-height: 350px;
        max-width: 100%;
        padding: 20px;
        border-radius: 5px;
        display: grid;
        align-items: center;
        justify-content: start;
        grid-template-areas: "box1" "box2" "box3" "box4";
        row-gap: 20px;
        position: relative;
        /* container-type: inline-size; */
    }

    .box {
        display: flex;
        gap: 20px;
        padding: 10px;
        align-items: center;
    }

    .imgCover {
        width: 42px;
        height: 42px;
        border-radius: 100%;
        background-color: var(--color);
        padding: 10px;
    }

    .imgCover img {
        width: 100%;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    h4 {
        font-family: "Roboto", sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--nuetral-text-color);
    }

    .text p,
    .text a {
        font-family: "Roboto", sans-serif;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--nuetral-text-color);
    }

    #box1 {grid-area: box1;}
    #box2 {grid-area: box2;}
    #box3 {grid-area: box3;}
    #box4 {grid-area: box4;}

    @media (min-width: 650px) {
        section {
            min-height: 250px;
            grid-template-areas: "box1 box2" "box3 box4";
            justify-content: space-evenly;
        }
    }
    @media (min-width: 1000px) {
        section {
            grid-template-areas: "box1 box2 box3 box4";
        }
    }
    /* @container (min-width: 850px) {
        section {
            grid-template-areas: "box1 box2 box3 box4";
        }
    } */
    #name {
        font-family: "Roboto", sans-serif;
        font-size: 1rem;
        font-weight: bold;
        color: var(--nuetral-text-color);
        margin-top: 10px;
        margin-bottom: 10px;
        position: absolute;
        top: -5px;
        left: 5px;
    }
</style>