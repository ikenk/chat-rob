<!-- 底部账户及设置组件 -->
<script setup lang="ts">
import{useUserInfoStore}from '@/stores/userInfo'
const router = useRouter()
const store = useUserInfoStore()
defineProps<{
  accoutName:string,
}>()


const logoutAccount = ()=>{
  store.delToken('user-token')
  router.push({name:'login'})
}
</script>

<template>
  <div class="container">
    <div class="account">
      <div class="userpic">
        <span>{{accoutName.slice(0,2)}}</span>
      </div>
      <div class="username">
        <span>{{ accoutName }}</span>
      </div>
    </div>
    <div class="button">
      <icon-svg class="setting" icon-class="shezhi"></icon-svg>
      <!-- <button class="setting">
        <icon-svg icon-class="shezhi"></icon-svg>
      </button> -->
      <icon-svg class="logout" icon-class="icon-" @click="logoutAccount"></icon-svg>
      <!-- <button class="logout" @click="logoutAccount">
        <icon-svg icon-class="icon-"></icon-svg>
      </button> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container{
  display: flex;
  flex-direction: column;
  padding: 5px;
  // background-color: yellow;
  // border: 1px solid $color-border-aside;
  border-radius: 5px;
  box-sizing: border-box;
  .account{
    display: flex;
    margin-bottom:5px ;
    .userpic{
      flex:1 1 0%;
      // background-color: red;
      padding-left: 5px;
      span{
        display: inline-block;
        width: 28px;
        font-size: 20px;
        text-align: center;
        color: $color-font-aside;
        border-radius: 3px;
        background-color: rgba(98, 153, 175,0.8);
      }
    }

    .username{
      flex:4 1 0%;
      overflow: hidden;
      color:$color-font-aside;
      background-color: rgba(59, 59, 59, 0.8);
      font-size: 14px;
      display: flex;
      align-items: center;
      padding-left: 8px;
      border-radius: 3px;
    }
  }

  .button{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    .setting{
      flex:1 1 0%;
      // background-color: red;
      padding-left: 7px;
      color: $color-font-aside;
      font-size: 20px;
      line-height: 20px;

      &:deep(.icon){
        &:hover{
          cursor: pointer;
          color: #e4e4e4;
        }
      }
    }

    .logout{
      flex:4 1 0%;
      padding-right: 5px;
      // background-color: green;
      color: $color-font-aside;
      font-size: 18px;
      line-height: 20px;
      display: flex;
      justify-content: end;

      &:deep(.icon){
        &:hover{
          cursor: pointer;
          color: #fff;
        }
      }
    }
  }
}
</style>