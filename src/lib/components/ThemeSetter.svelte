<script lang="ts">
    export let theme: string = "system";
    export let customThemes: {id: string, themeClass: string}[] = [];

    let theme2: string;

    $: {
        if (theme === "dark") {
            theme2 = "themeSetter-dark";
        } else if (theme === "system") {
            theme2 = "themeSetter-system";
        } else if (theme === "light") {
            theme2 = "themeSetter-light";
        } else if (theme.length !== 0 && customThemes.length!==0) {
            let themeNotFound = true;
            for (let i=0;i<customThemes.length;i++) {
                if (customThemes[i].id === theme) {
                    theme2 = customThemes[i].themeClass;
                    themeNotFound = false;
                }
            }
            if (themeNotFound) {
                theme2 = "themeSetter-light";
            }
        } else {
            theme2 = "themeSetter-light";
        }
    }
</script>

<section class="themeSetter {theme2}">
    <slot />
</section>

<style>
    .themeSetter {
        width: 100%;
        height: 100%;
        background-color: var(--base-color);
        transition: background-color 0.15s linear;
    }

    .themeSetter.themeSetter-light {
        --text-color: #000000a6;
        --text-color-light: #ffffffc2;
        
        --primary-color: #c7bef7;
        --primary-text-color: var(--text-color);

        --secondary-color: #b7b9c2;
        --secondary-text-color: var(--text-color);

        --accent-color: #8174e6;
        --accent-text-color: var(--text-color-light);

        --nuetral-color: #ffffff;
        --nuetral-text-color: var(--text-color);

        /* --base-color: #EAF3FA; */
        --base-color: #dfdfdf;
        --base-text-color: var(--text-color);

        --info-color: #4B95CE;
        --info-text-color: var(--text-color);

        --success-color: #29E0A3;
        --success-text-color: var(--text-color);

        --warning-color: #D49311;
        --warning-text-color: var(--text-color);

        --error-color: #DD273C;
        --error-text-color: var(--text-color);

        --primary-font: system-ui;
        --secondary-font: sans-serif;
        --shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }

    .themeSetter.themeSetter-dark {
        --text-color: #0000009f;
        --text-color-light: #ffffffc2;

        --primary-color: #86efac;
        --primary-text-color: var(--text-color);

        --secondary-color: #4242425d;
        --secondary-text-color: var(--text-color-light);

        --accent-color: #8b5cf6;
        --accent-text-color: var(--text-color);

        --nuetral-color: #374151;
        --nuetral-text-color: var(--text-color-light);

        --base-color: #111827;
        --base-text-color: var(--text-color-light);

        --info-color: #7BE0F4;
        --info-text-color: var(--text-color);

        --success-color: #18D898;
        --success-text-color: var(--text-color);

        --warning-color: #eab308;
        --warning-text-color: var(--text-color);

        --error-color: #b91c1c;
        --error-text-color: var(--text-color-light);

        --primary-font: system-ui;
        --secondary-font: sans-serif;
        --shadow: rgb(0 0 0) 0px 3px 8px;
    }

    @media (prefers-color-scheme: dark) {
        .themeSetter.themeSetter-system {
        --text-color: #0000009f;
        --text-color-light: #ffffffc2;

        --primary-color: #86efac;
        --primary-text-color: var(--text-color);

        --secondary-color: #c04eed;
        --secondary-text-color: var(--text-color);

        --accent-color: #8b5cf6;
        --accent-text-color: var(--text-color);

        --nuetral-color: #374151;
        --nuetral-text-color: var(--text-color-light);

        --base-color: #111827;
        --base-text-color: var(--text-color-light);

        --info-color: #7BE0F4;
        --info-text-color: var(--text-color);

        --success-color: #18D898;
        --success-text-color: var(--text-color);

        --warning-color: #eab308;
        --warning-text-color: var(--text-color);

        --error-color: #b91c1c;
        --error-text-color: var(--text-color-light);

        --primary-font: system-ui;
        --secondary-font: sans-serif;
    }
    }

    @media (prefers-color-scheme: light) {
        .themeSetter.themeSetter-system {
        --text-color: #000000a6;
        --text-color-light: #ffffffc2;
        
        --primary-color: #75cff9;
        --primary-text-color: var(--text-color);

        --secondary-color: #579fd6;
        --secondary-text-color: var(--text-color);

        --accent-color: #7d20f7;
        --accent-text-color: var(--text-color);

        --nuetral-color: #2B2037;
        --nuetral-text-color: var(--text-color-light);

        --base-color: #E9DFEC;
        --base-text-color: var(--text-color);

        --info-color: #4B95CE;
        --info-text-color: var(--text-color);

        --success-color: #29E0A3;
        --success-text-color: var(--text-color);

        --warning-color: #D49311;
        --warning-text-color: var(--text-color);

        --error-color: #DD273C;
        --error-text-color: var(--text-color);

        --primary-font: system-ui;
        --secondary-font: sans-serif;
        }
    }
</style>