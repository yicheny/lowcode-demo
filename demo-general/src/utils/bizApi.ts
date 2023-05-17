import {BaseApi} from "./baseApi";

const UUID = 'crooteyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjcm9vdCIsInN1YiI6Ijk5OTkwIiwiTUZBX0tFWSI6MTY1ODc3NDA1ODY5NjcwNDAwMCwiZXhwIjoxNjg0OTIyMzI4LCJuYmYiOjE2ODQzMTc1Mjh9.Sc4T4KaF4O3or0RRf4HR4l-ObYDYRF2fYYoEnDkpjUo'

class BizApi extends BaseApi{
    protected getFixedConfig() {
        return {
            ...super.getFixedConfig(),
            headers:{
                uuid:UUID
            },
            baseURL:'http://172.22.7.67:23333/api',
            // proxy: {
            //     protocol: 'http',
            //     host:"172.22.7.67",
            //     port: 23333,
            //     // uuid: UUID
            // }
        }
    }
}

export const bizApi = new BizApi()