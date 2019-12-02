/**
 * Ported from @sveltejs/gl
 * MIT License
 * https://github.com/sveltejs/gl/blob/master/LICENSE
 */

export function process_color(color) {
	if (typeof color === 'number') {
		const r = (color & 0xff0000) >> 16;
		const g = (color & 0x00ff00) >> 8;
		const b = (color & 0x0000ff);

		return new Float32Array([
			r / 255,
			g / 255,
			b / 255
		]);
	}

	return color;
}

/**
* Multiplies two mat4s
*
* @param {mat4} out the receiving matrix
* @param {mat4} a the first operand
* @param {mat4} b the second operand
* @returns {mat4} out
*/
export function multiply(out, a, b) {
 var a00 = a[0],
     a01 = a[1],
     a02 = a[2],
     a03 = a[3];
 var a10 = a[4],
     a11 = a[5],
     a12 = a[6],
     a13 = a[7];
 var a20 = a[8],
     a21 = a[9],
     a22 = a[10],
     a23 = a[11];
 var a30 = a[12],
     a31 = a[13],
     a32 = a[14],
     a33 = a[15]; // Cache only the current line of the second matrix

 var b0 = b[0],
     b1 = b[1],
     b2 = b[2],
     b3 = b[3];
 out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
 out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
 out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
 out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
 b0 = b[4];
 b1 = b[5];
 b2 = b[6];
 b3 = b[7];
 out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
 out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
 out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
 out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
 b0 = b[8];
 b1 = b[9];
 b2 = b[10];
 b3 = b[11];
 out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
 out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
 out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
 out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
 b0 = b[12];
 b1 = b[13];
 b2 = b[14];
 b3 = b[15];
 out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
 out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
 out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
 out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
 return out;
}

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

export function identity(out) {
	out[0] = 1;
	out[1] = 0;
	out[2] = 0;
	out[3] = 0;
	out[4] = 0;
	out[5] = 1;
	out[6] = 0;
	out[7] = 0;
	out[8] = 0;
	out[9] = 0;
	out[10] = 1;
	out[11] = 0;
	out[12] = 0;
	out[13] = 0;
	out[14] = 0;
	out[15] = 1;
	return out;
}


/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
export function create(): any {
	var out = new ARRAY_TYPE(16);

	if (ARRAY_TYPE != Float32Array) {
		out[1] = 0;
		out[2] = 0;
		out[3] = 0;
		out[4] = 0;
		out[6] = 0;
		out[7] = 0;
		out[8] = 0;
		out[9] = 0;
		out[11] = 0;
		out[12] = 0;
		out[13] = 0;
		out[14] = 0;
	}

	out[0] = 1;
	out[5] = 1;
	out[10] = 1;
	out[15] = 1;
	return out;
}


/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
// var EPSILON = 0.000001;

if (!Math.hypot) Math.hypot = function () {
	var y = 0,
			i = arguments.length;

	while (i--) {
		y += arguments[i] * arguments[i];
	}

	return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */


/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

export function transpose(out, a) {
	// If we are transposing ourselves we can skip a few steps but have to cache some values
	if (out === a) {
		var a01 = a[1],
				a02 = a[2],
				a03 = a[3];
		var a12 = a[6],
				a13 = a[7];
		var a23 = a[11];
		out[1] = a[4];
		out[2] = a[8];
		out[3] = a[12];
		out[4] = a01;
		out[6] = a[9];
		out[7] = a[13];
		out[8] = a02;
		out[9] = a12;
		out[11] = a[14];
		out[12] = a03;
		out[13] = a13;
		out[14] = a23;
	} else {
		out[0] = a[0];
		out[1] = a[4];
		out[2] = a[8];
		out[3] = a[12];
		out[4] = a[1];
		out[5] = a[5];
		out[6] = a[9];
		out[7] = a[13];
		out[8] = a[2];
		out[9] = a[6];
		out[10] = a[10];
		out[11] = a[14];
		out[12] = a[3];
		out[13] = a[7];
		out[14] = a[11];
		out[15] = a[15];
	}

	return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

export function invert(out, a) {
	var a00 = a[0],
			a01 = a[1],
			a02 = a[2],
			a03 = a[3];
	var a10 = a[4],
			a11 = a[5],
			a12 = a[6],
			a13 = a[7];
	var a20 = a[8],
			a21 = a[9],
			a22 = a[10],
			a23 = a[11];
	var a30 = a[12],
			a31 = a[13],
			a32 = a[14],
			a33 = a[15];
	var b00 = a00 * a11 - a01 * a10;
	var b01 = a00 * a12 - a02 * a10;
	var b02 = a00 * a13 - a03 * a10;
	var b03 = a01 * a12 - a02 * a11;
	var b04 = a01 * a13 - a03 * a11;
	var b05 = a02 * a13 - a03 * a12;
	var b06 = a20 * a31 - a21 * a30;
	var b07 = a20 * a32 - a22 * a30;
	var b08 = a20 * a33 - a23 * a30;
	var b09 = a21 * a32 - a22 * a31;
	var b10 = a21 * a33 - a23 * a31;
	var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

	var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	if (!det) {
		return null;
	}

	det = 1.0 / det;
	out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
	return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */

export function translate(out, a, v) {
	var x = v[0],
			y = v[1],
			z = v[2];
	var a00, a01, a02, a03;
	var a10, a11, a12, a13;
	var a20, a21, a22, a23;

	if (a === out) {
		out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
		out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
		out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
		out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	} else {
		a00 = a[0];
		a01 = a[1];
		a02 = a[2];
		a03 = a[3];
		a10 = a[4];
		a11 = a[5];
		a12 = a[6];
		a13 = a[7];
		a20 = a[8];
		a21 = a[9];
		a22 = a[10];
		a23 = a[11];
		out[0] = a00;
		out[1] = a01;
		out[2] = a02;
		out[3] = a03;
		out[4] = a10;
		out[5] = a11;
		out[6] = a12;
		out[7] = a13;
		out[8] = a20;
		out[9] = a21;
		out[10] = a22;
		out[11] = a23;
		out[12] = a00 * x + a10 * y + a20 * z + a[12];
		out[13] = a01 * x + a11 * y + a21 * z + a[13];
		out[14] = a02 * x + a12 * y + a22 * z + a[14];
		out[15] = a03 * x + a13 * y + a23 * z + a[15];
	}

	return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */

export function fromRotationTranslationScale(out, q, v, s) {
	// Quaternion math
	var x = q[0],
			y = q[1],
			z = q[2],
			w = q[3];
	var x2 = x + x;
	var y2 = y + y;
	var z2 = z + z;
	var xx = x * x2;
	var xy = x * y2;
	var xz = x * z2;
	var yy = y * y2;
	var yz = y * z2;
	var zz = z * z2;
	var wx = w * x2;
	var wy = w * y2;
	var wz = w * z2;
	var sx = s[0];
	var sy = s[1];
	var sz = s[2];
	out[0] = (1 - (yy + zz)) * sx;
	out[1] = (xy + wz) * sx;
	out[2] = (xz - wy) * sx;
	out[3] = 0;
	out[4] = (xy - wz) * sy;
	out[5] = (1 - (xx + zz)) * sy;
	out[6] = (yz + wx) * sy;
	out[7] = 0;
	out[8] = (xz + wy) * sz;
	out[9] = (yz - wx) * sz;
	out[10] = (1 - (xx + yy)) * sz;
	out[11] = 0;
	out[12] = v[0];
	out[13] = v[1];
	out[14] = v[2];
	out[15] = 1;
	return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

export function perspective(out, fovy, aspect, near, far) {
	var f = 1.0 / Math.tan(fovy / 2),
			nf;
	out[0] = f / aspect;
	out[1] = 0;
	out[2] = 0;
	out[3] = 0;
	out[4] = 0;
	out[5] = f;
	out[6] = 0;
	out[7] = 0;
	out[8] = 0;
	out[9] = 0;
	out[11] = -1;
	out[12] = 0;
	out[13] = 0;
	out[15] = 0;

	if (far != null && far !== Infinity) {
		nf = 1 / (near - far);
		out[10] = (far + near) * nf;
		out[14] = 2 * far * near * nf;
	} else {
		out[10] = -1;
		out[14] = -2 * near;
	}

	return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */

export function targetTo(out, eye, target, up) {
	var eyex = eye[0],
			eyey = eye[1],
			eyez = eye[2],
			upx = up[0],
			upy = up[1],
			upz = up[2];
	var z0 = eyex - target[0],
			z1 = eyey - target[1],
			z2 = eyez - target[2];
	var len = z0 * z0 + z1 * z1 + z2 * z2;

	if (len > 0) {
		len = 1 / Math.sqrt(len);
		z0 *= len;
		z1 *= len;
		z2 *= len;
	}

	var x0 = upy * z2 - upz * z1,
			x1 = upz * z0 - upx * z2,
			x2 = upx * z1 - upy * z0;
	len = x0 * x0 + x1 * x1 + x2 * x2;

	if (len > 0) {
		len = 1 / Math.sqrt(len);
		x0 *= len;
		x1 *= len;
		x2 *= len;
	}

	out[0] = x0;
	out[1] = x1;
	out[2] = x2;
	out[3] = 0;
	out[4] = z1 * x2 - z2 * x1;
	out[5] = z2 * x0 - z0 * x2;
	out[6] = z0 * x1 - z1 * x0;
	out[7] = 0;
	out[8] = z0;
	out[9] = z1;
	out[10] = z2;
	out[11] = 0;
	out[12] = eyex;
	out[13] = eyey;
	out[14] = eyez;
	out[15] = 1;
	return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

export function create$1() {
	var out = new ARRAY_TYPE(3);

	if (ARRAY_TYPE != Float32Array) {
		out[0] = 0;
		out[1] = 0;
		out[2] = 0;
	}

	return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */

export function length(a) {
	var x = a[0];
	var y = a[1];
	var z = a[2];
	return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

// function fromValues(x, y, z) {
// 	var out = new ARRAY_TYPE(3);
// 	out[0] = x;
// 	out[1] = y;
// 	out[2] = z;
// 	return out;
// }
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */

export function normalize(out, a) {
	var x = a[0];
	var y = a[1];
	var z = a[2];
	var len = x * x + y * y + z * z;

	if (len > 0) {
		//TODO: evaluate use of glm_invsqrt here?
		len = 1 / Math.sqrt(len);
	}

	out[0] = a[0] * len;
	out[1] = a[1] * len;
	out[2] = a[2] * len;
	return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */

// function dot(a, b) {
// 	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
// }
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

// function cross(out, a, b) {
// 	var ax = a[0],
// 			ay = a[1],
// 			az = a[2];
// 	var bx = b[0],
// 			by = b[1],
// 			bz = b[2];
// 	out[0] = ay * bz - az * by;
// 	out[1] = az * bx - ax * bz;
// 	out[2] = ax * by - ay * bx;
// 	return out;
// }
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */

export function transformMat4(out, a, m) {
	var x = a[0],
			y = a[1],
			z = a[2];
	var w = m[3] * x + m[7] * y + m[11] * z + m[15];
	w = w || 1.0;
	out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
	out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
	out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
	return out;
}

/**
	* Creates a new identity quat
	*
	* @returns {quat} a new quaternion
	*/

export function create$4() {
	var out = new ARRAY_TYPE(4);

	if (ARRAY_TYPE != Float32Array) {
		out[0] = 0;
		out[1] = 0;
		out[2] = 0;
	}

	out[3] = 1;
	return out;
}/**
	* Creates a quaternion from the given euler angle x, y, z.
	*
	* @param {quat} out the receiving quaternion
	* @param {x} Angle to rotate around X axis in degrees.
	* @param {y} Angle to rotate around Y axis in degrees.
	* @param {z} Angle to rotate around Z axis in degrees.
	* @returns {quat} out
	* @function
	*/

export function fromEuler(out, x?: any, y?: any, z?: any) {
	var halfToRad = 0.5 * Math.PI / 180.0;
	x *= halfToRad;
	y *= halfToRad;
	z *= halfToRad;
	var sx = Math.sin(x);
	var cx = Math.cos(x);
	var sy = Math.sin(y);
	var cy = Math.cos(y);
	var sz = Math.sin(z);
	var cz = Math.cos(z);
	out[0] = sx * cy * cz - cx * sy * sz;
	out[1] = cx * sy * cz + sx * cy * sz;
	out[2] = cx * cy * sz - sx * sy * cz;
	out[3] = cx * cy * cz + sx * sy * sz;
	return out;
}
