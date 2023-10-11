import { request } from "@/utils/http";
import type { RegisterInfo } from "@/types/userInfo";

// 登录函数
/**
 * @description: 登录函数
 * @param {data}  { mobile,password}
 * @return {promise}
 */
export function getRegister(data: RegisterInfo) {
  return request("/api/register", "POST", data);
}
