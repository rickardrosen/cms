<script lang="ts">
	export let tree, cp
  const [head, ...tail] = cp
	const {name, path, children, hidden } = tree
</script>

<ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
		{#if children.length}
	    <li>
        {name}
				<ul>
           {#each children as child}
				  <svelte:self tree={child} cp={tail}/>
				   {/each}
         </ul>
      </li>
		{:else if !hidden}
			<li>
        <a href='/docs/{path}'>{name}</a>
			</li>
		{/if}
</ul>
