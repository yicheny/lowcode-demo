import {BaseApi} from "./baseApi";

const UUID = 'crooteyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjcm9vdCIsInN1YiI6Ijk5OTkwIiwiTUZBX0tFWSI6MTExMTExMTExMTExMSwiZXhwIjoxMDAwMTY4NTUyMjY3NSwibmJmIjoxNjg1NTIyNjc1fQ.PYlreNFDd5tqFo-HJeVWeoT5nKGwzIQ0HuwxkZcGj40'

class BizApi extends BaseApi{
    protected getFixedConfig() {
        return {
            ...super.getFixedConfig(),
            headers:{
                uuid:UUID
            },
            baseURL:'http://172.20.1.90:8000/api',
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