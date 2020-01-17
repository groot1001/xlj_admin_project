/* eslint-disable indent */
import axios from 'axios'
/* *
  新增axios封装20190919
 */
export function axpGet(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

// eslint-disable-next-line space-before-blocks
export function axpPost(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, {
            transformRequest: [function (data) {
                let str = '';
                for (let key in data) {
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
                }
                return str;
            }]
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
// export function axpPost(url, data) {

//     return new Promise((resolve, reject) => {

//         axios.post(url,JSON.stringify(data),{headers:{'Content-Type': 'application/json;charset=UTF-8'}}).then(res => {
//             resolve(res.data)
//         }).catch(err => {
//             reject(err)
//         })
//     })
// }

// export function axpPost(url, data) {

//     return new Promise((resolve, reject) => {

//         axios.post(url,data).then(res => {
//             resolve(res.data)
//         }).catch(err => {
//             reject(err)
//         })
//     })
// }

