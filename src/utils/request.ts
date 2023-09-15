import axios ,{ AxiosInstance, AxiosRequestConfig, AxiosResponse, Method }from 'axios'
import { ElMessage } from 'element-plus'

//下面两行代码需放入方程中或setup函数中使用，不要放在全局使用
//引入router
// const router = useRouter()
//引入用户数据仓库
// const store = useUserInfo()


const instance:AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API.toString(),
  baseURL: import.meta.env.VITE_APP_BASE_API as string, //import.meta.env.VITE_APP_BASE_API为String类型，不是string类型
  // timeout: 5000 // request timeout
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    // const token = '写上获取token的函数'
    // if (token) {
    //   config.headers.Authorization = token
    // }
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
    //引入路由
    const router = useRouter()
    // Token 401处理
    // console.dir(error.response.status.message)
    if (error.response.status === 401) {
      // 1. 跳转到登录
      router.push('/login')
      // 2. 清空用户数据
      // store.commit('user/clearUserInfo')
    }
    // 错误统一处理
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default instance


type Data<T> = {
  code:number
  message:string
  data:T
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