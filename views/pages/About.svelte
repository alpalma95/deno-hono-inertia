<script lang="ts">
    import  { inertia } from '@inertiajs/svelte'
    export let pageName: string;
</script>

<svelte:head>
    <title>About 🔥</title>
</svelte:head>

<main>
    <h1>About {pageName}</h1>
    <a href="/" use:inertia>Back to Home</a>
</main>