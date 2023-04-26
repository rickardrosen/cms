<script lang="ts">
	import { page } from '$app/stores';
	import Hamburger from './Hamburger.svelte'
	import Breadcrumbs from './Breadcrumbs.svelte'
	
	export let sidebar = false
  let userInitials: string

  const getInitials = (fullName) => {
    const allNames = fullName.trim().split(' ');
    const initials = allNames.reduce((acc, c, index) => {
      if(index === 0 || index === allNames.length - 1){
        acc = `${acc}${c.charAt(0).toUpperCase()}`;
      }
      return acc;
    }, '');
    return initials;
  }

  $:{
    userInitials = getInitials($page.data.user.fullname)
  }

</script>

<nav class="fixed top-0 w-full z-50 bg-gray-200 p-1 items-center text-gray-600 border-b-2">
  <div class="flex flex-wrap justify-between items-center">
    <div class="flex items-center justify-start">
      <Hamburger bind:open={sidebar}/>
    </div>

  <div class="flex items-center lg:order-1">
    <Breadcrumbs />
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
</svg>
  </div>

  <div class="inline-flex items-center lg:order-2 justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-600">
      <span class="font-medium text-gray-100">{userInitials}</span>
  </div>
</nav>
