import * as github from '$lib/server/github';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  const tree = github.getDocsTree();
  return {
    files: ['kalle', 'palle']
  };
}
