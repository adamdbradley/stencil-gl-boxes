/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface GlDirectionalLight {
    'color': number[];
    'direction': number[];
    'intensity': number;
  }
  interface GlMesh {
    'blend': any;
    'depthTest': any;
    'frag': string;
    'geometry': any;
    'location': number[];
    'rotation': number[];
    'scale': number;
    'transparent': boolean;
    'uniforms': any;
    'vert': string;
  }
  interface GlPerspectiveCamera {
    'far': number;
    'fov': number;
    'location': number[];
    'lookAt': any;
    'near': number;
    'rotation': number[];
    'up': number[];
  }
  interface GlScene {
    'background': number[];
    'backgroundOpacity': number;
    'fog': number;
    'pixelRatio': any;
  }
  interface StencilGlBoxes {}
}

declare global {


  interface HTMLGlDirectionalLightElement extends Components.GlDirectionalLight, HTMLStencilElement {}
  var HTMLGlDirectionalLightElement: {
    prototype: HTMLGlDirectionalLightElement;
    new (): HTMLGlDirectionalLightElement;
  };

  interface HTMLGlMeshElement extends Components.GlMesh, HTMLStencilElement {}
  var HTMLGlMeshElement: {
    prototype: HTMLGlMeshElement;
    new (): HTMLGlMeshElement;
  };

  interface HTMLGlPerspectiveCameraElement extends Components.GlPerspectiveCamera, HTMLStencilElement {}
  var HTMLGlPerspectiveCameraElement: {
    prototype: HTMLGlPerspectiveCameraElement;
    new (): HTMLGlPerspectiveCameraElement;
  };

  interface HTMLGlSceneElement extends Components.GlScene, HTMLStencilElement {}
  var HTMLGlSceneElement: {
    prototype: HTMLGlSceneElement;
    new (): HTMLGlSceneElement;
  };

  interface HTMLStencilGlBoxesElement extends Components.StencilGlBoxes, HTMLStencilElement {}
  var HTMLStencilGlBoxesElement: {
    prototype: HTMLStencilGlBoxesElement;
    new (): HTMLStencilGlBoxesElement;
  };
  interface HTMLElementTagNameMap {
    'gl-directional-light': HTMLGlDirectionalLightElement;
    'gl-mesh': HTMLGlMeshElement;
    'gl-perspective-camera': HTMLGlPerspectiveCameraElement;
    'gl-scene': HTMLGlSceneElement;
    'stencil-gl-boxes': HTMLStencilGlBoxesElement;
  }
}

declare namespace LocalJSX {
  interface GlDirectionalLight {
    'color'?: number[];
    'direction'?: number[];
    'intensity'?: number;
  }
  interface GlMesh {
    'blend'?: any;
    'depthTest'?: any;
    'frag'?: string;
    'geometry'?: any;
    'location'?: number[];
    'rotation'?: number[];
    'scale'?: number;
    'transparent'?: boolean;
    'uniforms'?: any;
    'vert'?: string;
  }
  interface GlPerspectiveCamera {
    'far'?: number;
    'fov'?: number;
    'location'?: number[];
    'lookAt'?: any;
    'near'?: number;
    'rotation'?: number[];
    'up'?: number[];
  }
  interface GlScene {
    'background'?: number[];
    'backgroundOpacity'?: number;
    'fog'?: number;
    'pixelRatio'?: any;
  }
  interface StencilGlBoxes {}

  interface IntrinsicElements {
    'gl-directional-light': GlDirectionalLight;
    'gl-mesh': GlMesh;
    'gl-perspective-camera': GlPerspectiveCamera;
    'gl-scene': GlScene;
    'stencil-gl-boxes': StencilGlBoxes;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'gl-directional-light': LocalJSX.GlDirectionalLight & JSXBase.HTMLAttributes<HTMLGlDirectionalLightElement>;
      'gl-mesh': LocalJSX.GlMesh & JSXBase.HTMLAttributes<HTMLGlMeshElement>;
      'gl-perspective-camera': LocalJSX.GlPerspectiveCamera & JSXBase.HTMLAttributes<HTMLGlPerspectiveCameraElement>;
      'gl-scene': LocalJSX.GlScene & JSXBase.HTMLAttributes<HTMLGlSceneElement>;
      'stencil-gl-boxes': LocalJSX.StencilGlBoxes & JSXBase.HTMLAttributes<HTMLStencilGlBoxesElement>;
    }
  }
}


