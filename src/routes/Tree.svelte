<script context="module">
	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>
<script>
//	import { slide } from 'svelte/transition'
	export let data
	const {name, path, children} = data

	let expanded = _expansionState[name] || false
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
				{name}
			</span>
			{#if expanded}
				{#each children as child}
					<svelte:self data={child} />
				{/each}
			{/if}
		{:else}
			<span>
				<a href='/edit/{path}' class="no-arrow">
				{name}
        </a>
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
