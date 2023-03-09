<script lang="ts">
  import type { ActionData, PageData } from './$types'
  //import { enhance } from '$app/forms'
  export let data: PageData
  export let form: ActionData
  let sha = data.sha
  let frontMatter = data.data
  $: {
    editor?.value(data.content ?? '')
    sha = data.sha ?? ''
  }
	import { onDestroy, onMount } from 'svelte';
  //import "easymde/src/css/easymde.css"
	//let showToolbar = true;
	let textArea: HTMLElement | undefined
	let editor: EasyMDE | null
	// Setting up the editor and the visible buttons of the toolbar
	onMount(async () => {
		const easymde = await import('easymde')
		const EasyMDE = easymde.default;
		editor = new EasyMDE({
			element: textArea,
			autofocus: true,
			spellChecker: false,
			nativeSpellcheck: true,
			theme: 'easymde',
			autosave: {
				enabled: true,
				uniqueId: 'easymde-autosave',
				delay: 1000
			},
			toolbar: [
				'preview',
				'|',
				'bold',
				'italic',
				'strikethrough',
				'|',
				'heading-bigger',
				'heading-smaller',
				'heading-1',
				'heading-2',
				'heading-3',
				'|',
				'unordered-list',
				'ordered-list',
				'|',
				'code',
				'image',
				'link',
				'quote',
				'table',
				'horizontal-rule',
				'|',
				'redo',
				'undo',
				'guide',
				'|',
			],
			status: ['autosave', 'words'],
			hideIcons: ['fullscreen', 'side-by-side'],
		});
  editor.value(data.content ?? '')
	});
	// Resetting the editor when clearing it
	onDestroy(() => {
		if (editor) {
			editor.toTextArea()
			editor = null
		}
	});
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css">
	<title>Editor</title>
</svelte:head>

<div class="editor">
  <form method="post">
    {#if frontMatter}
    {#each Object.entries(frontMatter) as [key, value]}
    <input name={key} type="text" value={key} />
    <input name={value} type="text" value={value} />
	  {/each}
    {/if}
    <input name="sha" type="text" bind:value={data.sha} />
    <textarea name="content" bind:this={textArea} />
    <button type="submit" formaction="?/save">Save</button>
  </form>
  {#if form?.success}
    <p>File commited successfully! 🥳</p>
  {/if}
</div>
