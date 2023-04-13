<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import Button, { Label, Icon } from '@smui/button';
  import Textfield from '@smui/textfield';
  import type { ActionData, PageData } from './$types'
  import { page } from '$app/stores';
	import EasyMde from '$lib/components/EasyMde.svelte';

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
  let addPage: boolean
  let content: string

  $: {
    content = data.content ?? ''
    addPage = $page.url.searchParams.get('add') === 'page'
    tags = frontMatter?.tags ?? []
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

  function submitAction(action) {
    showCommitModal = !showCommitModal
    commitAction = action
  }
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
        <Checkbox bind:group={tags} name="tags" value={tag} checked={tags.includes(tag)} />
        <span slot="label">{tag}</span>
      </FormField>
      <!-- <input type="checkbox" bind:group={tags} id="{tag}" name="{tag}" value="{tag}" checked="{tags.includes(tag)}">
      <label for="{tag}">{tag}</label>
      {/each}
      <input name="tags" type="hidden" bind:value={tags} />
      -->
      {/each}
    </div>
    <div class="paper-container">
    <Paper>
    <EasyMde {content} />
    </Paper>
    </div>
    <input name="sha" type="hidden" bind:value={data.sha} />
    <input name="addPage" type="checkbox" bind:checked={addPage} />
  </form>
  <Button disabled={showCommitModal} on:click="{() => { commitAction = 'save'; showCommitModal = !showCommitModal}}">
    <Icon class="material-icons">save</Icon>
    <Label>Save</Label>
  </Button>
  <Button disabled={showCommitModal} on:click="{() => { commitAction = 'delete'; showCommitModal = !showCommitModal}}">
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
