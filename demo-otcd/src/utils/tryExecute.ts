import {message} from 'antd'

type CatchCallback = (message:string, err?:any) => void;

export async function tryExecute(callback:()=>void, catchCallback:CatchCallback = openMessage){
    try {
        return await callback()
    }catch (e:any){
        catchCallback(e.message)
    }
}

function openMessage(info:any) {
    message.error(info)
}