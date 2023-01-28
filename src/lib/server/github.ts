import {
  GITHUB_APP_ID as appId,
  GITHUB_INSTALLATION as installationId,
  GITHUB_API_PRIVATE_KEY
} from '$env/static/private';
import { App } from 'octokit';

const owner = 'academicwork';
const repo = 'handbook';
const privateKey = Buffer.from(GITHUB_API_PRIVATE_KEY, 'base64').toString('ascii');
const app = new App({ appId, privateKey });
//const { data: slug } = await app.octokit.rest.apps.getAuthenticated();
const octokit = await app.getInstallationOctokit(parseInt(installationId));

async function getBranchTreeSha(branch: string) {
  const res = await octokit.request(`GET /repos/{owner}/{repo}/branches/{branch}`, {
    owner,
    repo,
    branch
  });
  return res.data['commit']['commit']['tree']['sha'];
  // const master = await octokit.request('GET /repos/academicwork/handbook/branches/master', headers=key)
}

async function getTree(tree_sha: string) {
  const res = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}{?recursive}', {
    owner,
    repo,
    tree_sha,
    recursive: 'true'
  });
  return res.data.tree;
}

export async function getDocsTree(): Promise<[{ path: string; type: string }]> {
  const masterTreeSha = await getBranchTreeSha('master');
  const masterTree = await getTree(masterTreeSha);
  const docsNode = masterTree.find((x: { path: string }) => x.path === 'docs');
  const docsTree = await getTree(docsNode.sha);
  return docsTree;
}
