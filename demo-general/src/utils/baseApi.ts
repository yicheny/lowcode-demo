import axios from 'axios';

type METHOD = 'GET' | 'POST'

export type PARAMS = Record<any, any>

type CONFIG = {
    method:METHOD,
    url:string,
    data?:PARAMS,
    params?:PARAMS
}

export class BaseApi{
    protected getFixedConfig(){
        return {
        }
    }

    fetch(config:CONFIG){
        const fixedConfig = this.getFixedConfig()
        return axios.request({...fixedConfig,...config})
    }

    async get(url:string,params?:PARAMS){
        const res = await this.fetch({method:'GET',url, params})
        return res?.data;
    }

    async post(url:string,data:PARAMS={}){
        const res = await this.fetch({method:'POST',url, data})
        return res?.data;
    }
}

export const baseApi = new BaseApi()
