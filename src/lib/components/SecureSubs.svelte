<script lang="ts">
	import Meter from "./Meter.svelte";

    export let subscriptions: number;
    export let secureSubs: number;
</script>
<section class="meterPart tile">
    <p class="meter-title">Secure Subscriptions</p>
    <div class="extraInfo">
      <p>?</p>
      <div class="show">
        Percentage of websites your subscribed to that encrypts their data.
      </div>
    </div>
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
  
    .extraInfo p {
      width: 20px;
      height: 20px;
      background-color: black;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 1px;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      font-family: "Roboto", sans-serif;
      font-weight: bold;
      user-select: none;
    }
  
    .show {
      opacity: 0;
      visibility: hidden;
      width: 200px;
      height: 100px;
      background-color: green;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
      transition: 0.25s;
      font-family: "Roboto", sans-serif;
      padding: 10px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.7);
      color: #dfdfdf;
    }
  
    .extraInfo:hover .show {
      opacity: 1;
      visibility: visible;
    }
  </style>