<nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/auth">Auth Page</a>
    <a href="/signup">Signup Page</a>
</nav>

<main>
    <slot />
</main>

<style>
    nav {
        display: flex;
        gap: 10px;
    }
</style>