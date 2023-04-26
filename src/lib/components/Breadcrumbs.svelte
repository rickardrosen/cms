<script lang="ts">
	import { page } from "$app/stores";
  let crumbs: {name: string, href: string}[]
  let cp, lastCrumb
  $: {
    cp = $page.url.pathname.split('/').slice(1)
    crumbs = cp.reduce((p, c, i) => {
      let curr
      if(i === 0){
        curr = {
          href: '',
          name: ''
        }
      }else{
        const { href, name } = p[i-1]
        curr = {
          href: `${href}/${c}`,
          name: c
        }
      }
      p.push(curr)
      return p
    }, []).slice(1)
    lastCrumb = crumbs.pop()
  }
</script>

<ol class="inline-flex items-center space-x-1 md:space-x-2">
    <li class="inline-flex items-center">
      <a href="#" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
        <svg aria-hidden="true" class="w-4 h-4 mr-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
      </a>
    </li>
 {#each crumbs as crumb}
 <li class="inline-flex items-center">
    <div class="flex items-center">
      <svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
      <a href={'/docs' + crumb.href}>{crumb.name}</a>
    </div>
 </li>
 {/each}
</ol>
<!--<form action="{$page.url.pathname.replace(/\/[^/]+\/?$/, '')}">
 <button name="add" value="page">Add page</button>
</form></div>
-->
