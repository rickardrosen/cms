import * as github from '$lib/server/github';

interface TreeNode {
  name: string;
  //type: string
  children?: TreeNode[];
}
/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  const gitTree = await github.getDocsTree();
  //const files = gitTree.filter((x) => x.type === 'blob');
  //if (!files) return;
  var tree: { [key: string]: {} } = {};
  gitTree.forEach(({ path }) => {
    let currentNode = tree;
    path.split('/').forEach((segment) => {
      if (currentNode[segment] === undefined) {
        currentNode[segment] = {};
      }
      currentNode = currentNode[segment];
    });
  });
  const jsonTree: TreeNode = { name: 'Root', children: toJsonTree(tree) };
  console.log('%j', jsonTree);
  return jsonTree;
}

function toJsonTree(tree: { [key: string]: {} }) {
  return Object.keys(tree).map((name) => {
    let n: TreeNode = { name };
    if (Object.keys(tree[name]).length > 0) {
      n.children = toJsonTree(tree[name]);
    }
    return n;
  });
}
