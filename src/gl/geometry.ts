/**
 * Ported from @sveltejs/gl
 * MIT License
 * https://github.com/sveltejs/gl/blob/master/LICENSE
 */

class GeometryInstance {
	attributes: any;
	index: any;
	primitive: any;
	count: any;

	locations: any;
	buffers: any;

	constructor(gl, program, attributes, index, primitive, count) {
		this.attributes = attributes;
		this.index = index;
		this.primitive = primitive;
		this.count = count;

		this.locations = {};
		this.buffers = {};

		for (const key in attributes) {
			const attribute = attributes[key];

			this.locations[key] = gl.getAttribLocation(program, key);

			const buffer = gl.createBuffer();
			this.buffers[key] = buffer;

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, attribute.data, attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
		}

		if (index) {
			const buffer = gl.createBuffer();
			this.buffers.__index = buffer;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
		}
	}

	set_attributes(gl) {
		for (const key in this.attributes) {
			const attribute = this.attributes[key];

			const loc = this.locations[key];
			if (loc < 0) continue; // attribute is unused by current program

			const {
				size = 3,
				type = gl.FLOAT,
				normalized = false,
				stride = 0,
				offset = 0
			} = attribute;

			// Bind the position buffer.
			const buffer = this.buffers[key];

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

			// Turn on the attribute
			gl.enableVertexAttribArray(loc);

			gl.vertexAttribPointer(
				loc,
				size,
				type,
				normalized,
				stride,
				offset
			);
		}
	}
}

export class Geometry {
	attributes: any;
	index: any;
	instances: any;
	primitive: any;
	count: any;

	constructor(attributes = {}, opts: any = {}) {
		this.attributes = attributes;

		const { index, primitive = 'TRIANGLES' } = opts;
		this.index = index;
		this.primitive = primitive.toUpperCase();

		this.count = Infinity;
		for (const k in attributes) {
			const count = attributes[k].data.length / attributes[k].size;
			if (count < this.count) this.count = count;
		}

		if (this.count === Infinity) {
			throw new Error(`GL.Geometry must be instantiated with one or more { data, size } attributes`);
		}

		this.instances = new Map();
	}

	instantiate(gl, program) {
		if (!this.instances.has(program)) {
			this.instances.set(program, new GeometryInstance(
				gl,
				program,
				this.attributes,
				this.index,
				this.primitive,
				this.count
			));
		}

		return this.instances.get(program);
	}
}
