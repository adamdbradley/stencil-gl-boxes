import { createStore } from '@stencil/store';

const sceneStore = createStore({
	renderer: null as any,
	layer: null as any,
	parent: null as any,
});
export const sceneState = sceneStore.state;