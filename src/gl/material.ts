/**
 * Ported from @sveltejs/gl
 * MIT License
 * https://github.com/sveltejs/gl/blob/master/LICENSE
 */

import { process_color } from "./util";

var vert_builtin = "/* start builtins */\nprecision highp float;\n#define GLSLIFY 1\n\nuniform mat4 MODEL;\nuniform mat4 PROJECTION;\nuniform mat4 VIEW;\nuniform mat4 MODEL_INVERSE_TRANSPOSE;\n\nuniform vec3 CAMERA_WORLD_POSITION;\n\nstruct PointLight {\n\tvec3 location;\n\tvec3 color;\n\tfloat intensity;\n\t// TODO fall-off etc\n};\n\nuniform PointLight POINT_LIGHTS[NUM_LIGHTS];\n/* end builtins *//* end builtins *//* end builtins *//* end builtins */"; // eslint-disable-line

var frag_builtin = "#extension GL_OES_standard_derivatives : enable\n\n/* start builtins */\nprecision highp float;\n#define GLSLIFY 1\n\nstruct DirectionalLight {\n\tvec3 direction;\n\tvec3 color;\n\tfloat intensity;\n};\n\nstruct PointLight {\n\tvec3 location;\n\tvec3 color;\n\tfloat intensity;\n\t// TODO fall-off etc\n};\n\nuniform vec3 AMBIENT_LIGHT;\nuniform DirectionalLight DIRECTIONAL_LIGHTS[NUM_LIGHTS];\nuniform PointLight POINT_LIGHTS[NUM_LIGHTS];\n/* end builtins *//* end builtins *//* end builtins *//* end builtins */"; // eslint-disable-line

const caches = new Map();

const setters = {
	[5126]:  (gl, loc, data) => gl.uniform1f(loc, data),
	[35664]: (gl, loc, data) => gl.uniform2fv(loc, data),
	[35665]: (gl, loc, data) => gl.uniform3fv(loc, data),
	[35666]: (gl, loc, data) => gl.uniform4fv(loc, data),

	[35674]: (gl, loc, data) => gl.uniformMatrix2fv(loc, false, data),
	[35675]: (gl, loc, data) => gl.uniformMatrix3fv(loc, false, data),
	[35676]: (gl, loc, data) => gl.uniformMatrix4fv(loc, false, data),

	[35678]: (gl, loc, data) => {
		gl.activeTexture(gl[`TEXTURE${data.index}`]);
		gl.bindTexture(gl.TEXTURE_2D, data.texture);
		gl.uniform1i(loc, data.index);
	}
};


function pad(num, len = 4) {
	num = String(num);
	while (num.length < len) num = ` ${num}`;
	return num;
}

function repeat(str, i) {
	let result = '';
	while (i--) result += str;
	return result;
}

function create_shader(gl, type, source, label) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	}

	const log = gl.getShaderInfoLog(shader);
	const match = /ERROR: (\d+):(\d+): (.+)/.exec(log);

	if (match) {
		const c = +match[1];
		const l = +match[2] - 1;

		console.log('%c' + match[3], 'font-weight: bold; color: red');

		const lines = source.split('\n');
		for (let i = 0; i < lines.length; i += 1) {
			if (Math.abs(l - i) > 5) continue;

			const line = lines[i].replace(/^\t+/gm, tabs => repeat(' ', tabs.length * 4));
			const indent = /^\s+/.exec(line);

			const str = `${pad(i)}: ${line}`;

			if (i === l) {
				console.log('%c' + str, 'font-weight: bold; color: red');
				console.log('%c' + (indent && indent[0] || '') + repeat(' ', c + 6) + '^', 'color: red');
			} else {
				console.log(str);
			}
		}

		throw new Error(`Failed to compile ${label} shader`);
	}

	throw new Error(`Failed to compile ${label} shader:\n${log}`);
}


function get_attributes(gl, program) {
	const attributes = [];

	const n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

	for (let i = 0; i < n; i += 1) {
		let { size, type, name } = gl.getActiveAttrib(program, i);
		name = name.replace('[0]', '');
		const loc = gl.getAttribLocation(program, name);

		attributes.push({ size, type, name, loc });
	}

	return attributes;
}


function deep_set(obj, path, value) {
	const parts = path.replace(/\]$/, '').split(/\[|\]\.|\./);

	while (parts.length > 1) {
		const part = parts.shift();
		const next = parts[0];

		if (!obj[part]) obj[part] = /^\d+$/.test(next) ? [] : {};
		obj = obj[part];
	}

	obj[parts[0]] = value;
}

function create_program(gl, vert, frag) {
	const program = gl.createProgram();

	gl.attachShader(program, create_shader(gl, gl.VERTEX_SHADER, vert, 'vertex'));
	gl.attachShader(program, create_shader(gl, gl.FRAGMENT_SHADER, frag, 'fragment'));
	gl.linkProgram(program);

	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
		console.log(gl.getProgramInfoLog(program));
		throw new Error(`Failed to compile program:\n${gl.getProgramInfoLog(program)}`);
	}

	return program;
}

function get_uniforms(gl, program) {
	const uniforms = [];

	const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

	for (let i = 0; i < n; i += 1) {
		let { size, type, name } = gl.getActiveUniform(program, i);
		const loc = gl.getUniformLocation(program, name);
		const setter = setters[type];

		if (!setter) {
			throw new Error(`not implemented ${type} (${name})`);
		}

		uniforms.push({ size, type, name, setter, loc });
	}

	return uniforms;
}

function compile(gl, vert, frag) {
	if (!caches.has(gl)) caches.set(gl, new Map());
	const cache = caches.get(gl);

	const hash = vert + frag;
	if (!cache.has(hash)) {
		const program = create_program(gl, vert, frag);
		const uniforms = get_uniforms(gl, program);
		const attributes = get_attributes(gl, program);

		cache.set(hash, { program, uniforms, attributes });
	}

	return cache.get(hash);
}

export class Material {
	values: any;
	scene: any;
	gl: any;
	blend: any;
	depthTest: any;
	program: any;
	uniforms: any;
	attributes: any;
	uniform_locations: any;
	attribute_locations: any;
	raw_values: any;

	constructor(scene, vert, frag, defines, blend, depthTest) {
		this.scene = scene;

		const gl = scene.gl;
		this.gl = gl;

		this.blend = blend;
		this.depthTest = depthTest;

		const { program, uniforms, attributes } = compile(
			gl,
			scene.defines + defines + '\n\n' + vert_builtin + '\n\n' + vert,
			scene.defines + defines + '\n\n' + frag_builtin + '\n\n' + frag
		);

		this.program = program;
		this.uniforms = uniforms;
		this.attributes = attributes;

		this.uniform_locations = {};
		this.uniforms.forEach(uniform => {
			deep_set(this.uniform_locations, uniform.name, gl.getUniformLocation(this.program, uniform.name));
		});

		this.attribute_locations = {};
		this.attributes.forEach(attribute => {
			this.attribute_locations[attribute.name] = gl.getAttribLocation(this.program, attribute.name);
		});

		this.raw_values = {};
		this.values = {};
	}

	set_uniforms(raw_values) {
		let texture_index = 0;

		this.uniforms.forEach(({ name, type, _loc, _setter, _processor }) => {
			if (name in raw_values) {
				let data = raw_values[name];

				if (data === this.raw_values[name]) return;

				if (type === 35678) {
					// texture
					this.values[name] = {
						texture: data.instantiate(this.scene)._,
						index: texture_index++
					};

					return;
				}

				if (typeof data === 'number' && type !== 5126) {
					// data provided was a number like 0x123456,
					// but it needs to be an array. for now,
					// assume it's a color, i.e. vec3
					data = process_color(data);
				}

				this.values[name] = data;
			}
		});

		this.raw_values = raw_values;
	}

	apply_uniforms(gl, _builtins) {
		// TODO if this is the only program, maybe
		// we don't need to re-run this each time
		this.uniforms.forEach(uniform => {
			if (uniform.name in this.values) {
				uniform.setter(gl, uniform.loc, this.values[uniform.name]);
			}
		});
	}

}
