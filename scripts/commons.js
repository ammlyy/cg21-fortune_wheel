var commons = {

    loadAllMeshes: async function () {
        await loadMeshFromFile(baseDir + '/assets/frame/frame.obj').then((obj) => meshes.push(obj))
        await loadMeshFromFile(baseDir + '/assets/stand/stand.obj').then((obj) => meshes.push(obj))
        await loadMeshFromFile(baseDir + '/assets/wheel/wheel.obj').then((obj) => {
            meshes.push(obj)
            wheelCenter = findCenter(obj.vertices)
        })
        await loadMeshFromFile(baseDir + 'assets/table/table.obj').then((obj) => meshes.push(obj))
        await loadMeshFromFile(baseDir + '/assets/room/room.obj').then((obj) => meshes.push(obj))
        await loadMeshFromFile(baseDir + '/assets/button/base.obj').then((obj) => meshes.push(obj))
        await loadMeshFromFile(baseDir + '/assets/button/button.obj').then((obj) => {
            meshes.push(obj)
            buttonCenter = findCenter(obj.vertices)
            let [minV, maxV] = findExtremeVertices(obj.vertices);
            console.log("Minimum: " + minV)
            console.log("Maximum: " + maxV);
            buttonRaycastPlane = {
                p0: [minV[0], maxV[1], minV[2]],
                p1: [minV[0], maxV[1], maxV[2]],
                p2: [maxV[0], maxV[1], maxV[2]]
            }
            raycastCoord = {
                xMin: minV[0],
                xMax: maxV[0],
                zMin: minV[2],
                zMax: maxV[2]
            }
        })

    },

    loadTextures: function () {
        wheel_tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, wheel_tex);

        var image = new Image();
        image.src = baseDir + TEXTURE_URLS[0];
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, wheel_tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };

        frame_tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, frame_tex);

        var image2 = new Image();
        image2.src = baseDir + TEXTURE_URLS[1];
        image2.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, frame_tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };


        table_tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, table_tex);

        var image3 = new Image();
        image3.src = baseDir + TEXTURE_URLS[2];
        image3.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, table_tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image3);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };


        button_tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, button_tex);

        var image4 = new Image();
        image4.src = baseDir + TEXTURE_URLS[3];
        image4.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, button_tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image4);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };


    },

    loadOcclusions: function () {
        wheel_AO = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, wheel_AO);

        var image = new Image();
        image.src = baseDir + OCCLUSION_URLS[0];
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, wheel_AO);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };

        frame_AO = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, frame_AO);

        var image2 = new Image();
        image2.src = baseDir + OCCLUSION_URLS[1];
        image2.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, frame_AO);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };

    },

    setupUniforms: function() {
        positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
        normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
        uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
      
        matrixLocation = gl.getUniformLocation(program, "matrix");
        normalMatrixPositionHandle = gl.getUniformLocation(program, "normMatrix");
        vertexMatrixPositionHandle = gl.getUniformLocation(program, "posMatrix");
      
        textLocation = gl.getUniformLocation(program, "in_texture");
        AOLocation = gl.getUniformLocation(program, "AO_texture")
      
        hasTextureLocation = gl.getUniformLocation(program, "hasTexture");
      
        // Primary light
        LATypeLocation = gl.getUniformLocation(program, "LAType");
        LAPositionLocation = gl.getUniformLocation(program, "LAPos");
        LADirectionLocation = gl.getUniformLocation(program, "LADir");
        LAColorLocation = gl.getUniformLocation(program, "LACol");
        LATargetLocation = gl.getUniformLocation(program, "LATarget");
        LADecayLocation = gl.getUniformLocation(program, "LADecay");
        LAConeInLocation = gl.getUniformLocation(program, "LAConeIn");
        LAConeOutLocation = gl.getUniformLocation(program, "LAConeOut");
      
        // Secondary light
        LBTypeLocation = gl.getUniformLocation(program, "LBType");
        LBDirectionLocation = gl.getUniformLocation(program, "LBDir");
        LBColorLocation = gl.getUniformLocation(program, "LBCol");

        // Shared parameters
        diffuseColorLocation = gl.getUniformLocation(program, "diffuseColor");
        specularColorLocation = gl.getUniformLocation(program, "specularColor");
        specularShineLocation = gl.getUniformLocation(program, "SpecShine")
        eyePosLocation = gl.getUniformLocation(program, "eyePos");
      
        ambientLightColorLocation = gl.getUniformLocation(program, "ambientLightColor");
        ambientMaterialColorLocation = gl.getUniformLocation(program, "ambientMatColor");
      
    },

    loadShaders: async function(path) {
        await utils.loadFiles([path + 'vs.glsl', path + 'fs.glsl'], function
            (shaderText) {
            var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
            var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
            program = utils.createProgram(gl, vertexShader, fragmentShader);
        });
    },

    fillBuffers: function(i) {
        let mesh = meshes[i];
        let vao = gl.createVertexArray();
        vaos.push(vao);
        gl.bindVertexArray(vaos[i]);
        
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        
        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(uvAttributeLocation);
        gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        
        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
    }

      
      


      


}