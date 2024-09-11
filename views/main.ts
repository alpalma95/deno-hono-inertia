import './app.css'
import { createInertiaApp } from '@inertiajs/svelte'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./pages/**/*.svelte')
    return pages[`./pages/${name}.svelte`]()
  },
  setup({ el, App, props }) {
    new App({ target: el, props })
  },
})