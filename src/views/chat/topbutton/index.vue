<script setup lang="ts">
import IconSvg from '@/components/iconsvg/IconSvg.vue'
import '@/icons/js/chat-topbutton.js'
</script>

<template>
  <el-row class="topbutton">
    <el-col :span="18" class="newchat">
      <button class="newchatbtn">+ New chat</button>
    </el-col>
    <el-col :span="6" class="menu">
      <icon-svg iconClass="toggle-left" class="menuicon"></icon-svg>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.topbutton{
  height: 60px;
  padding:8px 0px;
  // background-color: red;
  border-radius: 5px;
  .newchat{
    height: 50px;
    .newchatbtn{
      box-sizing: border-box;
      padding: 0 10px;
      width: 100%;
      height: 40px;
      font-size: 16px;
      text-align: start;
      border-radius: 5px;
      outline: none;
      border: 1px solid #fff;
      @include backgroundColor;
      color: #fff;

      &:hover{
        @include hoverBackgroundColor;
        outline: none;
      }
    }
  }

  .menu{
    padding-left:20px ;
    .menuicon{
      box-sizing: border-box;
      width: 40px;
      height:40px;
      padding-bottom: 5px;
      font-size: 30px;
      line-height: 35px;
      color: white;

      &:deep(.icon){
        margin-bottom: 0px;
      }

      &:hover{
        cursor: pointer;
      }
  }
  }
}

// .menuicon ::v-deep .icon{
//   // margin-bottom: 1px;
// } ::v-deep 被弃用
</style>