<script lang="ts">
    import "../app.css"
  export let data: LayoutData

	import Navbar from '$lib/components/Navbar.svelte'
	import Sidebar from '$lib/components/Sidebar.svelte'

	let open = false
</script>

<Sidebar bind:open/>
<header>
  <Navbar bind:sidebar={open} />
</header>

<main class="container mx-auto bg-white mt-24 md:mt-16">
  <slot />
</main>
