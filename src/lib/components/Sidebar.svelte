<script lang="ts">
	export let open = false
	import { page } from "$app/stores";
  import Tree from '$lib/components/Tree.svelte'
  const { tree } = $page.data
  let cp: string
  $: {
    cp = $page.url.pathname.split('/').slice(1)
  }
</script>

<aside class="z-50 absolute" class:open>
  <div class="overflow-scroll h-full fixed bg-gray-200 border-r-2">
      <button type="button" on:click={() => open = !open} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Close menu</span>
    </button>
	<nav class="p-2 text-s">
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
