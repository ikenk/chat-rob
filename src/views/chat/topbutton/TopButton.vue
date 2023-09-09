<script setup lang="ts">
import IconSvg from '@/components/iconsvg/IconSvg.vue'
import '@/views/chat/iconfont.js'
</script>

<template>
  <el-row class="topbutton">
    <el-col :span="18">
      <button class="newchat">+ newchat</button>
    </el-col>
    <el-col :span="6">
      <button class="menu">
        <icon-svg iconClass="toggle-left"></icon-svg>
      </button>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.topbutton{
  height: 40px;
  padding: 5px;
  background-color: red;
  .newchat{
    // width: 100%;
  }

  .menu{
    width: 100%;
  }
}
</style>