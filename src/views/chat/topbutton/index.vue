<script setup lang="ts">
const router = useRouter()

const emit = defineEmits(['clearChatBox'])

const createNewMsg = ()=>{
  router.push('/')
  emit('clearChatBox')
}

const toggleMenu = ()=>{
  console.log(345);
}
</script>

<template>
  <el-row class="topbutton">
    <el-col :span="18" class="newchat">
      <button class="newchatbtn" @click="createNewMsg">+ New chat</button>
    </el-col>
    <el-col :span="6" class="menu">
      <icon-svg iconClass="toggle-left" class="menuicon" @click="toggleMenu"></icon-svg>
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
      font-size: 14px;
      text-align: start;
      border-radius: 5px;
      outline: none;
      border: 1px solid $color-border-aside;
      @include backgroundColor;
      color: $color-font-aside;

      &:hover{
        @include hoverBackgroundColor;
        outline: none;
        cursor: pointer;
      }
    }
  }

  .menu{
    padding-left:20px ;
    .menuicon{
      box-sizing: border-box;
      width: 40px;
      height:40px;
      padding: 0 10px;
      font-size: 16px;
      line-height: 38px;
      color: rgba(255,255,255,0.6);
      border: 1px solid $color-border-aside;
      border-radius: 6px;
      &:deep(.icon){
        margin-bottom: 0px;
      }

      &:hover{
        cursor: pointer;
        @include hoverBackgroundColor;
        outline: none;
      }
  }
  }
}

// .menuicon ::v-deep .icon{
//   // margin-bottom: 1px;
// } ::v-deep 被弃用
</style>