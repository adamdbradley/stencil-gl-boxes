import { Component, Prop, Build } from '@stencil/core';
import { sceneState } from '../../store';
import { process_color, normalize, transformMat4, create$1 } from '../../gl';


@Component({
  tag: 'gl-directional-light',
})
export class DirectionalLight {

	@Prop() direction = [-1, -1, -1];
	@Prop() color = [1, 1, 1];
	@Prop() intensity = 1;

  multiplied: any;

  componentWillLoad() {
    if (!Build.isBrowser) {
      return;
    }
    const scene = sceneState.renderer;
    const { ctm } = sceneState.parent;

    this.multiplied = transformMat4(this.multiplied || create$1(), new Float32Array(this.direction), ctm);

    const light = {} as any;
    light.direction = normalize(light.direction || create$1(), this.multiplied);
    light.color = process_color(new Float32Array(this.color));
    light.intensity = this.intensity;

    scene.add_directional_light(light);
  }

}
