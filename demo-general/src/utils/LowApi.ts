import {BaseApi, PARAMS} from "./baseApi";
import {loginStore} from "./stores";

class LowApi extends BaseApi{
    protected getFixedConfig() {
        const userInfo = loginStore.read()
        // console.log('userInfo', userInfo)
        return {
            ...super.getFixedConfig(),
            headers:{
                'User-Id': userInfo?.userId
            },
            baseURL:'/low-api',
        }
    }

    async post(url:string,data:PARAMS={}){
        const result = await super.post(url,data)
        if(result.code === '000000') return result.data
        throw new Error(`${url}请求异常，错误码:${result.code} 消息:${result.message}`)
    }
}

export const lowApi = new LowApi();