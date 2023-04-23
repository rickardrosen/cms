import { error } from '@sveltejs/kit';
import { getTreeByName } from '$lib/server/github';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

interface TreeNode {
  name: string;
  type: string;
  path: string;
  children: TreeNode[];
  hidden: boolean;
  section: boolean;
}

interface User {
  fullname: string;
  email: string;
}

const getTrustedUser = (headers: Headers): User => {
  if(env.ENVIRONMENT === 'local'){
    return {
      email: 'local@test.user',
      fullname: 'Local User'
    }
  }
  if(env.TRUSTED_PROXY){
    return {
      email: headers.get("X-Auth-Sub") ?? '',
      fullname: headers.get("X-User-Full-Name") ?? ''
    }
  }
  throw error(403, { message: 'User not authenticated'})
};

/** @type {import('./$types').LayoutServerLoad} */
export const load: LayoutServerLoad = async ({ request }) => {

  const user = getTrustedUser(request.headers)
  const gitTree = await getTreeByName('docs');
  const tree: TreeNode = {
    name: 'docs',
    children: [],
    type: 'root',
    path: '',
    hidden: false,
    section: true
  };

  tree.children = gitTree.reduce((r: TreeNode[], n) => {
    n.path.split('/').reduce((childNodes: TreeNode[], name) => {
      let child = childNodes.find((n) => n.name === name);
      if (!child) {
        childNodes.push(
          (child = {
            name,
            path: n.path,
            children: [],
            type: n.type === 'tree' ? 'folder' : 'file',
            hidden: false,
            section: n.type === 'tree' ? true : false
          })
        );
      }
      return child.children;
    }, r);
    return r;
  }, []);

  const sectionIndex = (t: TreeNode) => {
    for (let child of t.children) {
      if (child.name.startsWith('index.md')) {
        //child.type = "folder"
        child.hidden = true;
        t.path = child.path;
        t.section = true;
      }
      sectionIndex(child);
    }
    return t;
  };

  const navTree = sectionIndex(tree);
  return { tree: navTree, user };
};
