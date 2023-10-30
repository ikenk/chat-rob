<script setup lang="ts">
import { gsap } from "gsap";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { getLogin } from "@/api/login/index.ts";
import { getRegister } from "@/api/register/index.ts";
import { useUserInfoStore } from "@/stores/userInfo";
import type { RegisterInfo, LoginInfo } from "@/types/userInfo";

const router = useRouter();
const store = useUserInfoStore();

// 切换登录注册表格
const isShow = ref<string>("login");

/**
 * 账号、密码校验规则
 * @param rule
 * @param value
 * @param callback
 */
// 账号校验规则
const validateAccount = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入账号"));
  }
  // 邮箱校验
  // if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)){
  //   return callback(new Error('请输入正确的邮箱格式'))
  // }else{
  //   callback()
  // }
  // 4-16位字母、数字、下划线、减号 账户名校验
  if (!/^[\w-]{6,16}$/.test(value)) {
    return callback(
      new Error("请输入6-16位字母、数字、下划线、减号组成的账户名"),
    );
  }
  callback();
};
// 密码校验规则
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    // if(!/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/.test(value)){
    //   callback(new Error('请输入最少6位，包括大、小写字母，数字，特殊字符的密码'))
    // }else{
    //   callback()
    // }
    if (!/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])\S*$/.test(value)) {
      callback(new Error("请输入最少6位，包括大、小写字母，数字的密码"));
    } else {
      callback();
    }
  }
};
// 再次确认密码校验
const validatePassAgain = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.value.password) {
    callback(new Error("两次输入不一致"));
  } else {
    callback();
  }
};

/**
 * 注册表格数据及校验
 */
// 注册表格对象
const registerFormRef = ref<FormInstance>();
// 注册表格数据
const registerForm = ref<RegisterInfo>({
  account: "",
  password: "",
  checkpass: "",
});
// 注册表格校验
const registerRules = ref<FormRules<typeof registerForm>>({
  account: [{ validator: validateAccount, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  checkpass: [{ validator: validatePassAgain, trigger: "blur" }],
});
// 注册表格提交
const submitRegisterForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await getRegister(registerForm.value);
      ElMessage.success(res.message);
      formEl.resetFields();
      isShow.value = "login";
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

/**
 * 登录表格数据及校验
 */
// 登录表格对象
const loginFormRef = ref<FormInstance>();
// 登录表格数据
const loginForm = ref<LoginInfo>({
  account: "",
  password: "",
});
// 登录表格校验
const loginFormRules = ref<FormRules<typeof loginForm>>({
  account: [{ validator: validateAccount, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
});
// 登录表格提交
const submitLoginForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const res = await getLogin(loginForm.value);
      ElMessage.success(res.message);
      store.setToken("user-token", res.data!.token);
      formEl.resetFields();
      router.replace("/");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

// 重置表格
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

/**
 * 登录页(开屏)背景
 */
const isShowBackground = ref<boolean>(true);
const leftTimeline = gsap.timeline({});
const rightTimeline = gsap.timeline({});
const leftCharTimeline = gsap.timeline({});
const rightCharTimeline = gsap.timeline({});
onMounted(() => {
  /**
   * 左边部分移动
   */
  //左边背景移动
  leftTimeline.to(".left", {
    delay: 0.5,
    duration: 1,
    x: 0,
    y: 0,
    ease: "Power4.inOut",
  });

  //左边文字移动
  leftCharTimeline.to(".left-char .char", {
    opacity: 1,
    delay: 1,
    duration: 0.5,
    rotation: 360,
    x: 0,
    ease: "Power4.inOut",
    stagger: 0.5,
  });

  /**
   * 右边部分移动
   */
  //右边背景移动
  rightTimeline.to(".right", {
    delay: 0.5,
    duration: 1,
    x: 0,
    y: 0,
    ease: "Power4.inOut",
  });

  //右边文字移动
  rightCharTimeline.to(".right-char .char", {
    opacity: 1,
    delay: 2.5,
    duration: 0.5,
    rotation: 360,
    x: 0,
    ease: "Power4.inOut",
    stagger: 0.5,
  });
});

/**
 * 切换背景和登录表格
 */
const showForm = () => {
  isShowBackground.value = false;
};
</script>

<template>
  <div class="container">
    <div v-if="isShowBackground" class="background">
      <div class="title" @click="showForm">
        <div class="left">
          <div class="left-char">
            <div class="char">M</div>
            <div class="char">a</div>
            <div class="char">e</div>
          </div>
        </div>
        <div class="right">
          <div class="right-char">
            <div class="char">G</div>
            <div class="char">P</div>
            <div class="char">T</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="form">
      <el-form
        v-if="isShow === 'login'"
        ref="loginFormRef"
        :model="loginForm"
        status-icon
        :rules="loginFormRules"
        label-width="100px"
        class="loginform"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="loginForm.account"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLoginForm(loginFormRef)">
            登入
          </el-button>
          <el-button @click="resetForm(loginFormRef)"> 重置 </el-button>
          <el-button @click="isShow = 'register'"> >>注册 </el-button>
        </el-form-item>
      </el-form>
      <el-form
        v-if="isShow === 'register'"
        ref="registerFormRef"
        :model="registerForm"
        status-icon
        :rules="registerRules"
        label-width="100px"
        class="registerform"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="registerForm.account"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input v-model.number="registerForm.checkpass" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitRegisterForm(registerFormRef)"
          >
            注册
          </el-button>
          <el-button @click="resetForm(registerFormRef)"> 重置 </el-button>
          <el-button @click="isShow = 'login'"> >>登陆 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  .background {
    // background-color: skyblue;
    min-height: 100vh;
    // min-height: -moz-available;
    // min-height: -webkit-fill-available;
    min-height: stretch;
    .title {
      position: relative;
      width: 100%;
      height: 100%;
      font-size: 5rem;
      color: black;
      overflow: hidden;

      .left {
        position: absolute;
        clip-path: polygon(0 0, 60% 0, 40% 100%, 0 100%);
        background-color: rgb(255, 65, 65);
        width: 100%;
        height: 100%;
        transform: translate(20%, -100%);
        .left-char {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-105%, -50%);
          &:hover {
            cursor: pointer;
          }
          .char {
            display: inline-block;
            margin-right: 6px;
            opacity: 0.3;
            transform: translateX(-50vw);
          }
        }
      }
      .right {
        position: absolute;
        clip-path: polygon(60% 0, 100% 0%, 100% 100%, 40% 100%);
        background-color: rgb(70, 255, 70);
        width: 100%;
        height: 100%;
        transform: translate(-20%, 100%);
        .right-char {
          position: absolute;
          top: 50%;
          right: 50%;
          transform: translate(105%, -50%);
          &:hover {
            cursor: pointer;
          }
          .char {
            display: inline-block;
            margin-right: 6px;
            opacity: 0.3;
            transform: translateX(50vw);
          }
        }
      }
    }
  }
  .form {
    .loginform {
      // box-sizing: border-box;
      position: absolute;
      width: 400px;
      height: 200px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding-right: 39px;
    }

    .registerform {
      position: absolute;
      width: 400px;
      height: 200px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding-right: 39px;
    }
  }
}
</style>
