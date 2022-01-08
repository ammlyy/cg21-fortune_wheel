
async function init() {
	var path = window.location.pathname;
	var page = path.split("/").pop();
	baseDir = window.location.href.replace(page, '');
	shaderDir = baseDir + "shaders/";
	gl = document.getElementById("canva").getContext("webgl2")

	if (!gl) {
		console.log("webgl2 context not found")
		return
	}

	// Load all meshes and pushes in var meshes
	await commons.loadAllMeshes()

	await commons.loadShaders(shaderDir)
	gl.useProgram(program);

	// Get all uniforms locations
	commons.setupUniforms()

	//load all texture files and occlusion maps
	commons.loadTextures()
	commons.loadOcclusions()

	for (let i = 0; i < meshes.length; i++) {
		commons.fillBuffers(i)
	}

	main()

}

function main() {
	//setup global states
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0.85, 0.85, 0.85, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);

	var lastUpdateTime = (new Date).getTime();

	var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

	drawScene();

	function animate() {
		var currentTime = (new Date).getTime();

		if (lastUpdateTime && startSpinning) { // if the wheel is spinning, update the animation time and the last rotation value
			var t = ((currentTime - lastUpdateTime) / 1000.0)
			g_time += (utils.ExponentialImpulse(g_time + t, 1.0) / 100.0)
			last_rotation = g_time % 1.00
		}
		else { // save for the next spin the last rotation happened (clipped between 0 and 360) / 360
			g_time = last_rotation
		}
		lastUpdateTime = currentTime;

	}


	function drawScene() {
		animate();

		utils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		let cameraMatrix = utils.LookAt(camera_pos, camera_target, camera_up)
		viewMatrix = utils.invertMatrix(cameraMatrix);
		let eyePosition = [camera_pos.x, camera_pos.y, camera_pos.z];

		// LIGHT PARAMS
		let LAPosition = [
			document.getElementById('lposx').value / 10.0,
			document.getElementById('lposy').value / 10.0,
			document.getElementById('lposz').value / 10.0,
		]
		let LADirection = getLightDirection()
		let LATarget = document.getElementById('target_distance').value 
		let LAType = decodeLight(document.getElementById('lightA').value)
		let LADecay = document.getElementById('ldecay').value
		let LAConeIn = document.getElementById('conein').value
    	let LAConeOut = document.getElementById('coneout').value


		// Passing primary light uniforms
		gl.uniform3fv(LATypeLocation, LAType);
		gl.uniform3fv(LAPositionLocation, LAPosition);
		gl.uniform4fv(LAColorLocation, LA_COLOR);
		gl.uniform3fv(LADirectionLocation, LADirection);
		gl.uniform1f(LATargetLocation, LATarget);
		gl.uniform1f(LADecayLocation, LADecay);
		gl.uniform1f(LAConeInLocation, LAConeIn);
    	gl.uniform1f(LAConeOutLocation, LAConeOut);

		// Passing secondary light uniforms
		gl.uniform3fv(LBTypeLocation, LB_TYPE);
		gl.uniform3fv(LBDirectionLocation, LB_DIRECTION);
		gl.uniform4fv(LBColorLocation, LBColor);

		// Passing light constant uniforms
		gl.uniform4fv(diffuseColorLocation, DIFFUSE_COLOR);
		gl.uniform4fv(specularColorLocation, SPECULAR_COLOR);
		gl.uniform1f(specularShineLocation, SPECULAR_SHINE);
		gl.uniform3fv(eyePosLocation, eyePosition);

		gl.uniform4fv(ambientLightColorLocation, AMBIENT_LIGHT_COLOR);
		gl.uniform4fv(ambientMaterialColorLocation, AMBIENT_MATERIAL_COLOR);

		for (let i = 0; i < meshes.length; i++) {

			worldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0)

			gl.uniform1f(hasTextureLocation, 0) //hasTexture uniform is used for non-textured objects 

			if (i == 0) { 	  // frame
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, frame_tex);
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, frame_AO);
			}
			else if (i == 1 || i == 4) { // stand and room
				gl.uniform1f(hasTextureLocation, 1)
			}
			else if (i == 2) { // wheel
				worldMatrix = utils.multiplyMatrices(worldMatrix, createRotMatrix(g_time))
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, wheel_tex);
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, wheel_AO);
			}
			else if (i == 3) { // table
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, table_tex);
			}
			else if (i == 5) { // button  base
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, button_tex);
			}
			else if (i == 6) { // button
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, button_tex);
				worldMatrix = utils.multiplyMatrices(worldMatrix,
                createScaleButton(sz))
			}

			let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
			projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

			gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
			gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(utils.invertMatrix(utils.transposeMatrix(worldMatrix))));
			gl.uniformMatrix4fv(vertexMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(worldMatrix))

			gl.bindVertexArray(vaos[i]);
			gl.drawElements(gl.TRIANGLES, meshes[i].indices.length, gl.UNSIGNED_SHORT, 0);

		}
		window.requestAnimationFrame(drawScene)
	}
}

async function loadMeshFromFile(path) {
	let str = await utils.get_objstr(path);
	let mesh = new OBJ.Mesh(str);
	return mesh;
}

function createRotMatrix(t) {
	var translate_center = utils.MakeTranslateMatrix(0, wheelCenter.y, 0);
	var rotation = utils.MakeRotateZMatrix(t * 360);

	var out = utils.multiplyMatrices(translate_center, utils.multiplyMatrices(rotation, utils.invertMatrix(translate_center)));
	return out;
}

function createScaleButton(f) {
	var translate_center = utils.MakeTranslateMatrix(buttonCenter.x, buttonCenter.y, 0);
	var rotation = utils.MakeScaleNonUniform(1.0, f, 1.0);

	var out = utils.multiplyMatrices(translate_center, utils.multiplyMatrices(rotation, utils.invertMatrix(translate_center)));
	return out;
}

function findCenter(vertices) {
	const [min, max] = findExtremeVertices(vertices)
	return {
		x: (max[0] - min[0]) / 2 + min[0],
		y: (max[1] - min[1]) / 2 + min[1],
		z: (max[2] - min[2]) / 2 + min[2]
	};

}

function findExtremeVertices(vertices) {
	const min = vertices.slice(0, 3);
	const max = vertices.slice(0, 3);
	for (let i = 3; i < vertices.length; i += 3) {
		for (let j = 0; j < 3; ++j) {
			const v = vertices[i + j];
			min[j] = Math.min(v, min[j]);
			max[j] = Math.max(v, max[j]);
		}
	}
	return [min, max];
}

function decodeLight(type) {
	switch (type) {
		case ("direct"): return [1.0, 0.0, 0.0]
		case ("point"): return [0.0, 1.0, 0.0]
		case ("spot"): return [0.0, 0.0, 1.0]
	}
}

function getLightDirection() {
	let theta = utils.degToRad(document.getElementById('dirTheta').value);
	let phi = utils.degToRad(document.getElementById('dirPhi').value);

	return [Math.sin(theta) * Math.sin(phi), Math.cos(theta), Math.sin(theta) * Math.cos(phi)]
}

// Returns the direction of the ray from camera to clicked point in World Coordinates. 
function getWorldRay(x, y) {

	// Passing to normalized screen coordinates
	let normX = 2.0 * x / gl.canvas.width - 1.0;
	let normY = 1.0 - 2.0 * y / gl.canvas.height;

	// Passing to homogeneous clip coordinates (z is -1 because it's in the forward direction)
	let rayClip = [normX, normY, 1.0, 1.0];

	// Passing to Camera Coordinates
	let rayEye = utils.multiplyMatrixVector(utils.invertMatrix(projectionMatrix), rayClip);
	rayEye = [rayEye[0], rayEye[1], -1.0, 0.0];

	// Passing to World Coordinates
	let rayWorld = utils.multiplyMatrixVector(utils.invertMatrix(viewMatrix), rayEye).slice(0, 3);

	return utils.normalize(rayWorld);
}

document.addEventListener("click", (e) => {
	let worldRay = getWorldRay(e.clientX, e.clientY);
	let intersection = raycast.linePlaneIntersection(buttonRaycastPlane, camera_pos, worldRay)
	console.log("Intersection: " + intersection)
});


window.onload = init;  