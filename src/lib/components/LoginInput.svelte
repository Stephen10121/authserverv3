<script lang="ts">
    export let icon: string;
    export let placeholder = "";
    export let name: string;
    export let type: "text" | "password" = "text";
    export let value: string;
    export let error: string[] | undefined = undefined;

    function typeAction(node: HTMLInputElement) {
        node.type = type;
    }
</script>

<label for={name} class="field">
    {#if error}
        <p class="error">{error}</p>
    {/if}
    <div class="imgCover">
        <img src={icon} alt={placeholder}>
    </div>
    <input autocapitalize="none" bind:value={value} use:typeAction {placeholder} {name} id={name} />
</label>


<style>
    
    .field {
        display: grid;
        grid-template-columns: 40px auto;
        width: 100%;
        height: 40px;
        border-radius: 5px;
        position: relative;
    }

    .field:focus-within {
        outline: 1px solid #000000;
    }

    .field input {
        border: none;
        background: none;
        font-family: "George-Italic", sans-serif;
        font-size: 1rem;
        padding: 0 10px;
        border-top: 1px solid #808080;
        border-right: 1px solid #808080;
        border-bottom: 1px solid #808080;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .field input:focus {
        outline: none;
    }

    .imgCover {
        background-color: #86ff86;
        border: 1px solid #808080;
        display: flex;
        width: 100%;
        max-height: 100%;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .imgCover img {
        width: 100%;
        height: 100%;
        user-select: none;
        -webkit-user-drag: none;
    }

    .error {
        position: absolute;
        left: 0;
        top: -1rem;
        font-family: sans-serif;
        color: #ff0000;
        font-size: 0.9rem;
    }
</style>