<script lang="ts">
  import ExtraInfo from "./ExtraInfo.svelte";
  import Meter from "./Meter.svelte";

  export let subscriptions: number;
  export let secureSubs: number;
</script>

<section class="meterPart tile">
  <p class="meter-title">Secure Subscriptions</p>
  <ExtraInfo>Percentage of websites your subscribed to that encrypts their data.</ExtraInfo>
  <Meter
    max={subscriptions}
    rotate={secureSubs}
    gaugeColor="#430498"
  />
</section>

<style>
  .meterPart {
    grid-area: chart;
    position: relative;
    padding-top: 10px;
  }

  .tile {
    background-color: var(--base-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    position: relative;
    box-shadow: var(--shadow);
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  .meter-title {
    position: absolute;
    top: 10px;
    left: 10px;
    font-family: "Roboto", sans-serif;
    font-size: 1rem;
    font-weight: bold;
    color: var(--base-text-color);
  }
</style>