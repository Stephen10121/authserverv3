<script lang="ts">
    export let options: {
        text: string;
        value: string;
    }[] = [];
    export let value: string;
    export let title = "Dropdown";
</script>

<select id="mounth" bind:value={value} on:change {title}>
    {#each options as option}
        <option value={option.value}>{option.text}</option>
    {/each}
    <slot />
</select> 

<style>
    select {
        width: 100%;
        height: 30px;
        cursor: pointer;
        font-family: "Poppins", sans-serif;
        font-weight: bold;
        color: var(--nuetral-text-color);
        background-color: var(--nuetral-color);
        border: 1px solid var(--nuetral-text-color);
        border-radius: 5px;
        outline: none;
        padding: 0 5px;
    }
</style>