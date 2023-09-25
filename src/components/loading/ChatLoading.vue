<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="loading">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  // font-size: 20px;
  color: $color-font-chatbox;
}

.loading.la-dark {
  color: #333;
}

.loading > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.loading {
  width: 1em;
  height: 0.8em;
}

.loading > div {
  width: 0.1em;
  height: 0.8em;
  margin: 0.05em;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0;
  animation: line-scale-pulse-out 0.9s infinite
    cubic-bezier(0.85, 0.25, 0.37, 0.85);
}

.loading > div:nth-child(3) {
  animation-delay: -0.9s;
}

.loading > div:nth-child(2),
.loading > div:nth-child(4) {
  animation-delay: -0.7s;
}

.loading > div:nth-child(1),
.loading > div:nth-child(5) {
  animation-delay: -0.5s;
}

.loading.la-sm {
  width: 0.5em;
  height: 0.4em;
}

.loading.la-sm > div {
  width: 0.05em;
  height: 00.4em;
  margin: 0.025em;
  margin-top: 0;
  margin-bottom: 0;
}

.loading.la-2x {
  width: 2em;
  height: 1.6em;
}

.loading.la-2x > div {
  width: 0.2em;
  height: 1.6em;
  margin: 0.1em;
  margin-top: 0;
  margin-bottom: 0;
}

.loading.la-3x {
  width: 3em;
  height: 2.4em;
}

.loading.la-3x > div {
  width: 0.3em;
  height: 2.4em;
  margin: 0.15em;
  margin-top: 0;
  margin-bottom: 0;
}

@keyframes line-scale-pulse-out {
  0% {
    transform: scaley(1);
  }

  50% {
    transform: scaley(0.3);
  }

  100% {
    transform: scaley(1);
  }
}
</style>
