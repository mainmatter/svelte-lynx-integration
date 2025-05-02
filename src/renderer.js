import { createCustomRenderer } from 'svelte/renderer';

let pageId;

const event_reg_xp =
	/^(bind|catch|capture-bind|capture-catch|global-bind)([A-Za-z]+)$/;
const event_type_map = {
	bind: 'bindEvent',
	catch: 'catchEvent',
	'capture-bind': 'capture-bind',
	'capture-catch': 'capture-catch',
	'global-bind': 'global-bindEvent',
};

const parents = new WeakMap();

export function set_page_id(id) {
	pageId = id;
}

const create_element_map = new Map([
	['view', __CreateView],
	['scroll-view', __CreateScrollView],
	['text', __CreateText],
	['list', __CreateList],
	['image', __CreateImage],
]);

export default createCustomRenderer({
	createFragment() {
		return {
			kind: 'fragment',
		};
	},
	setAttribute(element, key, value) {
		if (key === 'style') {
			__SetInlineStyles(element, value);
		} else if (key === 'class') {
			__SetClasses(element, value);
		} else if (key.startsWith('data-')) {
			__AddDataset(element, key.slice(5), value);
		} else {
			__SetAttribute(element, key, value);
		}
		__FlushElementTree(element);
	},
	createElement(name) {
		const args = [pageId];
		if (!create_element_map.has(name)) {
			args.unshift(name);
		}
		if (name === 'list') {
			args.push((...args) => console.log('component at index', args));
			args.push((...args) => console.log('enqueue component', args));
		}
		return (create_element_map.get(name) ?? __CreateElement)(...args);
	},
	createTextNode(data) {
		return __CreateRawText(data);
	},
	setText(node, text) {
		__SetAttribute(node, 'text', text);
		__FlushElementTree(node);
	},
	createComment() {
		return __CreateNonElement(pageId);
	},
	getFirstChild(element) {
		if (element.kind === 'fragment') {
			return element.children?.[0];
		}
		return __FirstElement(element);
	},
	getNextSibling(element) {
		const parent = parents.get(element);
		if (parent && 'kind' in parent && parent.kind === 'fragment') {
			const idx = parent.children.findIndex((el) => el === element);
			return parent.children[idx + 1];
		}
		const sibling = __NextElement(element);
		return sibling;
	},
	insert(parent, element, anchor) {
		if (parent?.kind === 'fragment') {
			if (parent.children == null) {
				parent.children = [];
			}
			if (element.kind === 'fragment') {
				for (let child of element.children) {
					const idx = parent.children.findIndex(
						(el) => el === anchor
					);
					parent.children.splice(
						idx !== -1 ? idx : parent.children.length,
						0,
						child
					);
					parents.set(child, parent);
				}
			} else {
				const idx = parent.children.findIndex((el) => el === anchor);
				parent.children.splice(
					idx !== -1 ? idx : parent.children.length,
					0,
					element
				);
				parents.set(element, parent);
			}
		} else {
			for (let child of element.children ?? [element]) {
				__InsertElementBefore(parent, child, anchor);
				parents.set(child, parent);
			}
			__FlushElementTree(parent);
		}
	},
	remove(node) {
		if (!node) return;
		const parent = parents.get(node);
		if (parent.kind === 'fragment') {
			parent.children = parent.children.filter((el) => el !== node);
		} else {
			__RemoveElement(parent, node);
			__FlushElementTree(parent);
		}
	},
	getParent(element) {
		return parents.get(element) ?? __GetParent(element);
	},
	cloneNode(node) {
		return node;
	},
	addEventListener(element, event_name, handler) {
		let match = event_name.match(event_reg_xp);
		const event = event_type_map[match[1]];
		const name = match[2];
		__AddEvent(element, event, name, {
			type: 'worklet',
			value: handler,
		});
	},
});
