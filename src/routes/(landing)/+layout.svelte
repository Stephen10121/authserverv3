<nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/signup">Signup Page</a>
    <a href="/">Home</a>
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