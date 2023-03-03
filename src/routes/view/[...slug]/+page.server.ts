import { error } from '@sveltejs/kit';
import { getContent } from '$lib/server/github';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  const data = await getContent(params.slug);
  if (!data) throw error(404);
  if ('content' in data) {
    const doc = Buffer.from(data.content, 'base64').toString();
    console.log(doc);
    const yml = '---';
    const startPosition = doc.search(yml) + yml.length;
    const endPosition = doc.slice(startPosition).search(yml) + startPosition;
    const fmStr = doc.slice(startPosition, endPosition);
    const md = doc.slice(endPosition + yml.length + 1, doc.length);
    const fmArr = fmStr.trim().split('\n');
    console.log(fmArr);
    const fm = Object.fromEntries(fmArr.map((e) => e.split(': ')));
    console.log(fm);
    return { md, fm };
  }
  return {
    data
  };
}) satisfies PageServerLoad;
