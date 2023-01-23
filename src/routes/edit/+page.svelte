<script>
	import { page } from '$app/stores';

  /** @type {import('./$types').PageData} */
  export let data;

	// we can access `data.posts` because it's returned from
	// the parent layout `load` function
	//$: index = data.posts.findIndex(post => post.slug === $page.params.slug);
	//$: next = data.posts[index - 1];
</script>

<h1>stuff</h1>
<div>{@html data}</div>
