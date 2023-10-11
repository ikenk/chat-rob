<script setup lang="ts">
// 打印环境变量
(function printEnvVar() {
  // base api
  console.log(import.meta.env.VITE_APP_BASE_API);
  // import.meta 信息
  console.log(import.meta.env.VITE_APP_TITLE);
});
// 导出csv后缀的文件。类似于Excel
(function exportCSV() {
  // 数据格式
  const rows = [
    ["name1", "city1", "some other info"],
    ["name2", "city2", "more info"],
  ];

  //导出类型
  let csvContent = "data:text/csv;charset=utf-8,";

  //进行数据拼接
  rows.forEach(function (rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  //进行数据格式化
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
});
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
