import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'https://stencil-gl-boxes.now.sh/',
    }
  ]
};
