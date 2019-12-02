# Stencil GL Boxes Demo

[Demo](https://stencil-gl-boxes.now.sh)

__Experiemental!!__ This repo is purely an experiment with [Stencil](https://stenciljs.com/) and [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API).

Stencil GL Boxes is a quick port of [React's](https://github.com/react-spring/) and [Svelte's](https://github.com/Rich-Harris/svelte-gl-boxes) WebGL demo. Huge thanks to [Paul Henschel](https://github.com/drcmda) and [Rich Harris](https://github.com/Rich-Harris) for pioneering and leading innovation with WebGL and frameworks, and making their code available for review. This demo could not have been put together without their efforts.


## What's the point?

While a vanilla [three.js](https://threejs.org/) example could be written with no framework or reactivity, the purpose of this demo is to show Stencil's ability to handle rendering and re-rendering thousands of components under heavy conditions while keeping the animation smooth. This demo intentionally did not cut corners to improve the demo's performance, but rather uses Stencil features for rendering and reactivity. By default it's generating 2,000 boxes and rotating each one every frame.

I could very well be mistaken and missing something obvious 😬 Please hit me up on [twitter](https://twitter.com/adamdbradley) if that's the case!


## Optimizations

Many optimizations could be done to this app to improve performance for this use-case. However, this demo shows what a Stencil can do before any optimizations, rather than just trying to make _this_ demo work well. No modifications have been done to Stencil, and I'm sure this app could have a WebGL expert make many more improvements.


## Reactivity

Stencil's reactivity is from getters and setters placed on component instances, similar to [Vue](https://vuejs.org/). Component-level re-rendering occurs only when a value changes. Rendering is not at the application level, but rather individual components will only render if a property changes. In this demo, a `requestAnimationFrame()` loop is changing the rotation of each box, which then passees that information down to the thousands of boxes.


## VDom

Stencil's renderer is a VDom implementation forked from [Snabbdom](https://github.com/snabbdom/snabbdom) and the `h()` function is forked from [Preact](https://preactjs.com/). We've made many modifications to them, however, I'd imagine most of the performance comes straight from the awesome work done by the Snabbodm and Preact projects.


## Async Rendering Queue

Stencil uses an asynchronous rendering queue that's built-in by default. Developers do not need to adjust their components in order to take advantage of this because it's just how Stencil works. This demo helps show how async rendering assists in preventing jank and maintaining smooth animations.


## File Size

A large reason why Stencil's GL Boxes demo is only __12kb__ can be directly attributed to the [@sveltejs/gl](https://github.com/sveltejs/gl) project, and its use of [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) rather than CommonJS.

That said, Stencil itself is also quite small, and only generates runtime for what the component is actually using. In this case, the component isn't using much at all, except the VDom renderer and reactive properties.


## WebGL and Libraries

Stencil handles this demo quite well, but I don't think that a DOM manipulation library is the right tool for the job. This was simply an experiment and it helped me form some opinions about libraries and WebGL.

WebGL is not about passing one by one data to the GPU like the dom works, but "binding data" into buffers or textures and passing all at once. Instead, direct APIs, such as WebGPU should be used instead (in some computers, it even works by mapping some address space in the GPU):
![WebGPU Triangles Benchmark](https://webkit.org/wp-content/uploads/WSLTrianglesBenchmark.png)

The approach where a prop changes, then the frameworks schedules an update and asyncronously pass data to the GPU is not how GL was designed to work. Most game engines work by computing in the CPU and little as possible (caching a lot of things), then in a single step, pass data to the GPU.

Within the GPU, you have some options:

- Rastering (triangles: built into the apis)
- Shading
- A combinations of both

You want 10 million particules? An iPhone can do that in a shader. Point is to pick the correct tool for the job.

Big thanks to [@manucorporat](https://twitter.com/manucorporat) for helping to point this out.


## Thoughts

If you're building a 3D Game for the web, it's probably best to use [three.js](https://threejs.org/) directly, but that's not what this demo was about. This demo is more about seeing what happens when Stencil is actively re-rendering thousands of nodes while the browser is heavily tasked. The results speak for themselves and are quite encouraging, especially when the end result is a simple web component that's roughly 12kb.

Quick thought about micro-benchmarks: It's widely known that React is "fast enough". Even when compared to the next iteration of React and its async scheduler, Stencil appears to perform quite well along side it.

However, I'd rather not focus too much on this, because again, React is fast enough already, and React appears to get even better with its async scheduler.

I'm quite certain Stencil could put a lot more time into removing a few more nanoseconds _"in the name performance"_. However, time and efforts should go to other places since all frameworks are fast now, and micro-benchmarks can sometimes lead to misleading information. Instead of focusing on these nanoseconds, I'd rather see the community, frameworks and libraries focus on reducing filesize, improving startup times, and further embracing web-standards and ESM.

**Conclusion:**

- Stencil's VDom is fast.
- Async-rendering helps Stencil prevent jank.
- Less code is fast code.
- ES Modules rock.
- We have no plans to provide a "Stencil" WebGL library, just use [three.js](https://threejs.org/).
- Don't read too much into micro-benchmarks.
- Stay cool.


## Local Build

    npm install
    npm start


## References

- [Stencil](https://stenciljs.com/)
- [three.js](https://threejs.org/)
- [Snabbdom](https://github.com/snabbdom/snabbdom)
- [React Three Fiber](https://github.com/react-spring/react-three-fiber)
- [Svelte GL Boxes](https://github.com/Rich-Harris/svelte-gl-boxes)
- [@sveltejs/gl](https://github.com/sveltejs/gl)
- [Vue](https://vuejs.org/)
- [Preact](https://preactjs.com/)