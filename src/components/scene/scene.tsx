import { Component, Host, h, Prop, Build } from '@stencil/core';
import { createStore } from '@stencil/store';
import { create_layer } from './layer';
import { identity, create, multiply, process_color } from '../../gl';
import { sceneState } from '../../store';


const num_lights = 8;

@Component({
  tag: 'gl-scene',
  styleUrl: 'scene.css',
})
export class Scene {
  @Prop() background = [255, 255, 255];
  @Prop() backgroundOpacity = 0;
  @Prop() fog = 0;
  @Prop() pixelRatio: any;

  canvas: HTMLCanvasElement;

	constructor() {
		sceneInstance(this);
	}

  render() {
    return (
      <Host>
				<canvas
					ref={el => this.canvas = el}
					width="1200"
					height="1200"
				/>
      </Host>
    );
  }

}

function sceneInstance($$self: Scene) {
	let $width;
	let $height;

	let { background = [255, 255, 255] } = $$self;
	let { backgroundOpacity = 0 } = $$self;
	let { pixelRatio = undefined } = $$self;
	const use_fog = false;
	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext;
	let draw;

	let camera_stores = createStore({
		camera_matrix: {} as any,
		view: {} as any,
		projection: {} as any,
	}).state;

	const invalidate = typeof window !== "undefined"
	? () => {
			if (!update_scheduled) {
				update_scheduled = true;
				resolved.then(draw);
			}
		}
	: () => {};

	const root_layer = create_layer(0, invalidate);
	const default_camera: any = {};
	let camera = default_camera;
	const meshes = [];
	const lights = { ambient: [], directional: [], point: [] };
	let update_scheduled = false;
	let resolved = Promise.resolve();

	function add_to(array) {
		return fn => {
			array.push(fn);
			invalidate();
		};
	}

	const targets = new Map();
	let camera_position_changed_since_last_render = true;

	const scene = {
		defines: [`#define NUM_LIGHTS 2\n` + `#define USE_FOG ${use_fog}\n`].join(""),
		add_camera: _camera => {
			if (camera && camera !== default_camera) {
				throw new Error(`A scene can only have one camera`);
			}

			camera = _camera;
			invalidate();
			camera_stores.camera_matrix = camera.matrix;
			camera_stores.projection = camera.projection;
			camera_stores.view = camera.view;
		},
		update_camera: camera => {
			camera_stores.camera_matrix = camera.matrix;
			camera_stores.view = camera.view;
			camera_stores.projection = camera.projection;
			camera_position_changed_since_last_render = true;
			invalidate();
		},
		add_directional_light: add_to(lights.directional),
		add_point_light: add_to(lights.point),
		add_ambient_light: add_to(lights.ambient),
		get_target(id) {
      if (!targets.has(id)) targets.set(id, null);
			return targets.get(id);
		},
		invalidate,
		...camera_stores,
		width: null,
		height: null,
		canvas: null as HTMLCanvasElement,
		gl: null as WebGLRenderingContext
	};

	sceneState.renderer = scene;
	sceneState.layer = root_layer;

	const origin = identity(create());

	sceneState.parent = {
		get_matrix_world: () => origin,
		ctm: { subscribe: () => origin },
		origin,
  };

	($$self as any).componentDidLoad = () => {
		scene.canvas = canvas = $$self.canvas;
		scene.gl = gl = canvas.getContext("webgl");
		const extensions = ["OES_element_index_uint", "OES_standard_derivatives"];

		extensions.forEach(name => {
			const ext = gl.getExtension(name);

			if (!ext) {
				throw new Error(`Unsupported extension: ${name}`);
			}
		});

		draw = force => {
			if (!camera || !camera.world_position) return;

			if (dimensions_need_update) {
				const DPR = pixelRatio || window.devicePixelRatio || 1;

				$width = canvas.clientWidth;
				$height = canvas.clientHeight;

				gl.viewport(0, 0, $width * DPR, $height * DPR);
				dimensions_need_update = false;
			}

			update_scheduled = false;

			(gl as any).clearColor(...bg, backgroundOpacity);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.enable(gl.CULL_FACE);
			gl.enable(gl.BLEND);

			const ambient_light = lights.ambient.reduce(
				(total, { color, intensity }) => {
					return [
						Math.min(total[0] + color[0] * intensity, 1),
						Math.min(total[1] + color[1] * intensity, 1),
						Math.min(total[2] + color[2] * intensity, 1)
					];
				},
				new Float32Array([0, 0, 0])
			);

			let previous_program;

			function render_mesh({ model, model_inverse_transpose, geometry, material }) {
				if (!material) return;

				if (material.depthTest !== false) {
					gl.enable(gl.DEPTH_TEST);
				} else {
					gl.disable(gl.DEPTH_TEST);
				}

				gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE);

				if (material.program !== previous_program) {
					previous_program = material.program;
					gl.useProgram(material.program);
					gl.uniform3fv(material.uniform_locations.AMBIENT_LIGHT, ambient_light);

					if (material.uniform_locations.DIRECTIONAL_LIGHTS) {
						for (let i = 0; i < num_lights; i += 1) {
							const light = lights.directional[i];
							if (!light) break;
							gl.uniform3fv(material.uniform_locations.DIRECTIONAL_LIGHTS[i].direction, light.direction);
							gl.uniform3fv(material.uniform_locations.DIRECTIONAL_LIGHTS[i].color, light.color);
							gl.uniform1f(material.uniform_locations.DIRECTIONAL_LIGHTS[i].intensity, light.intensity);
						}
					}

					if (material.uniform_locations.POINT_LIGHTS) {
						for (let i = 0; i < num_lights; i += 1) {
							const light = lights.point[i];
							if (!light) break;
							gl.uniform3fv(material.uniform_locations.POINT_LIGHTS[i].location, light.location);
							gl.uniform3fv(material.uniform_locations.POINT_LIGHTS[i].color, light.color);
							gl.uniform1f(material.uniform_locations.POINT_LIGHTS[i].intensity, light.intensity);
						}
					}

					gl.uniform3fv(material.uniform_locations.CAMERA_WORLD_POSITION, camera.world_position);
					gl.uniformMatrix4fv(material.uniform_locations.VIEW, false, camera.view);
					gl.uniformMatrix4fv(material.uniform_locations.PROJECTION, false, camera.projection);
				}

				gl.uniformMatrix4fv(material.uniform_locations.MODEL, false, model);
				gl.uniformMatrix4fv(material.uniform_locations.MODEL_INVERSE_TRANSPOSE, false, model_inverse_transpose);
				material.apply_uniforms(gl);
				geometry.set_attributes(gl);

				if (geometry.index) {
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.buffers.__index);
					gl.drawElements(gl[geometry.primitive], geometry.index.length, gl.UNSIGNED_INT, 0);
				} else {
					const primitiveType = gl[geometry.primitive];
					gl.drawArrays(primitiveType, 0, geometry.count);
				}
			}

			function render_layer(layer) {
				if (layer.needs_sort) {
					layer.child_layers.sort((a, b) => a.index - b.index);
					layer.needs_sort = false;
				}

				gl.depthMask(true);
				gl.clearDepth(1);
				gl.clear(gl.DEPTH_BUFFER_BIT);

				for (let i = 0; i < layer.meshes.length; i += 1) {
					render_mesh(layer.meshes[i]);
				}

				gl.depthMask(false);

				if (camera_position_changed_since_last_render || layer.needs_transparency_sort) {
					sort_transparent_meshes(layer.transparent_meshes);
					layer.needs_transparency_sort = false;
				}

				for (let i = 0; i < layer.transparent_meshes.length; i += 1) {
					render_mesh(layer.transparent_meshes[i]);
				}

				for (let i = 0; i < layer.child_layers.length; i += 1) {
					render_layer(layer.child_layers[i]);
				}
			}

			render_layer(root_layer);
			camera_position_changed_since_last_render = false;
		};

		setTimeout(() => {
			$width = canvas.clientWidth
			$height = canvas.clientHeight
		});

		Promise.resolve().then(() => draw(true));
	};

	const sort_transparent_meshes = meshes => {
		if (meshes.length < 2) return;
		const lookup = new Map();
		const out = new Float32Array(16);

		meshes.forEach(mesh => {
			const z = multiply(out, camera.view, mesh.model)[14];
			lookup.set(mesh, z);
		});

		meshes.sort((a, b) => lookup.get(a) - lookup.get(b));
	};

	let dimensions_need_update = true;

	const update_dimensions = () => {
		dimensions_need_update = true;
		invalidate();
	};

	let bg = process_color(background);

	// $$self.$$.update = () => {
	// 	if ($$self.$$.dirty[0] & /*background*/ 128) {
	// 			bg = process_color(background);
	// 	}

	// 	if ($$self.$$.dirty[0] & /*$width, $height*/ 24) {
				(update_dimensions());
	// 	}

}
