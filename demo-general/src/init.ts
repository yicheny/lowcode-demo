import {baseApi, bizApi} from "./utils";
// @ts-ignore
import {df} from 'ylf-utils'
import {BizColumnSetter} from "./setters/BizColumnSetter";

export async function appInit(){
    console.log('appInit start...')

    await registerBizSetters()

    await addWindowProps()

    // await apiTest();

    console.log('appInit end...')
}

//------------函数定义区----------------
async function apiTest(){
    // ---测试baseApi---
    // const data = await baseApi.get('https://v1.hitokoto.cn',{ encode:'json' })
    const data = await baseApi.get('https://v1.hitokoto.cn?encode=json')
    console.log('data', data)

    // ---测试bizApi---
    const bizData = await bizApi.post('/base-server/account/counterParty/queryList')
    console.log('bizData', bizData)
}

async function addWindowProps(){
    // @ts-ignore
    window._lib = {
        baseApi,
        bizApi,
        df
    }
}

async function registerBizSetters(){
    // @ts-ignore
    const registerSetter = window.AliLowCodeEngine.setters.registerSetter;
    registerSetter('BizColumnSetter', BizColumnSetter);
}