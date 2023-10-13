// import axios from "axios";
import axios from "../utils/http"
export function getPorject(access_token, page, size, key = "") {
    return axios({
        method: "get",
        url: `/project`,
        params: {
            page: page,
            size: size,
            name: key
        },
        headers: {
            authorization: `Bearer ${access_token}`
        }
    })
}
export function oper(access_token, id, obj) {
    return axios({
        method: "put",
        url: `/project/${id}`,
        data: obj,
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${access_token}`
        }
    })
}
export function getProjectById(access_token, id) {
    return axios({
        method: "get",
        url: `/project/${id}`,
        headers: {
            'authorization': `Bearer ${access_token}`
        }
    })
}
export function createProject(access_token, group_id, obj) {
    return axios({
        method: "post",
        url: `/project`,
        params: {
            group_id: group_id
        },
        data: obj,
        headers: {
            'authorization': `Bearer ${access_token}`
        }
    })
}
export function getProjectDetail(access_token, project_id) {
    return axios({
        method: "post",
        url: `/project/detail`,
        params: {
            project_id: project_id
        },
        headers: {
            'authorization': `Bearer ${access_token}`
        }
    })
}
export function getProjectDetailOfRatee(access_token, ratee_id, project_id, page=1, size=10) {
    return axios({
        method: "post",
        url: `/project/detail/${ratee_id}/${project_id}`,
        params: {
            page: page,
            size: size
        },
        headers: {
            'authorization': `Bearer ${access_token}`
        }
    })
}