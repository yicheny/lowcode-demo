// @ts-ignore
import * as core from '@alilc/lowcode-renderer-core/lib'

const {transformStringToFunction} = core.utils

export function test(){
    try {
        const add = transformStringToFunction('function add(a,b){\n' +
            '    return a + b;\n' +
            '}')
        console.log('add', add(10,20))

        const add2 = transformStringToFunction('function add(a,b){\n    return a + b;\n}')
        console.log('add2', add2(20,40))

        const id = transformStringToFunction('function id(x){ return x }')
        console.log('id', id(88))
    }catch (e){
        // @ts-ignore
        console.error(`test执行异常：${e.message}`)
    }
}