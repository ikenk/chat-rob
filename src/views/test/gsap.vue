<script setup lang="ts">
import { gsap } from "gsap";

/**
 * gsap动画
 */
const tl = gsap.timeline({});
onMounted(() => {
  tl.to(".char", {
    opacity: 1,
    delay: 1,
    duration: 0.5,
    rotation: 360,
    x: 0,
    y: 0,
    ease: "Power4.inOut",
    stagger: 0.5,
  });
});

// let timesRun: number, hour: string, minute: string, second: string;
// const getRandomTime = () => {
//   let intervalTime = setInterval(() => {
//     timesRun += 1;
//     // console.log(_this.timesRun);
//     if (timesRun === 11) {
//       timesRun = 0;
//       clearInterval(intervalTime);
//     }
//     let rand_hour = Math.floor(Math.random() * 24);
//     let rand_min = Math.floor(Math.random() * 60);
//     let rand_sec = Math.floor(Math.random() * 60);
//     hour = time2str(rand_hour);
//     minute = time2str(rand_min);
//     second = time2str(rand_sec);
//   }, 50);
// };
// const time2str = (num: number) => {
//   return ("0" + num).slice(-2);
// };

class Test {
  private name: string;
  private age: number;

  private constructor(name: string, age: number) {
    console.log("constructing");
    this.name = name;
    this.age = age;
  }

  static _ins: Test;
  static setInfo(name: string, age: number) {
    console.log("start");
    if (!this._ins) {
      this._ins = new Test(name, age);
    }
    console.log("end");
    return this._ins;
  }
}
// const test = new Test("xiaoming", 12);
// const test2 = new Test("xiaozhang", 12);
// console.log(test);
// console.log(test2);
const test3 = Test.setInfo("xiaohong", 12);
console.log(test3);
const test4 = Test.setInfo("xiaogang", 12);
console.log(test4);

type ARR_name = Array<string>;
const arr: ARR_name = [1, 2, 3];
console.log(arr);

interface ARRNAME {
  arr: Array<string>;
}
const arr1: ARRNAME["arr"] = ["1", "2", "3"];
console.log(arr1);
</script>

<template>
  <!-- 顶部时间部分 -->
  <!-- <div ref="ClockRand" class="toptime" name="top">
    <div id="time" class="time">{{ hour + ":" + minute + ":" + second }}</div>
  </div> -->
  <div class="content">
    <!-- <div class="char">a</div>
    <div class="char">b</div>
    <div class="char">c</div>
    <div class="char">d</div>
    <div class="char">e</div>
    <div class="char">f</div>
    <div class="char">g</div>
    <div class="char">h</div>
    <div class="char">i</div>
    <div class="char">j</div> -->
    <div class="char">m</div>
    <div class="char">y</div>
    <div class="char">g</div>
    <div class="char">p</div>
    <div class="char">t</div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  top: 150px;
  font-size: 5rem;
  position: relative;
  color: black;
  margin-left: 100px;
  // clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
}

.char {
  display: inline-block;
  margin-right: 6px;
  opacity: 0.3;
  transform: translateX(-500px);
}

.toptime {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: flex-end;
  padding: 0%;
  position: relative;
  width: 100%;
  height: 25%;
  z-index: -2;

  &::before {
    position: absolute;
    content: "00-00-00";
    font-family: "BONX-Frame";
    font-size: 15vh;
    color: #000000;
    opacity: 0.5;
  }

  &::after {
    position: absolute;
    content: "00-00-00";
    font-family: "BONX-Silhouette";
    font-size: 15vh;
    color: #58120d;
    z-index: -1;
  }

  .time {
    position: absolute;
    font-family: "BONX-Number";
    font-size: 15vh;
    color: #d9a600;
    text-shadow:
      -3px 0 2px #eb2900,
      0 3px 2px #eb2900,
      3px 0 2px #eb2900,
      0 -3px 2px #eb2900;
  }
}
</style>
