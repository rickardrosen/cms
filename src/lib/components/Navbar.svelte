<script lang="ts">
	import Hamburger from './Hamburger.svelte'
	import Breadcrumbs from './Breadcrumbs.svelte'
	
	export let sidebar = false
</script>

<nav class="fixed top-0 w-full z-50 bg-gray-200 p-2 items-center text-gray-600 border-b-2">
  <div class="flex flex-wrap justify-between items-center">
    <div class="flex items-center justify-start">
      <Hamburger bind:open={sidebar}/>
    </div>

  <div class="flex items-center lg:order-1">
    <Breadcrumbs />
  </div>

  <div class="inline-flex items-center lg:order-2 justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-600 dark:bg-gray-100">
      <span class="font-medium text-gray-100 dark:text-gray-300">JL</span>
  </div>
</nav>
