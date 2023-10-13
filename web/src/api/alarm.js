// import axios from "axios";
import axios from "../utils/http"
export function getAllAlarm(token, page, size, key = ""){
    return axios({
        method: "post",
        url: `/project/alarm`,
        params: {
            page: page,
            size: size,
            project_name: key,
            ratee_name: key
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function setAlarm(token, value){
    return axios({
        method: "post",
        url: `/project/alarm/set_threshold`,
        params: {
            value: value
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getAlarm(token){
    return axios({
        method: "post",
        url: `/project/alarm/get_threshold`,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
export function getAlarmDecrease(token, key="", season = 3){
    return axios({
        method: "post",
        url: `/project/alarm_decrease`,
        params: {
            project_name: key,
            ratee_name: key,
            season: season
        },
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
}
