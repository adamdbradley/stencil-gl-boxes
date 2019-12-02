import { Component, h, State, Host } from '@stencil/core';


@Component({
  tag: 'stencil-gl-boxes',
})
export class StencilGLBoxes {

  counts = [100, 200, 500, 1000, 2000, 5000, 10000, 20000];
  cameraLocation = [0, 0, 3.2];
  light = [0, 0, 3.2];

  count = this.counts[0];
  @State() boxes = Array(this.count).fill(0).map(() => [random(), random(), random()]);

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

  changeCount = (ev: UIEvent) => {
    this.count = parseInt((ev.target as HTMLSelectElement).value, 10);
    this.boxes = Array(this.count).fill(0).map(() => [random(), random(), random()]);
  };

  render() {
    return (
      <Host>
        <gl-scene>
          <gl-perspective-camera location={this.cameraLocation} />
          <gl-directional-light direction={this.light} />
          {this.boxes.map(box => (
            <gl-mesh rotation={box} />
          ))}
        </gl-scene>
        <select onChange={this.changeCount}>
          {this.counts.map(c => (
            <option value={c}>{c}</option>
          ))}
        </select>
      </Host>
    );
  }
}

const random = () => Math.random() * 360;
