/**
 @author: wbb
 @date: 2021/4/10
 @Version: 1.0
 */

let DEV_URL = ''
let PROD_URL = ''

if (process.env.NODE_ENV === 'development') {
    DEV_URL = 'http://localhost:8081/'
}
if (process.env.NODE_ENV === 'development'){
    PROD_URL = 'https://binbin-dev.bcjgy.com/'
}


export default {
    PROD_URL,
    DEV_URL
}
