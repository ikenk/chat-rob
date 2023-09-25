<script setup lang="ts">
//需要想item内传入用户输入的消息和ChatGPT返回的消息
defineProps<{
  role: string;
  message: string;
}>();
</script>

<template>
  <div class="container" :class="[role === 'user' ? 'user' : 'assist']">
    <div class="img">
      <img src="@/assets/assit.png" alt="" />
    </div>
    <div class="content">
      {{ message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
  width: 100%;
  // background-color: red;
  display: flex;
  padding: 10px 10%;
  margin: 10px 0;
  border-radius: 8px;
  .img {
    box-sizing: border-box;
    width: 50px;
    img {
      width: 30px;
    }
  }

  .content {
    flex: 1;
  }
}

.user {
  background-color: white;
}

.assist {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
