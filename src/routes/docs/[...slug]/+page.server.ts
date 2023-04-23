import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
  deleteFile,
  getContent,
  createOrUpdateFile,
  type Commit,
  type CommitMessage
} from '$lib/server/github';
import type { PageServerLoad, Actions } from './$types';
import matter from 'gray-matter';

export const load: PageServerLoad = async ({ params, url }) => {
  if (url.pathname === '/docs') {
    throw redirect(302, '/');
  }
  if (url.searchParams.get('add') === 'page') {
    return;
  } else {
    const gitContent = await getContent(params.slug);
    //if (!gitContent) throw error(404);

    if ('content' in gitContent) {
      const { data, content } = matter(Buffer.from(gitContent.content, 'base64').toString());
      return { frontmatter: data, content, sha: gitContent.sha };
    }
  }
};

export const actions: Actions = {
  save: async ({ request }) => {
    const { text, data, message, sha, addPage, filename } = await request.formData().then((x) => {
      return {
        data: {
          title: x.get('title') as string,
          tags: x.getAll('tags') as string[]
        },
        filename: x.get('filename') as string,
        addPage: x.get('addPage') as unknown,
        text: x.get('content') as string,
        message: x.get('commitMessage') as string,
        sha: x.get('sha') as string
      };
    });
    console.log('add:', addPage);
    const file = matter.stringify(text, data);
    const content = Buffer.from(file).toString('base64');
    const commit: Commit = {
      message,
      committer: {
        name: 'palle',
        email: 'palle@kalle.commit'
      },
      sha,
      content
    };
    const path = new URL(request.url).pathname.substring(1);
    const gitPath = addPage == 'on' ? `${path}/${filename}` : path;
    const res = await createOrUpdateFile(gitPath, commit);
    if (res.status < 300) {
      if (addPage) {
        throw redirect(303, path + '/' + filename);
      }
      return { success: true, sha: res.data.commit.sha };
    }
  },
  delete: async ({ request }) => {
    const path = new URL(request.url).pathname.substring(1);
    console.log('delete:', path);
    const { sha, message } = await request.formData().then((x) => {
      return {
        sha: x.get('sha') as string,
        message: x.get('commitMessage') as string
      };
    });
    const commitMsg: CommitMessage = {
      message,
      committer: {
        name: 'palle',
        email: 'palle@kalle.com'
      }
    };
    await deleteFile(path, sha, commitMsg);
  }
};
