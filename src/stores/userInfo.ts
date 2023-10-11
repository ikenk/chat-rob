import { defineStore } from "pinia";
export const useUserInfoStore = defineStore("userInfoStore", () => {
  // const token = ref<string>()

  const getToken = (key: string) => {
    return localStorage.getItem(key);
  };

  const setToken = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const delToken = (key: string) => {
    localStorage.removeItem(key);
  };

  return {
    getToken,
    setToken,
    delToken,
  };
});
