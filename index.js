var canvas;
var gl;

var mouseX; // Old value of x-coordinate
var movement = false; // Do we move the paddle?

var skotnirFuglar = 0;

var fuglahradi = 0.005;
var fuglahradi2 = 0.0025;
var skothradi = 0.03;

var vertices = [
  // [0-2]
  vec2(0, -0.75), // Byssa, oddur
  vec2(-0.1, -0.9), // Byssa, vinstra horn
  vec2(0.1, -0.9), // Byssa, hægra horn
  // Skil á milli til einföldunar [3-8]
  vec2(0.025, -0.65), // Skot, hægra uppi horn
  vec2(-0.025, -0.7), // Skot, vinstri neðra horn
  vec2(0.025, -0.7), // Skot, hægra neðra horn
  vec2(0.025, -0.65), // Skot, hægra uppi horn
  vec2(-0.025, -0.7), // Skot, vinstri neðra horn
  vec2(-0.025, -0.65), // Skot, vinstra uppi horn
  // Skil á milli til einföldunar [9-14]
  vec2(-1.2, 0.7), // FuglEinn, vinstra uppi horn, a
  vec2(-1.2, 0.5), // FuglEinn, vinstra nedra horn, a
  vec2(-1, 0.5), // FuglEinn, hægra horn, a
  vec2(-1.2, 0.7), // FugEinn, vinstra uppi horn, b
  vec2(-1, 0.5), // FuglEinn, hægra nedra horn, b
  vec2(-1, 0.7), // FuglEinn, hægra uppi horn, b
  // Skil á milli til einföldunar [15-20]
  vec2(1.2, 0.5), // FuglTveir, hægra uppi horn, a
  vec2(1.2, 0.3), // FuglTveir, hægra nedra horn, a
  vec2(1, 0.3), // FuglTveir, vinstra horn, a
  vec2(1.2, 0.5), // FuglTveir, hægra uppi horn, b
  vec2(1, 0.3), // FuglTveir, vinstra nedra horn, b
  vec2(1, 0.5), // FuglTveir, vinstra uppi horn, b
  // Skil á milli til einföldunar [21-26]
  vec2(-1.2, 0.6), // FuglÞrír, vinstra uppi horn, a
  vec2(-1.2, 0.4), // FuglÞrír, vinstra nedra horn, a
  vec2(-1, 0.4), // FuglÞrír, hægra horn, a
  vec2(-1.2, 0.6), // FuglÞrír, vinstra uppi horn, b
  vec2(-1, 0.4), // FuglÞrír, hægra nedra horn, b
  vec2(-1, 0.6), // FuglÞrír, hægra uppi horn, b
];

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  //
  //  Load shaders and initialize attribute buffers
  //
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Event listeners for mouse
  canvas.addEventListener('mousedown', function (e) {
    movement = true;
    mouseX = e.offsetX;
  });

  canvas.addEventListener('mouseup', function (e) {
    movement = false;
  });

  canvas.addEventListener('mousemove', function (e) {
    if (movement) {
      var xmove = (2 * (e.offsetX - mouseX)) / canvas.width;
      mouseX = e.offsetX;
      for (i = 0; i < 3; i++) {
        vertices[i][0] += xmove;
      }

      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    }
  });

  render();
};

function render() {
  setTimeout(function () {
    window.requestAnimFrame(render);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Ferd byssukúlu
    for (v = 3; v < 9; v++) {
      vertices[v][1] += skothradi;
    }
    // Ferd fuglEinn
    for (r = 9; r < 15; r++) {
      vertices[r][0] += fuglahradi;
    }
    // Ferð fuglTveir
    for (r = 15; r < 21; r++) {
      vertices[r][0] -= fuglahradi2;
    }
    // Ferð fuglÞrír
    for (r = 21; r < 27; r++) {
      vertices[r][0] += fuglahradi2;
    }
    // Ef fuglEinn fer út fyrir rammann
    if (vertices[10][0] >= 1.0) {
      vertices[9][1] = 0.7; // y-gildi 1.fugls, a
      vertices[10][1] = 0.5; // y-gildi 1.fugls, a
      vertices[11][1] = 0.5; // y-gildi 1.fugls, a

      vertices[12][1] = 0.7; // y-gildi 1.fugls, b
      vertices[13][1] = 0.5; // y-gildi 1.fugls, b
      vertices[14][1] = 0.7; // y-gildi 1.fugls, b

      vertices[9][0] = -1.2; // x-gildi 1.fugls, a
      vertices[10][0] = -1.2; // x-gildi 1.fugls, a
      vertices[11][0] = -1; // x-gildi 1.fugls, a
      vertices[12][0] = -1.2; // x-gildi 1.fugls, a
      vertices[13][0] = -1; // x-gildi 1.fugls, a
      vertices[14][0] = -1; // x-gildi 1.fugls, a
    }
    // Ef fuglTveir fer út fyrir rammann
    if (vertices[15][0] <= -1.0) {
      vertices[15][1] = 0.5; // y-gildi 2.fugls, a
      vertices[16][1] = 0.3; // y-gildi 2.fugls, a
      vertices[17][1] = 0.3; // y-gildi 2.fugls, a

      vertices[18][1] = 0.5; // y-gildi 2.fugls, b
      vertices[19][1] = 0.3; // y-gildi 2.fugls, b
      vertices[20][1] = 0.5; // y-gildi 2.fugls, b

      vertices[15][0] = 1.2; // x-gildi 2.fugls, a
      vertices[16][0] = 1.2; // x-gildi 2.fugls, a
      vertices[17][0] = 1; // x-gildi 2.fugls, a
      vertices[18][0] = 1.2; // x-gildi 2.fugls, a
      vertices[19][0] = 1; // x-gildi 2.fugls, a
      vertices[20][0] = 1; // x-gildi 2.fugls, a
    }
    // Ef fuglÞrir fer út fyrir rammann
    if (vertices[21][0] >= 1.0) {
      vertices[21][1] = 0.6; // y-gildi 1.fugls, a
      vertices[22][1] = 0.4; // y-gildi 1.fugls, a
      vertices[23][1] = 0.4; // y-gildi 1.fugls, a

      vertices[24][1] = 0.6; // y-gildi 1.fugls, b
      vertices[25][1] = 0.4; // y-gildi 1.fugls, b
      vertices[26][1] = 0.6; // y-gildi 1.fugls, b

      vertices[21][0] = -1.2; // x-gildi 1.fugls, a
      vertices[22][0] = -1.2; // x-gildi 1.fugls, a
      vertices[23][0] = -1; // x-gildi 1.fugls, a
      vertices[24][0] = -1.2; // x-gildi 1.fugls, a
      vertices[25][0] = -1; // x-gildi 1.fugls, a
      vertices[26][0] = -1; // x-gildi 1.fugls, a
    }

    // Ef kúlan fer út fyrir rammann
    if (vertices[3][1] >= 1.0) {
      vertices[3][1] = vertices[0][1] + 0.1; // y-gildi kúlu
      vertices[4][1] = vertices[1][1] + 0.2; // y-gildi kúlu
      vertices[5][1] = vertices[2][1] + 0.2; // y-gildi kúlu
      vertices[6][1] = vertices[0][1] + 0.1; // y-gildi kúlu
      vertices[7][1] = vertices[1][1] + 0.2; // y-gildi kúlu
      vertices[8][1] = vertices[1][1] + 0.25; // y-gildi kúlu

      vertices[3][0] = vertices[0][0] + 0.025; // x-gildi kúlu
      vertices[4][0] = vertices[1][0] + 0.075; // x-gildi kúlu
      vertices[5][0] = vertices[2][0] - 0.075; // x-gildi kúlu
      vertices[6][0] = vertices[0][0] + 0.025; // y-gildi kúlu
      vertices[7][0] = vertices[1][0] + 0.075; // y-gildi kúlu
      vertices[8][0] = vertices[2][0] - 0.125; // y-gildi kúlu
    }

    // Ef kúlan hittir fuglEinn
    if (
      vertices[3][1] >= vertices[10][1] && // Ef hægra uppi hornið er hærra eða jafnt og vinstra nedra horn 1.fugls
      ((vertices[3][0] > vertices[10][0] && vertices[3][0] < vertices[13][0]) || // Ef x-gildi hægra uppi hornsins er stærra en vinstra neðra horn 1.fugls og minna en hægra neðra horn 1.fuglsins
        (vertices[7][0] < vertices[13][0] && vertices[7][0] > vertices[10][0])) // eða, x-gildi vinstra uppi hornsins er minna en hægra neðra horn 1.fugls og stærra en vinstra neðra horn 1.fuglsins
    ) {
      vertices[9][1] = 0.7; // y-gildi 1.fugls, a
      vertices[10][1] = 0.5; // y-gildi 1.fugls, a
      vertices[11][1] = 0.5; // y-gildi 1.fugls, a
      vertices[12][1] = 0.7; // y-gildi 1.fugls, b
      vertices[13][1] = 0.5; // y-gildi 1.fugls, b
      vertices[14][1] = 0.7; // y-gildi 1.fugls, b

      vertices[9][0] = -1.2; // x-gildi 1.fugls, a
      vertices[10][0] = -1.2; // x-gildi 1.fugls, a
      vertices[11][0] = -1; // x-gildi 1.fugls, a
      vertices[12][0] = -1.2; // x-gildi 1.fugls, b
      vertices[13][0] = -1; // x-gildi 1.fugls, b
      vertices[14][0] = -1; // x-gildi 1.fugls, b
      skotnirFuglar++;
      console.log('Plús einn');
    }
    // Ef kúlan hittir fuglTveir
    if (
      vertices[3][1] >= vertices[19][1] && // Ef hægra uppi hornið á kúlunni er hærra eða jafnt og vinstra nedra horn 2.fugls
      ((vertices[3][0] > vertices[19][0] && vertices[3][0] < vertices[16][0]) || // Ef x-gildi hægra uppi hornsins er stærra en vinstra neðra horn 2.fugls og minna en hægra neðra horn 2.fuglsins
        (vertices[7][0] < vertices[16][0] && vertices[7][0] > vertices[19][0])) // eða, x-gildi vinstra uppi hornsins er minna en hægra neðra horn 2.fugls og stærra en vinstra neðra horn 2.fuglsins
    ) {
      vertices[15][1] = 0.5; // y-gildi 2.fugls, a
      vertices[16][1] = 0.3; // y-gildi 2.fugls, a
      vertices[17][1] = 0.3; // y-gildi 2.fugls, a
      vertices[18][1] = 0.5; // y-gildi 2.fugls, b
      vertices[19][1] = 0.3; // y-gildi 2.fugls, b
      vertices[20][1] = 0.5; // y-gildi 2.fugls, b

      vertices[15][0] = 1.2; // x-gildi 2.fugls, a
      vertices[16][0] = 1.2; // x-gildi 2.fugls, a
      vertices[17][0] = 1; // x-gildi 2.fugls, a
      vertices[18][0] = 1.2; // x-gildi 2.fugls, b
      vertices[19][0] = 1; // x-gildi 2.fugls, b
      vertices[20][0] = 1; // x-gildi 2.fugls, b
      skotnirFuglar++;
      console.log('Plús einn');
    }
    if (
      vertices[3][1] >= vertices[22][1] && // Ef hægra uppi hornið á kúlunni er hærra eða jafnt og vinstra nedra horn 2.fugls
      ((vertices[3][0] > vertices[22][0] && vertices[3][0] < vertices[25][0]) || // Ef x-gildi hægra uppi hornsins er stærra en vinstra neðra horn 2.fugls og minna en hægra neðra horn 2.fuglsins
        (vertices[7][0] < vertices[25][0] && vertices[7][0] > vertices[22][0])) // eða, x-gildi vinstra uppi hornsins er minna en hægra neðra horn 2.fugls og stærra en vinstra neðra horn 2.fuglsins
    ) {
      vertices[21][1] = 0.6; // y-gildi 1.fugls, a
      vertices[22][1] = 0.4; // y-gildi 1.fugls, a
      vertices[23][1] = 0.4; // y-gildi 1.fugls, a
      vertices[24][1] = 0.6; // y-gildi 1.fugls, b
      vertices[25][1] = 0.4; // y-gildi 1.fugls, b
      vertices[26][1] = 0.6; // y-gildi 1.fugls, b

      vertices[21][0] = -1.2; // x-gildi 1.fugls, a
      vertices[22][0] = -1.2; // x-gildi 1.fugls, a
      vertices[23][0] = -1; // x-gildi 1.fugls, a
      vertices[24][0] = -1.2; // x-gildi 1.fugls, b
      vertices[25][0] = -1; // x-gildi 1.fugls, b
      vertices[26][0] = -1; // x-gildi 1.fugls, b
      skotnirFuglar++;
      console.log('Plús einn');
    }

    if (skotnirFuglar >= 5) {
      alert('Þú vannst');
      skotnirFuglar = 0;
    }

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));

    gl.drawArrays(gl.TRIANGLES, 0, 27);
  }, 10);
}
