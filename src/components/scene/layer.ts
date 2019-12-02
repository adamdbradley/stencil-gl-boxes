/**
 * Ported from @sveltejs/gl
 * MIT License
 * https://github.com/sveltejs/gl/blob/master/LICENSE
 */


export function create_layer(_index, invalidate) {
	let child_index = 0;

	const meshes = [];
	const transparent_meshes = [];
	const child_layers = [];

	const layer = {
		index: 0,
		meshes,
		transparent_meshes,
		child_layers,
		needs_sort: false,
		needs_transparency_sort: true,
		add_mesh: (mesh, existing) => {
			if (existing) {
				// remove_item(mesh.transparent ? meshes : transparent_meshes, mesh);
			}

			if (mesh.transparent) {
				transparent_meshes.push(mesh);
				layer.needs_transparency_sort = true;
			} else {
				meshes.push(mesh);
			}

			mesh.destroy = () => {
				remove_item(meshes, mesh);
				remove_item(transparent_meshes, mesh);
				invalidate();
			}
		},
		add_child: (index = child_index++) => {
			const child_layer = create_layer(index, invalidate);
			child_layers.push(child_layer);

			layer.needs_sort = true;

			return child_layer;
		}
	};

	return layer;
}

function remove_index(array, index) {
	array[index] = array[array.length - 1];
	array.pop();
}

function remove_item(array, item) {
	const index = array.indexOf(item);
	if (~index) remove_index(array, index);
}
