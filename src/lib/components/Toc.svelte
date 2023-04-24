<script lang="ts">
	export let tree, cp
  const [head, ...tail] = cp
	const {name, path, children, hidden } = tree
</script>

<ol class="list-disc list-inside">
		{#if children.length}
	    <li>
        {name}
				 <ol class="pl-5 mt-2 space-y-1 list-decimal list-inside">
         {#each children as child}
					<svelte:self tree={child} cp={tail}/>
				{/each}
      </ol>
      </li>
		{:else if !hidden}
			<li>
        <a href='/docs/{path}'>{name}</a>
			</li>
		{/if}
</ol>
