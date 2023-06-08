<script lang="ts">
    export let name: string;
    export let id: string;
    export let checked: boolean;
</script>

<input type="checkbox" {name} {id} bind:checked={checked} />

<style>
    input {
        position: relative;
        width: 2px;
    }
    input::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        transform: translate(-90%, -27%);
        width: 60px;
        height: 30px;
        border-radius: 100vw;
        background-color: #808080;
        cursor: pointer;
        transition: background-color 0.15s linear;
    }

    input::after {
        content: "";
        position: absolute;
        top: -6px;
        left: -52px;
        width: 26px;
        height: 26px;
        border-radius: 100vw;
        background-color: #ffffff;
        cursor: pointer;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
        transition: transform 0.15s linear;
    }

    input:checked::before {
        background-color: #48ff00;
    }
    input:checked::after {
        transform: translateX(30px);
    }
</style>