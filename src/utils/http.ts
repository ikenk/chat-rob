import { useUserInfoStore } from '@/stores/userInfo'
import axios ,{ AxiosInstance, Method }from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router/index.ts'

//下面两行代码需放入方程中或setup函数中使用，不要放在全局使用
// //引入router
// const router = useRouter()
// //引入用户数据仓库
// const store = useUserInfoStore()


const instance:AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API.toString(),
  baseURL: import.meta.env.VITE_APP_BASE_API as string, //import.meta.env.VITE_APP_BASE_API为String类型，不是string类型
  // timeout: 5000 // request timeout
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    const store = useUserInfoStore()
    const token = store.getToken('user-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    //引入用户数据仓库
    const store = useUserInfoStore()
    // Token 401处理
    // console.dir(error.response.status.message)
    if (error.response.status === 401) {
      // 1. 跳转到登录
      router.push({name:'login'})
      // 2. 清空用户数据
      store.delToken('user-token')
    }
    // 错误统一处理
    ElMessage.error(error.response.data.message)
    console.log(error);
    return Promise.reject(error)
  }
)

export default instance


type Data<T> = {
  code:number
  message:string
  data?:T
}


export const request = <T>(
  url:string,
  method:Method = 'GET',
  data?:object
)=>{
  return instance.request<any,Data<T>>({
    url,
    method,
    [method.toUpperCase()==='GET'?'params':'data']:data
  })
}