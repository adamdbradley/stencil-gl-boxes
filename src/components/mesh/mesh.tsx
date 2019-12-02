import { Component, Prop } from '@stencil/core';
import { box } from './box';
import { sceneState } from '../../store'
import { create, fromEuler, create$4, fromRotationTranslationScale, multiply, invert, transpose } from '../../gl';
import { Material } from '../../gl/material';


const vert_default = "#define GLSLIFY 1\nattribute vec3 position;\nattribute vec3 normal;\n\nvarying vec3 v_normal;\n\n#if defined(has_colormap) || defined(has_specularitymap) || defined(has_normalmap) || defined(has_bumpmap)\n#define has_textures true\n#endif\n\n#ifdef has_textures\nattribute vec2 uv;\nvarying vec2 v_uv;\n#endif\n\n#if defined(has_normalmap) || defined(has_bumpmap)\nvarying vec3 v_view_position;\n#endif\n\nvarying vec3 v_surface_to_light[NUM_LIGHTS];\n\n#ifdef has_specularity\nvarying vec3 v_surface_to_view[NUM_LIGHTS];\n#endif\n\n#ifdef USE_FOG\nvarying float v_fog_depth;\n#endif\n\nvoid main() {\n\tvec4 pos = vec4(position, 1.0);\n\tvec4 model_view_pos = VIEW * MODEL * pos;\n\n\tv_normal = (MODEL_INVERSE_TRANSPOSE * vec4(normal, 0.0)).xyz;\n\n\t#ifdef has_textures\n\tv_uv = uv;\n\t#endif\n\n\t#if defined(has_normalmap) || defined(has_bumpmap)\n\tv_view_position = model_view_pos.xyz;\n\t#endif\n\n\t#ifdef USE_FOG\n\tv_fog_depth = -model_view_pos.z;\n\t#endif\n\n\tfor (int i = 0; i < NUM_LIGHTS; i += 1) {\n\t\tPointLight light = POINT_LIGHTS[i];\n\n\t\tvec3 surface_world_position = (MODEL * pos).xyz;\n\t\tv_surface_to_light[i] = light.location - surface_world_position;\n\n\t\t#ifdef has_specularity\n\t\tv_surface_to_view[i] = CAMERA_WORLD_POSITION - surface_world_position;\n\t\t#endif\n\t}\n\n\tgl_Position = PROJECTION * model_view_pos;\n}"; // eslint-disable-line

const frag_default = `
varying vec3 v_normal;

void main() {
  gl_FragColor = vec4(mix(vec3(0.8), v_normal, 0.5), 1.0);
}
`;


@Component({
  tag: 'gl-mesh'
})
export class Mesh {

  @Prop() location = [0, 0, 0];
  @Prop() rotation = [0, 0, 0];
  @Prop() scale = 1;
  @Prop() geometry = box();
  @Prop() vert = vert_default;
  @Prop() frag = frag_default;
  @Prop() uniforms: any = {};
  @Prop() blend: any = undefined;
  @Prop() depthTest: any = undefined;
  @Prop() transparent = false;

  scene: any;
  layer: any;

  scale_array: number[];
  quaternion: any;
  matrix: any;
  model: any;
  defines: any;
  material_instance: any;
  geometry_instance: any;

  mesh = {
    model: null,
    geometry: null,
    model_inverse_transpose: null,
    material: null,
    transparent: null,
    destroy: null,
  };

  existing = true;

  add_mesh() {
    this.layer.add_mesh(this.mesh, this.existing);
    this.existing = false;
  }

  out2 = create();

  componentWillRender() {
    this.scene = sceneState.renderer;
    if (!this.scene || !this.scene.gl) {
      return;
    }

    this.layer = sceneState.layer;
    const { origin } = sceneState.parent;

    this.scale_array = [1, 1, 1];

    this.quaternion = fromEuler(this.quaternion || create$4(), ...this.rotation);

    this.matrix = fromRotationTranslationScale(this.matrix || create(), this.quaternion, this.location, this.scale_array);

    this.model = multiply(this.model || create(), origin, this.matrix);

    this.defines = Object.keys(this.uniforms).filter(k => this.uniforms[k] != null).map(k => `#define has_${k} true\n`).join("")

    if (!this.material_instance) {
      this.material_instance = new Material(this.scene, this.vert, this.frag, this.defines, this.blend, this.depthTest);
    }

    this.material_instance.set_uniforms(this.uniforms);

    if (!this.geometry_instance) {
      this.geometry_instance = this.geometry.instantiate(this.scene.gl, this.material_instance.program);
    }

    this.mesh.model = this.model;

    this.mesh.model_inverse_transpose = (invert(this.out2, this.model), transpose(this.out2, this.out2));

    this.mesh.material = this.material_instance;

    this.mesh.geometry = this.geometry_instance;

    this.mesh.transparent = this.transparent;

    if (this.existing) {
      this.add_mesh();
    }

    if (this.transparent) {
      this.layer.needs_transparency_sort = true;
    }

    this.scene.invalidate();
  }

  disconnectedCallback() {
    if (this.mesh) {
      this.mesh.destroy();
    }
  }

}
