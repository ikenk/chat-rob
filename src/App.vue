<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

// 打印环境变量
;(function printEnvVar(){
  // base api
  console.log(import.meta.env.VITE_APP_BASE_API);
  // import.meta 信息
  console.log(import.meta)
})
// 导出csv后缀的文件。类似于Excel
;(function exportCSV(){
  // 数据格式
  const rows = [
    ["name1", "city1", "some other info"],
    ["name2", "city2", "more info"]
  ];

  //导出类型
  let csvContent = "data:text/csv;charset=utf-8,";

  //进行数据拼接
  rows.forEach(function(rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  })

  //进行数据格式化
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
})

// const name = ref<String>('button')
// onMounted(()=>{
//   console.log(name);
// })

onMounted(() => {
  const context = document.getElementById('c')
  const ctx = context.getContext('2d')

  const img = new Image() // 创建图片对象
  img.src = '../public/vite.svg' // 加载本地图片

  // 图片加载完成后在执行其他操作
  img.onload = () => {
    // 渲染图片
    ctx.drawImage(img, 0, 0)
    // 获取图片信息
    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    console.log(imageData)
  }
})
</script>

<template>
  <div>
    <el-button type="primary">switch locale</el-button>
  </div>
  <canvas id="c" width="400" height="400" style="border: 1px solid #ccc;"></canvas>                                                                       
</template>

<style scoped>
</style>
