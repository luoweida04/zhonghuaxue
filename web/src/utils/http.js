import axios from "axios";
// import { login } from "../api/login"
const request = axios.create()
request.interceptors.request.use(
    config => {
        config.headers.Authorization = `Bearer ${window.sessionStorage.getItem('access_token')}`
        // 在最后必须 return config
        return config
    }
)
// request.interceptors.response.use(
//     config => {
//         console.log('config');
//         config.headers.Authorization = `Bearer ${window.sessionStorage.getItem('access_token')}`
//         // 在最后必须 return config
//         return config
//     },
//     error => {
//         //其他异常
//         if (error && error.response) {
//             switch (error.response.status) {
//                 case 401:
//                     console.log('401捕获');
//                     login(localStorage.getItem("loginUsername"),localStorage.getItem("loginPassword")).then((res) => {
//                         console.log('newToken', res);
//                         sessionStorage.setItem("access_token", res.data.access_token);
//                     }).catch(function () {
//                         alert("登录失败, 用户名或密码错误");
//                       })
//                     // throw new Error()
//                     break;
//                 default:
//             }
//         }
//         // return Promise.reject(error);
//         return
//     }
// )

export default request