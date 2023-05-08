import {useCallback, useState} from "react";
import axios from 'axios';

// const SERVER = 'http://192.168.6.157:8666'

const INIT_DATA = Object.freeze({data: null, loading: false, error: null})

type UsePostInfo = {
    data: any,
    loading: boolean,
    error: any
}

export function usePost(defaultData: UsePostInfo = INIT_DATA) {
    const [info, setInfo] = useState(defaultData)

    const doFetch = useCallback((url: string, params: any = {}) => {
        return new Promise((resolve, reject) => {
            setInfo({...info, loading: true})
            axios.post(`/low-api${url}`, params).then(resContainer => {
                const res = resContainer.data;
                // console.log('res', res)
                // @ts-ignore
                if (res.code !== 0) return handleError(`${url} 请求出错：${res.msg}`)
                setInfo({loading: false, error: null, data: res.data})
                resolve(res.data)
            }).catch(handleError)

            function handleError(error:any) {
                // console.log('error', error)
                setInfo({loading: false, error, data: null})
                reject(error)
            }
        })
    }, [])

    return {...info, doFetch}
}