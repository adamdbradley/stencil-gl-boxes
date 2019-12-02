import { Component, Prop, Build } from '@stencil/core';
import { sceneState } from '../../store';
import { create, translate, invert, perspective } from '../../gl';


@Component({
  tag: 'gl-perspective-camera',
})
export class PerspectiveCamera {

  @Prop() location = [0, 0, 0];
  @Prop() rotation = [0, 0, 0];
  @Prop() lookAt = null;
  @Prop() up = [0, 1, 0];
  @Prop() fov = 60;
  @Prop() near = 1;
  @Prop() far = 20000;

  camera = {
    matrix: null,
    world_position: null,
    view: null,
    projection: null,
  };

  componentWillLoad() {
    const { add_camera } = sceneState.renderer
    const { origin } = sceneState.parent;
    const { camera } = this;

    camera.matrix = create();
    camera.world_position = new Float32Array(camera.matrix.buffer, 12 * 4, 3);
    camera.view = create();
    camera.projection = create();

    camera.matrix = translate(camera.matrix, origin, this.location);

    camera.view = invert(camera.view, this.camera.matrix);

    camera.projection = perspective(
      camera.projection,
      this.fov / 180 * Math.PI,
      400 / 400,
      this.near,
      this.far
    )

    add_camera(this.camera);
  }

}
