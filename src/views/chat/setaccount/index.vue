<script setup lang="ts">
const picUrl = ref('')

</script>

<template>
  <div class="container">
    <div class="account">
      <div class="pic">
        <img :src="picUrl" v-if="picUrl">
        <span v-else>ik</span>
      </div>
      <div class="username">
        <span>ikenak@gmail.com</span>
      </div>
    </div>
    <div class="button">
      <button class="setting">set</button>
      <button class="logout">log</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container{
  display: flex;
  flex-direction: column;
  padding: 5px;
  background-color: yellow;
  border-radius: 5px;
  box-sizing: border-box;
  .account{
    display: flex;
    margin-bottom:5px ;
    .pic{
      flex:1 1 0%;
      background-color: red;
      padding-left: 5px;

      span{
        font-size: 20px;
      }
    }

    .username{
      flex:4 1 0%;
      overflow: hidden;
      background-color: green;
      display: flex;
      font-size: 12px;
      align-items: center;
    }
  }

  .button{
    display: flex;
    justify-content: space-between;
  }
}
</style>