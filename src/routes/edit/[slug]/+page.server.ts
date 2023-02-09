import { error } from '@sveltejs/kit';
import { getContent } from '$lib/server/github.ts';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  return {
    post: await db.getPost(params.slug)
  };
}) satisfies PageServerLoad;

export function load({ params }) {
  const content = params.slug;

  if (!content) throw error(404);

  return {
    content
  };
}
