import {useCallback, useState} from "react";

export enum OPEN {
    EMPTY,
    ADD,
    EDIT,
    DEL
}

type OpenInfo = {
    type:OPEN
    [key:string]:any
}

export function useOpen(defaultValue:OpenInfo = {type:OPEN.EMPTY}){
    const [openInfo,setOpenInfo] = useState(defaultValue)

    const close = useCallback(()=>{
        setOpenInfo({type:OPEN.EMPTY})
    },[])

    const checkOpenType = useCallback((type?:number | string)=>{
        return type === openInfo.type
    },[openInfo.type])

    return {openInfo,setOpenInfo,close,checkOpenType}
}