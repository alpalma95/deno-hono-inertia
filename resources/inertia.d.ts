declare module '@inertiajs/svelte' {
    import type { SvelteComponent } from 'svelte'
    export function createInertiaApp(options: {
        resolve: (name: string) => Promise<unknown>
        setup: (options: { el: HTMLElement, App: typeof SvelteComponent, props: Record<string, any> }) => void
    }): void

    export const inertia: (node: unknown, options?: Record<string, unknown>) => __sveltets_2_SvelteActionReturnType
}