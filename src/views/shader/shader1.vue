<template>
  <div>
    <canvas ref="canvasDom" id="canvasDom"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const canvasDom = ref(null);
onMounted(() => {
  console.log(canvasDom.value);
  //获取canvas对象
  let canvas = canvasDom.value;
  //设置宽高
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //获取webgl绘图上下文
  let gl = canvas.getContext("webgl");
  console.log(gl);
  //第一次创建webgl上下文，需要设置视口大小 创建着色器
  gl.viewport(0, 0, canvas.width, canvas.height);
  //创建顶点着色器
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  //创建顶点着色器的源码，需要编写glsl代码
  gl.shaderSource(
    vertexShader,
    `
  attribute vec4 a_position;
  uniform vec4 u_mat;
  void main() {
    gl_Position = a_position;
  }
  `
  );
  //编译顶点着色器
  gl.compileShader(vertexShader);
  //创建片元着色器
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  //创建片元着色器的源码，需要编写glsl代码
  gl.shaderSource(
    fragmentShader,
    `
  void main() {
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  }
  `
  );
  //编译片元着色器
  gl.compileShader(fragmentShader);
  //创建程序连接顶点着色器和片元着色器
  let program = gl.createProgram();
  // 连接顶点着色器和片元着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  //连接程序
  gl.linkProgram(program);
  //使用程序进行渲染
  gl.useProgram(program);
  //创建顶点缓冲区对象
  let vertexBuffer = gl.createBuffer();
  //绑定顶点缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  //向顶点缓冲区对象中写入数据
  let vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  //gl.STATIC_DRAW表示数据不会改变，gl.DYNAMIC_DRAW表示数据会变化
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  //获取顶点着色器中的a_position变量的位置
  let a_position = gl.getAttribLocation(program, "a_position");
  //将顶点缓冲区对象分配给a_position变量
  //告诉OpenGL如何解析顶点数据
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  //启用顶点着色器中的a_position变量
  gl.enableVertexAttribArray(a_position);

  //清除canvas
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //绘制三角形
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  //卡住   不往下面走了

  const scale = {
    x: 0.5,
    y: 0.5,
    z: 0.5,
  };
  const mat = new Float32Array([
    scale.x,
    0.0,
    0.0,
    0.0,
    0.0,
    scale.y,
    0.0,
    0.0,
    0.0,
    0.0,
    scale.z,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
  ]);
  const u_mat = gl.getUniformLocation(program, "u_mat");
  gl.uniformMatrix4fv(u_mat, false, mat);
});
</script>

<style scoped>
#canvasDom {
  width: 100%;
  height: 100%;
}
</style>
