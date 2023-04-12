<script context="module" lang="ts">
  import Button, { Label, Icon } from '@smui/button';
	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>

<script lang="ts">
	//import { slide } from 'svelte/transition'
	export let tree, p
  const [head, ...tail] = p
	const {name, path, children, hidden } = tree

	let expanded = _expansionState[name] || head === name
	const toggleExpansion = () => {
		expanded = _expansionState[name] = !expanded
	}
	$: arrowDown = expanded
</script>

<ul><!-- transition:slide -->
	<li>
		{#if children.length}
			<span on:click={toggleExpansion}>
				<span class="arrow" class:arrowDown>&#x25b6</span>
        <Button href='/docs/{path}'>
          <Label>{name}</Label>
        </Button>
			  </span>
			{#if expanded}
				{#each children as child}
					<svelte:self tree={child} p={tail}/>
				{/each}
			{/if}
		{:else if !hidden}
			<span>
				<Button href='/docs/{path}' class="no-arrow">
				  <Label>{name}</Label>
        </Button>
			</span>
		{/if}
	</li>
</ul>

<style>
	ul {
		margin: 0;
		list-style: none;
		padding-left: 1.2rem; 
		user-select: none;
	}
	.no-arrow { padding-left: 1.0rem; }
	.arrow {
		cursor: pointer;
		display: inline-block;
		/* transition: transform 200ms; */
	}
	.arrowDown { transform: rotate(90deg); }
</style>
