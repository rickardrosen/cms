<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
  export let content: string
	export let editor: EasyMDE | null
	let textArea: HTMLElement | undefined
	// Setting up the editor and the visible buttons of the toolbar
  $: {
    editor?.value(content ?? '')
  }
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
<textarea name="content" bind:this={textArea} />
