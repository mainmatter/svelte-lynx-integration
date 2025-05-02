import Todos from './Todos.svelte';
import renderer, { set_page_id } from './renderer.js';

globalThis.queueMicrotask = function (callback) {
	Promise.resolve().then(callback);
};

globalThis.renderPage = function () {
	let page = __CreatePage('0', 0);
	let pageId = __GetElementUniqueID(page);

	set_page_id(pageId);

	const fragment = renderer.createFragment();
	renderer.render(Todos, { target: fragment });
	renderer.insert(page, fragment, null);
};

globalThis.updatePage = function () {};

globalThis.processData = function () {};

globalThis.runWorklet = function (value, params) {
	if (typeof value === 'function') {
		value(...params);
	}
};
