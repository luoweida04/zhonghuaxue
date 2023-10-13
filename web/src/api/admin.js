// import axios from "axios";
import axios from "../utils/http"
export function getAllAdmin(token, page, size, key = "") {
    return axios({
        method: "get",
        url: `/admin/all`,
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
export function createAdmin(token, group_id, data) {
    return axios({
        method: "post",
        url: `/admin/create`,
        params: {
            group_id: group_id
        },
        data: data,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function delteAdmin(token, user_id) {
    return axios({
        method: "delete",
        url: `/admin/delete`,
        params: {
            user_id: user_id
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function updateAdmin(token, user_id, data) {
    return axios({
        method: "put",
        url: `/admin/update/${user_id}`,
        data: data,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}