// /mantianxing
<script setup lang="ts">
const ballspan = ref<Array<HTMLSpanElement | null>>();
onMounted(() => {
  ballspan.value?.forEach((item) => {
    item?.style.setProperty(
      "--ballColor",
      `hsl(${Math.random() * 256},100%,70%)`,
    );
    item?.style.setProperty("--ballTime", `${Math.random() * 20}s`);
  });
});
</script>

<template>
  <div class="box">
    <div id="balls" class="balls">
      <span v-for="(_, index) in 30" ref="ballspan" :key="index"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$--color--ball: var(--ballColor, skyblue);
$--time--ball: var(--ballTime, 10s);
$--size--ball: var(--ballSize, 15px);
.box {
  background-color: #000;
  min-height: 100vh;
}

.balls {
  display: flex;
  // align-items: center;
  span {
    display: inline-block;
    width: $--size--ball;
    height: $--size--ball;
    background-color: $--color--ball;
    border-radius: 50%;
    flex-shrink: 0;
    margin: 0 5px;
    animation: animate $--time--ball linear infinite;
    // transform: translateY(calc(100vh - #{$--size--ball}));
  }
}

@keyframes animate {
  0% {
    transform: translateY(calc(100vh - #{$--size--ball})) scale(0.2);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
