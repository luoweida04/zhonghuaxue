// import axios from "axios";
import axios from "../utils/http"
export function getUsers(token, page, size, key = ""){
    return axios({
        method: "get",
        url: `/users`,
        params: {
            page: page,
            size: size,
            username: key
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getUserProfileById(token, user_id){
    return axios({
        method: "post",
        url: `/user/profile/${user_id}`,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function deleteUser(token, id){
    return axios({
        method: "delete",
        url: `/users/${id}`,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getUserRecordDetail(token, page, size, project_id, user_id){
    return axios({
        method: "get",
        url: `/rate_record/project/${project_id}/user/${user_id}`,
        params: {
            page: page,
            size: size,
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}