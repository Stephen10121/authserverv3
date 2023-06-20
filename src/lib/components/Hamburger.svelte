<script lang="ts">
    import { createEventDispatcher } from "svelte";
  
    export let active = false;
    export let colorVar = "#ffffff";
    const dispatch = createEventDispatcher();
  
    function menuHandler(event: KeyboardEvent) {
        if (!event.ctrlKey || !(event.key === "m" || event.key === "M")) return;
        
        event.preventDefault();
        active = !active;
        dispatch("click");
    }
  </script>
  
  <svelte:window on:keydown={menuHandler} />
  
  <button
    title="Menu (Ctrl + m)"
    class={active ? "is-active" : ""}
    on:click={() => {
      dispatch("click");
      active = !active;
    }}
  >
    <span class="line" style="background-color:var({colorVar}, #ffffff);" />
    <span class="line" style="background-color:var({colorVar}, #ffffff);" />
    <span class="line" style="background-color:var({colorVar}, #ffffff);" />
  </button>
  
  <style>
    button {
      margin-top: 5px;
      border: none;
      background: none;
    }
    span {
      --animation-speed: 0.3s;
      width: 30px;
      height: 3px;
      display: block;
      background-color: red;
      margin: 7px auto;
      border-radius: 2px;
      -webkit-transition: all var(--animation-speed) ease-in-out;
      -o-transition: all var(--animation-speed) ease-in-out;
      transition: all var(--animation-speed) ease-in-out;
    }
  
    @media (prefers-reduced-motion: reduce) {
      span {
        --animation-speed: 0s;
      }
    }
  
    button:hover {
      cursor: pointer;
    }
  
    button.is-active .line:nth-child(2) {
      opacity: 0;
    }
  
    button.is-active .line:nth-child(1) {
      -webkit-transform: translateY(9px) rotate(45deg);
      -ms-transform: translateY(9px) rotate(45deg);
      -o-transform: translateY(9px) rotate(45deg);
      transform: translateY(9px) rotate(45deg);
    }
  
    button.is-active .line:nth-child(3) {
      -webkit-transform: translateY(-11px) rotate(-45deg);
      -ms-transform: translateY(-11px) rotate(-45deg);
      -o-transform: translateY(-11px) rotate(-45deg);
      transform: translateY(-11px) rotate(-45deg);
    }
  </style>