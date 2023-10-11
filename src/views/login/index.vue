<script setup lang="ts">
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
</script>

<template>
  <div class="container">
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
        <el-input v-model="loginForm.account" type="text" autocomplete="off" />
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
        <el-button type="primary" @click="submitRegisterForm(registerFormRef)">
          注册
        </el-button>
        <el-button @click="resetForm(registerFormRef)"> 重置 </el-button>
        <el-button @click="isShow = 'login'"> >>登陆 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.container {
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
</style>
