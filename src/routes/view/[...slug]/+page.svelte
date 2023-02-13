<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData
	import { onDestroy, onMount } from 'svelte';
	let showToolbar = true;
	let textele;
	let editor: EasyMDE;
	// Setting up the editor and the visible buttons of the toolbar
	onMount(async () => {
		const easymde = await import('easymde');
		const EasyMDE = easymde.default;
		editor = new EasyMDE({
			element: textele,
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
			editor.toTextArea();
			editor = null
		}
	});
</script>

<div class="editor"><textarea id="invisible text area" bind:this={textele} /></div>
