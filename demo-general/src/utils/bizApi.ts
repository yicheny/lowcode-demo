import {BaseApi} from "./baseApi";

const UUID = 'crooteyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjcm9vdCIsInN1YiI6Ijk5OTkwIiwiTUZBX0tFWSI6MTY2MTkzNzMzMjEzNzIzMDMzNiwiZXhwIjoxNjg1Njc2NTExLCJuYmYiOjE2ODUwNzE3MTF9.FGgKb-clsXkCMsDiTJKsFwWbM7rj-momCDXqCIp4Sgc'

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