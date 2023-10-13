// import axios from "axios";
import axios from "../utils/http"
export function login(loginUsername, loginPassword) {
    return axios({
        method: "post",
        url: `/auth/jwt/login`,
        data: {
            username: loginUsername,
            password: loginPassword
        },
        transformRequest: [
            function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                ret = ret.substring(0, ret.lastIndexOf('&'));
                return ret
            }
        ],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}