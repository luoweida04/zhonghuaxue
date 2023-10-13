// import axios from "axios";
import axios from "../utils/http"
export function getAllRecords(token, page, size, key = ""){
    return axios({
        method: "post",
        url: `/project/result`,
        params: {
            page: page,
            size: size,
            project_name: key
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getRecordsOfUser(token, user_id) {
    return axios({
        method: "get",
        url: `/rate_record/user/${user_id}`,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getRecordsAnalysis(token, group_id, year, season) {
    return axios({
        method: "post",
        url: `/project/analysis`,
        params: {
            group_id: group_id,
            year: year,
            season: season
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getRecordsAnalysisOfRatee(token, group_id, year, ratee_id) {
    return axios({
        method: "post",
        url: `/project/analysis/${ratee_id}`,
        params: {
            group_id: group_id,
            year: year
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}