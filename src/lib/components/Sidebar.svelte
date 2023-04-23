<script lang="ts">
	export let open = false
	import { page } from "$app/stores";
  import Tree from '$lib/components/Tree.svelte'
  import type { LayoutData } from './$types'
  const { tree } = $page.data
  let cp: string
  $: {
    cp = $page.url.pathname.split('/').slice(1)
  }
</script>

<aside class="z-50 absolute w-full h-full bg-gray-200 border-r-2 shadow-lg" class:open>
  <div class="fixed top-0">
	<nav class="p-12 text-xl">
    <Tree {tree} {cp} />
	</nav>
  </div>
</aside>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out;
	}
	
	.open {
		left: 0
	}
</style>
