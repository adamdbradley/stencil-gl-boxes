import { Component, h, State } from '@stencil/core';


@Component({
  tag: 'stencil-gl-boxes',
})
export class StencilGLBoxes {

  count = 2000;
  cameraLocation = [0, 0, 3.2];
  light = [0, 0, 3.2];

  @State() boxes = Array(this.count).fill(0).map(() => [random(), random(), random()])

  loop = () => {
    this.boxes = this.boxes.map(box =>
      [
        box[0] += 0.5,
        box[1] += 0.5,
        box[2] += 0.5,
      ]
    );
    requestAnimationFrame(this.loop);
  };

  componentDidLoad() {
    requestAnimationFrame(this.loop);
  }

  render() {
    return (
      <gl-scene>
        <gl-perspective-camera location={this.cameraLocation} />
        <gl-directional-light direction={this.light} />
        {this.boxes.map(box => (
          <gl-mesh rotation={box} />
        ))}
      </gl-scene>
    );
  }
}

const random = () => Math.random() * 360;
