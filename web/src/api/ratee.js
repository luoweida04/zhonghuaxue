// import axios from "axios";
import axios from "../utils/http"
export function getAllRatee(token, page = 1, size = 50, key = "") {
    return axios({
        method: "get",
        url: `/ratee`,
        params: {
            page: page,
            size: size,
            name: key
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getOneRatee(token, item_id) {
    return axios({
        method: "get",
        url: `/ratee/${item_id}`,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getAllRateeOfProject(token, page = 1, size = 50, project_id) {
    return axios({
        method: "post",
        url: `/ratee/project/${project_id}`,
        params: {
            page: page,
            size: size
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getRateeRecords(token, ratee_id) {
    return axios({
        method: "get",
        url: `/rate_record/ratee/${ratee_id}`,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function deleteRatee(token, item_id) {
    return axios({
        method: "delete",
        url: `/ratee/${item_id}`,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function createRatee(token, group_id, data) {
    return axios({
        method: "post",
        url: `/ratee`,
        params: {
            group_id: group_id
        },
        data: data,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}