import {useCallback, useState} from "react";

type OpenInfo = {
    type?:number | string
}

export function useOpen(defaultValue:OpenInfo = {}){
    const [openInfo,setOpenInfo] = useState(defaultValue)

    const close = useCallback(()=>{
        setOpenInfo({})
    },[])

    const checkOpenType = useCallback((type?:number | string)=>{
        return type === openInfo.type
    },[openInfo.type])

    return {openInfo,setOpenInfo,close,checkOpenType}
}