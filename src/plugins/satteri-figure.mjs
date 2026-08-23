import { readFileSync } from 'node:fs';
import { imageSize } from 'image-size';

/**
 * `![alt](/img/x.webp "caption")` becomes a <figure>; the markdown title is the caption.
 * Only paragraphs whose sole content is an image are converted.
 *
 * Intrinsic dimensions are stamped onto the tag: they reserve layout space, and
 * essay.css sizes archival scans by their natural width rather than the column.
 */

const sizes = new Map();

function intrinsicSize(src) {
	if (typeof src !== 'string' || !src.startsWith('/img/')) return undefined;
	if (!sizes.has(src)) {
		try {
			const { width, height } = imageSize(readFileSync(`public${src}`));
			sizes.set(src, { width, height });
		} catch {
			sizes.set(src, undefined);
		}
	}
	return sizes.get(src);
}

export default {
	name: 'figure',
	element: {
		filter: ['p'],
		visit(node, ctx) {
			const content = node.children.filter(
				(child) => !(child.type === 'text' && child.value.trim() === '')
			);
			if (content.length !== 1) return;

			const img = content[0];
			if (img.type !== 'element' || img.tagName !== 'img') return;

			const { title, ...properties } = img.properties ?? {};
			const children = [
				{
					type: 'element',
					tagName: 'img',
					properties: { ...properties, ...intrinsicSize(properties.src), decoding: 'async' },
					children: [],
				},
			];

			if (title) {
				children.push({
					type: 'element',
					tagName: 'figcaption',
					properties: {},
					children: [{ type: 'text', value: title }],
				});
			}

			ctx.replaceNode(node, { type: 'element', tagName: 'figure', properties: {}, children });
		},
	},
};
