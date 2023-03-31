<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import Button, { Label, Icon } from '@smui/button';
  import Textfield from '@smui/textfield';
  import type { ActionData, PageData } from './$types'
  import { page } from '$app/stores';

  export let data: PageData
  export let form: ActionData

  const availableTags = ['ADR', 'Process'];

  let sha: string
  let frontMatter
  let tags
  let showCommitModal = false
  let commitMessage = ''
  let commitAction: "save" | "delete" | "create"
  let currentNode: TreeNode
  let crumbs = []
	let editor: EasyMDE | null
  let addPage: boolean

  $: {

    addPage = $page.url.searchParams.get('add') === 'page'
    tags = frontMatter?.tags ?? []
    editor?.value(data.content ?? '')
    sha = data.sha ?? ''
    frontMatter = data.data ?? {}
    currentNode = decodeURI($page.url.pathname).split("/").slice(2).reduce((p: TreeNode, c) => {
      if(p.children !== undefined && p.children.length > 0){
        return p.children.find(x => x.name === c)
      }
    }, $page.data.tree)
    crumbs = $page.url.pathname.split('/').slice(1).reduce((p, c, i) => {
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
  }

  function submitAction(button) {
    showCommitModal = !showCommitModal
    commitAction = button.target.name
  }

	import { onDestroy, onMount } from 'svelte';
  //import "easymde/src/css/easymde.css"
	//let showToolbar = true;
	let textArea: HTMLElement | undefined
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
<div>
<ul>
  {#each crumbs as crumb}
  <li>{crumb.href}</li>
  {/each}
</ul>
</div>
<div class="editor" hidden={currentNode.section && !addPage}>
  <form method="post" id="content">
    <div hidden={!addPage}>
    <label for="name">Filename:</label>
    <input size="60" name="filename" disabled={!addPage} type="text" />
    </div>
    <div class="margins">
      <Textfield label="Title" name="title" value={frontMatter.title ?? ''} />
    </div>
    <div>
      {#each availableTags as tag}
      <FormField>
        <Checkbox bind:group={tags} name={tag} id={tag} value={tag} checked={tags.includes(tag)} />
        <span slot="label">{tag}</span>
      </FormField>
      <!-- <input type="checkbox" bind:group={tags} id="{tag}" name="{tag}" value="{tag}" checked="{tags.includes(tag)}">
      <label for="{tag}">{tag}</label> -->
      {/each}
      <input name="tags" type="hidden" bind:value={tags} />
    </div>
    <div class="paper-container">
    <Paper>
    <textarea name="content" bind:this={textArea} />
    </Paper>
    </div>
    <input name="sha" type="hidden" bind:value={data.sha} />
    <input name="addPage" type="hidden" bind:value={addPage} />
  </form>
  <Button name="save"  disabled={showCommitModal} on:click="{submitAction}">
    <Icon class="material-icons">save</Icon>
    <Label>Save</Label>
  </Button>
  <Button name="delete" disabled={showCommitModal} on:click="{submitAction}">
    <Icon class="material-icons">delete</Icon>
    <Label>Delete</Label>
  </Button>
  {#if showCommitModal}
	<input type="text" name="commitMessage" form="content" placeholder="Enter commit message..." size="50" bind:value={commitMessage}/>
	<button type="submit" form="content" formaction="?/{commitAction}" disabled={commitMessage.length === 0}>
		Commit
	</button>
	<button type="button" on:click="{() => showCommitModal = !showCommitModal}">
		Cancel
	</button>
  {/if}
  {#if form?.success}
    <p>File commited successfully! 🥳</p>
  {/if}
</div>
