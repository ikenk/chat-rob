<script setup lang="ts">
const router = useRouter();
const getPicture = () => {
  router.push("/Mbappé");
};
</script>

<template>
  <div class="notfound-page">
    <div class="container">
      <span class="errnumber">404</span>
      <span class="errtext">This page could not be found.</span>
      <img src="@/assets/404.webp" @click="getPicture" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notfound-page {
  position: relative;
  height: 100vh;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 50px;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    .errnumber {
      display: inline-block;
      padding-right: 20px;
      font-size: 28px;
      line-height: 60px;
      border-right: 1px solid #bdbdbd;
    }
    .errtext {
      display: inline-block;
      padding-left: 20px;
      margin-right: 20px;
      font-size: 20px;
      line-height: 50px;
    }
    img {
      height: 45px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
