import {BaseApi} from "./baseApi";

class LowApi extends BaseApi{
    protected getFixedConfig() {
        return {
            ...super.getFixedConfig(),
            baseURL:'/low-api/api',
        }
    }
}

export const lowApi = new LowApi();