// import axios from "axios";
import axios from "../utils/http"
export function getAllGroups(access_token) {
    return axios({
        method: "POST",
        url: `/groups/own_groups`,
        headers: {
            authorization: `Bearer ${access_token}`
        }
    })
}
export function getGroupById(access_token, group_id) {
    return axios({
        method: "get",
        url: `/groups/${group_id}`,
        headers: {
            authorization: `Bearer ${access_token}`
        }
    })
}
export function getGroupsOfProject(access_token, project_id) {
    return axios({
        method: "post",
        url: `/project/groups`,
        params:{
            project_id: project_id
        },
        headers: {
            authorization: `Bearer ${access_token}`
        }
    })
}